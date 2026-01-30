import database from "../database/db.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { v2 as cloudinary } from "cloudinary";

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;

  const created_by = req.user.id; //id of user

  if (!name || !description || !price || !category || !stock) {
    return next(
      new ErrorHandler("Please provide complete product details", 400),
    );
  }

  let uploadedImage = [];

  //images name of obkject is
  if (req.files && req.files.images) {
    //if images is array or not return true or false
    const images = Array.isArray(req.files.images)
      ? req.files.images //if a single image is there store directly in images var
      : [req.files.images]; //if images is in form of objects store in array form in var

    //'for of loop' Iterates over values, not keys or indices
    for (const image of images) {
      //upload image from images in cloudinary and  store it inn result
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "Ecommerce_Product_Images",
        width: 150,
        scale: "scale",
      });
      //push in uploadedImages
      uploadedImage.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  }
  const product = await database.query(
    `INSERT into products 
     (name , description, price, category , stock , images , created_by) 
     VALUES ($1, $2 ,$3, $4, $5, $6, $7) RETURNING * `,
    [
      name,
      description,
      price / 87, //indian value bydefault dollar not good pratice
      //make another api which automatically calculate daily up and dowmn
      category,
      stock,
      JSON.stringify(uploadedImage),
      created_by,
    ],
  );

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product: product.rows[0],
  });
});

export const fetchAllProducts = catchAsyncErrors(async (req, res, next) => {
  
  const { availability, price, category, ratings, search } = req.query;
  
  const page = parseInt(req.query.page) || 1; //bydefault in page 1
  //but if page requested by user store it in page
  
  const limit = 10;
 
  const offset = (page - 1) * limit; //6 page pr jo product hai wo dekhao
  //so 5*10 = 50 prdoucts  so offset 50 ke baad wle 10 product lake dega

  const conditions = [];
  let values = [];
  let index = 1;
  let paginationPlaceholders = {};

  //filter products by Availiability
  if (availability === "in-stock") {
    conditions.push("stocks>5");
  } else if (availability === "limited") {
    conditions.push("stocks>0 AND stocks <=5");
  } else if (availability === "out-of-stock") {
    conditions.push(`stock = 0`);
  }
  
  

  //filter products by price
  // price == ['1000-10000'];

  if (price) {
    const [minPrice, maxPrice] = price.split("-");
    //one half is minPrice and another is maxPrice
    if (minPrice && maxPrice) {
      conditions.push(`price BETWEEN $${index} AND $${index + 1}`);
      values.push(minPrice, maxPrice);
      index += 2; //$1 and $2 and now index value is updated to 3
    }
  }

  //filter products by category
  if (category) {
    conditions.push(`category ILIKE $${index}`);
    values.push(`%${category}%`);
    index++;
  }

  //filter products by rating
  if (ratings) {
    conditions.push(`rating >= $${index}`);
    values.push(ratings);
    index++;
  }

// Add search query
//p is products
  if (search) {
    conditions.push(
      `(p.name ILIKE $${index} OR p.description ILIKE $${index})`
    );
    values.push(`%${search}%`);
    index++;
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  // Get count of filtered products
  const totalProductsResult = await database.query(
    `SELECT COUNT(*) FROM products p ${whereClause}`,
    values
  );

  const totalProducts = parseInt(totalProductsResult.rows[0].count);

  paginationPlaceholders.limit = `$${index}`;
  values.push(limit);
  index++;

  paginationPlaceholders.offset = `$${index}`;
  values.push(offset);
  index++;

  // FETCH WITH REVIEWS
  const query = `
    SELECT p.*, 
    COUNT(r.id) AS review_count 
    FROM products p 
    LEFT JOIN reviews r ON p.id = r.product_id
    ${whereClause}
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT ${paginationPlaceholders.limit}
    OFFSET ${paginationPlaceholders.offset}
    `;

  const result = await database.query(query, values);

  // QUERY FOR FETCHING NEW PRODUCTS
  const newProductsQuery = `
    SELECT p.*,
    COUNT(r.id) AS review_count
    FROM products p
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT 8
  `;
  const newProductsResult = await database.query(newProductsQuery);

  // QUERY FOR FETCHING TOP RATING PRODUCTS (rating >= 4.5)
  //sara data from product table and left join with reveiws ke product_id se only that will be given
  const topRatedQuery = `
    SELECT p.*,
    COUNT(r.id) AS review_count
    FROM products p 
    LEFT JOIN reviews r ON p.id = r.product_id
    WHERE p.ratings >= 4.5
    GROUP BY p.id
    ORDER BY p.ratings DESC, p.created_at DESC
    LIMIT 8
  `;
  const topRatedResult = await database.query(topRatedQuery);

  res.status(200).json({
    success: true,
    products: result.rows,
    totalProducts,
    newProducts: newProductsResult.rows,
    topRatedProducts: topRatedResult.rows,
  });
});


/*params?? req.params; kya hai
  so let say http://localhost:4000//password/reset/:token for resetpassword controller
  here token is params
  if http://localhost:4000//products?category=Smartphones
   here this is query
*/
