import database from "../database/db.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { v2 as cloudinary } from "cloudinary";
import { getAIRecommendation } from "../utils/getAIRecommendation.js";
import { findSimilarProducts } from "../utils/knnRecommendation.js";
import axios from "axios";
import { notifyStockAlertSubscribers } from "./stockAlertController.js";

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
      price, //indian value bydefault dollar not good pratice
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

  const page = parseInt(req.query.page) || 1; // fallback value if page is not provided or invalid and let say req.query.page is string so parseInt convert it into number and if empty toh parseInt(NaN) so fallback value is 1

  const limit = 10;
  //  "Because page numbering starts from 1, while database row offset starts from 0. So for page 3 and limit 10, we skip first 20 records and fetch the next 10."
  const offset = (page - 1) * limit;
  // if user ask 6 page pr jo product hai wo dekhao
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

  //INDEX YHA PR ISLIYE HAI KYOKI PRICE ME 2 VALUE HAI MIN AND MAX TO USKE LIYE 2 PLACEHOLDER CHAHIYE AND +2 KRNE SE AGLE PLACEHOLDER PR CHALA JAYEGA OR BAAD M CATEGORY AND RATING KE LIYE BHI SIRF EK EK PLACEHOLDER CHAHIYE TO USKE LIYE +1 KRNE SE AGLE PLACEHOLDER PR CHALA JAYEGA

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
      `(p.name ILIKE $${index} OR p.description ILIKE $${index})`,
    );
    values.push(`%${search}%`);
    index++;
  }

  //conditions is array of all conditions and join them with AND and if no condition then whereClause is empty string and is used in query to fetch products
  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  // Get count of filtered products
  const totalProductsResult = await database.query(
    `SELECT COUNT(*) FROM products p ${whereClause}`,
    values,
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

  // QUERY FOR FETCHING NEW PRODUCTS jo 30 days me create hue hai and left join kr rhe hai reviews se taki review count bhi mil jaye and agar review nhi hai toh bhi product show hoga coz left join hai and group by kr rhe id se taki har product alag row me aaye and order by kr rhe created_at se taki naye product pehle aaye and limit 8 kr rhe taki sirf 8 product show ho

  //us prdouct ki review nikalna h isliye v left join
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
  //new products ka result store kr rhe database se query karke and uske baad response me bhej rhe client ko taki client naye product bhi dikha ske homepage pr

  const newProductsResult = await database.query(newProductsQuery);

  // QUERY FOR FETCHING TOP RATING PRODUCTS (rating >= 4.5)
  //sara data from product table and left join with reveiws ke product_id se only that will be given

  // if rating of product is >= 4.5 it will be top rated
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

//named export only be imported with same name and in curly braces and we can have multiple named export in a file and default export can be imported with any name and without curly braces and only one default export is allowed in a file

export const fetchProductsByIds = catchAsyncErrors(async (req, res, next) => {
  const ids = req.query.ids ? req.query.ids.split(",").filter(Boolean) : [];
  if (ids.length === 0) {
    return res.status(200).json({ success: true, products: [] });
  }

  const result = await database.query(
    `
     SELECT p.*, COUNT(r.id) AS review_count
     FROM products p
     LEFT JOIN reviews r ON p.id = r.product_id
     WHERE p.id = ANY($1::uuid[])
     GROUP BY p.id
     ORDER BY array_position($1::uuid[], p.id)
   `,
    [ids],
  );

  res.status(200).json({ success: true, products: result.rows });
});

//update product m he back in stock alert bhej rhe hai user ko agar stock 0 se >0 hua toh
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { productID } = req.params; //updating product based on id and productID is coming from params and req.params is an object containing properties mapped to the named route "parameters". For example, if you have a route defined as /products/:productID, and a request is made to /products/123, then req.params.productID will be '123'.

  const { name, description, price, category, stock } = req.body;

  if (!name || !description || price == null || !category || stock == null) {
    return next(
      new ErrorHandler("Please provide complete product details", 400),
    );
  }

  //based on id by req.parms fetch the product and store it in product variable
  const product = await database.query(`SELECT * FROM products WHERE id = $1`, [
    productID,
  ]);

  //if no product is found for that id
  if (product.rows.length === 0) {
    return next(new ErrorHandler("Product not found", 404));
  }

  //US product ki stock value store kr rhe previousStock me taki update hone ke baad check kr ske ki stock 0 se >0 hua ya nhi aur agar hua toh notify kr ske subscribers ko
  const previousStock = product.rows[0].stock;

  // product ko result main store krle
  const result = await database.query(
    `UPDATE products SET name = $1 , description= $2, price=$3, category = $4, stock=$5 WHERE id= $6 
    RETURNING *`,
    [name, description, price, category, stock, productID],
  );

  // Notify subscribers if product goes from out of stock to in stock
  //mtlb phle out of stock tha and aab stock m h toh bta do user ko isliye uska controller call krke
  if (previousStock === 0 && stock > 0) {
    try {
      console.log(
        `📧 Triggering stock alert for product: ${result.rows[0].name}`,
      );
      await notifyStockAlertSubscribers(productID, result.rows[0].name);
      console.log(
        `✅ Stock alert notifications sent for product: ${result.rows[0].name}`,
      );
    } catch (error) {
      console.error(
        `❌ Failed to send stock alerts for ${result.rows[0].name}:`,
        error.message,
      );
    }
  }

  res.status(200).json({
    success: true,
    message: "Product Updated Sucessfully",
    updateProduct: result.rows[0], //return same product but updated
  });
});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  const product = await database.query("SELECT * FROM products WHERE id = $1", [
    productId,
  ]);
  if (product.rows.length === 0) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  //first store images then delete coz later will not be able to access image on this id and images is an array of objects with url and public_id
  const images = product.rows[0].images;

  const deleteResult = await database.query(
    "DELETE FROM products WHERE id = $1 RETURNING *",
    [productId],
  );

  if (deleteResult.rows.length === 0) {
    return next(new ErrorHandler("Failed to delete product.", 500));
  }

  // Delete images from Cloudinary
  if (images && images.length > 0) {
    for (const image of images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
  });
});

export const fetchSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  const result = await database.query(
    //json_build_object means data of reviewer will be in obj format
    //COALESE aggregate multiple tables data in obj format
    //r  means reviews table
    //FILTER(if review exist) if not return empty array explain remain

    `
        SELECT p.*,
        COALESCE(
        json_agg(
        json_build_object(
            'review_id', r.id,
            'rating', r.rating,
            'comment', r.comment,
            'reviewer', json_build_object(
            'id', u.id,
            'name', u.name,
            'avatar', u.avatar
            )) 
        ) FILTER (WHERE r.id IS NOT NULL), '[]') AS reviews
         FROM products p
         LEFT JOIN reviews r ON p.id = r.product_id
         LEFT JOIN users u ON r.user_id = u.id
         WHERE p.id  = $1
         GROUP BY p.id`,
    [productId],
  );

  res.status(200).json({
    success: true,
    message: "Product fetched successfully.",
    product: result.rows[0], //shows single prod
  });
});

//after payment integration
export const postProductReview = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return next(new ErrorHandler("Please provide rating and comment.", 400));
  }

  // Purchase before review
  const purchasheCheckQuery = `
    SELECT oi.product_id
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    JOIN payments p ON p.order_id = o.id
    WHERE o.buyer_id = $1
    AND oi.product_id = $2
    AND p.payment_status = 'Paid'
    LIMIT 1
  `;

  const { rows } = await database.query(purchasheCheckQuery, [
    req.user.id,
    productId,
  ]);

  if (rows.length === 0) {
    return res.status(403).json({
      success: false,
      message: "You can only review a product you've purchased.",
    });
  }

  const product = await database.query("SELECT * FROM products WHERE id = $1", [
    productId,
  ]);

  if (product.rows.length === 0) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  const isAlreadyReviewed = await database.query(
    `
      SELECT * FROM reviews
      WHERE product_id = $1 AND user_id = $2
    `,
    [productId, req.user.id],
  );

  let review;

  // Update existing review
  if (isAlreadyReviewed.rows.length > 0) {
    review = await database.query(
      `
        UPDATE reviews
        SET rating = $1, comment = $2
        WHERE product_id = $3 AND user_id = $4
        RETURNING *
      `,
      [rating, comment, productId, req.user.id],
    );
  }
  // Insert new review
  else {
    review = await database.query(
      `
        INSERT INTO reviews
        (product_id, user_id, rating, comment)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [productId, req.user.id, rating, comment],
    );
  }

  // Calculate new average rating
  const allReviews = await database.query(
    `
      SELECT AVG(rating) AS avg_rating
      FROM reviews
      WHERE product_id = $1
    `,
    [productId],
  );

  const newAvgRating = allReviews.rows[0].avg_rating;

  // Update product rating
  const updatedProduct = await database.query(
    `
      UPDATE products
      SET ratings = $1
      WHERE id = $2
      RETURNING *
    `,
    [newAvgRating, productId],
  );

  res.status(200).json({
    success: true,
    message: "Review posted successfully.",
    review: review.rows[0],
    product: updatedProduct.rows[0],
  });
});

export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;

  //delete review based on  id of product and user and store it in review var
  const review = await database.query(
    "DELETE FROM reviews WHERE product_id = $1 AND user_id = $2 RETURNING *",
    [productId, req.user.id],
  );

  //review is now new reviews after deleting a review
  if (review.rows.length === 0) {
    return next(new ErrorHandler("Review not found.", 404));
  }
  //get avg
  const allReviews = await database.query(
    `SELECT AVG(rating) AS avg_rating FROM reviews WHERE product_id = $1`,
    [productId],
  );

  //new avg
  const newAvgRating = allReviews.rows[0].avg_rating;

  //updated prod
  const updatedProduct = await database.query(
    `
        UPDATE products SET ratings = $1 WHERE id = $2 RETURNING *
        `,
    [newAvgRating, productId],
  );

  res.status(200).json({
    success: true,
    message: "Your review has been deleted.",
    review: review.rows[0],
    product: updatedProduct.rows[0],
  });
});

export const fetchAIFilteredProducts = catchAsyncErrors(
  async (req, res, next) => {
    const { userPrompt } = req.body;
    console.log("userPrompt :", userPrompt);

    //400 bad req
    if (!userPrompt) {
      return next(new ErrorHandler("Provide a valid prompt.", 400));
    }
    //I need a Book here I and a is stop Word
    const filterKeywords = (query) => {
      const stopWords = new Set([
        "the",
        "they",
        "them",
        "then",
        "I",
        "we",
        "you",
        "he",
        "she",
        "it",
        "is",
        "a",
        "an",
        "of",
        "and",
        "or",
        "to",
        "for",
        "from",
        "on",
        "who",
        "whom",
        "why",
        "when",
        "which",
        "with",
        "this",
        "that",
        "in",
        "at",
        "by",
        "be",
        "not",
        "was",
        "were",
        "has",
        "have",
        "had",
        "do",
        "does",
        "did",
        "so",
        "some",
        "any",
        "how",
        "can",
        "could",
        "should",
        "would",
        "there",
        "here",
        "just",
        "than",
        "because",
        "but",
        "its",
        "it's",
        "if",
        ".",
        ",",
        "!",
        "?",
        ">",
        "<",
        ";",
        "`",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
      ]);

      return query
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/) //split on based of space
        .filter((word) => !stopWords.has(word)) //remove stop words
        .map((word) => `%${word}%`); //%% is used to convert word into sql query
    };

    const keywords = filterKeywords(userPrompt); //userPrompt is sending as query inside filterKeywords method

    // STEP 1: Basic SQL Filtering
    const result = await database.query(
      `
        SELECT * FROM products
        WHERE name ILIKE ANY($1)
        OR description ILIKE ANY($1)
        OR category ILIKE ANY($1)
        LIMIT 200;     
        `,
      //200 is word limit of prompt
      [keywords],
    );

    const filteredProducts = result.rows;

    if (filteredProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No products found matching your prompt.",
        products: [],
      });
    }

    // STEP 2: AI FILTERING here we r calling fn
    // STEP 2: AI FILTERING
    const { success, products } = await getAIRecommendation(
      userPrompt,
      filteredProducts,
    );

    if (!success) {
      return res.status(200).json({
        success: true,
        message: "AI unavailable. Showing SQL filtered products.",
        products: filteredProducts,
      });
    }

    res.status(200).json({
      success: true,
      message: "AI filtered products.",
      products,
    });

    res.status(200).json({
      success: success,
      message: "AI filtered products.",
      products,
      Z,
    });
  },
);

export const bulkCreateProducts = catchAsyncErrors(async (req, res, next) => {
  const created_by = req.user.id;

  if (!req.body.products) {
    return next(new ErrorHandler("Products data is required", 400));
  }

  let products;
  try {
    products = JSON.parse(req.body.products);
  } catch (err) {
    return next(new ErrorHandler("Invalid products JSON format", 400));
  }

  if (!Array.isArray(products) || products.length === 0) {
    return next(new ErrorHandler("Products must be a non-empty array", 400));
  }

  const insertedProducts = [];
  const errors = [];

  for (let i = 0; i < products.length; i++) {
    const { name, description, price, category, stock, images } = products[i];

    if (!name || !description || price == null || !category || stock == null) {
      errors.push({ index: i, error: "Missing required fields" });
      continue; // skip this one, don't fail entire batch
    }

    let uploadedImages = [];
    const imageKey = `images_${i}`;

    if (req.files && req.files[imageKey]) {
      // Case 1: actual file uploaded via Postman form-data -> push to Cloudinary
      const files = Array.isArray(req.files[imageKey])
        ? req.files[imageKey]
        : [req.files[imageKey]];

      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "Ecommerce_Product_Images",
          width: 150,
          scale: "scale",
        });
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    } else if (Array.isArray(images) && images.length > 0) {
      // Case 2: direct image URLs provided in JSON (e.g. Unsplash) -> use as-is, no upload
      uploadedImages = images.map((url) => ({ url, public_id: null }));
    }

    try {
      const inserted = await database.query(
        `INSERT INTO products
         (name, description, price, category, stock, images, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          name,
          description,
          price,
          category,
          stock,
          JSON.stringify(uploadedImages),
          created_by,
        ],
      );
      insertedProducts.push(inserted.rows[0]);
    } catch (err) {
      errors.push({ index: i, error: err.message });
    }
  }

  res.status(201).json({
    success: true,
    message: `${insertedProducts.length} of ${products.length} products uploaded successfully.`,
    products: insertedProducts,
    errors: errors.length > 0 ? errors : undefined,
  });
});

export const chatWithBot = catchAsyncErrors(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return next(new ErrorHandler("Message is required", 400));
  }

  const API_KEY = process.env.api_key;

  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  try {
    // Fetch a few products to give the bot context about the store
    const productsResult = await database.query(
      `SELECT name, price, category, stock FROM products ORDER BY created_at DESC LIMIT 30`,
    );

    const productList = productsResult.rows
      .map(
        (p) =>
          `${p.name} (${p.category}) - ₹${Math.round(p.price * 87)} - ${p.stock > 0 ? "In Stock" : "Out of Stock"}`,
      )
      .join("\n");

    const systemPrompt = `You are CartSyy Assistant, a friendly and helpful shopping assistant for an online store called CartSyy.

Here are some products currently available in the store:
${productList}

Guidelines:
- Answer the user's question helpfully and conversationally.
- If they ask about products, recommend relevant ones from the list above.
- If they ask something unrelated to shopping, politely redirect them to shopping-related help.
- Keep responses short and friendly — 2 to 3 sentences max.
- Use ₹ for prices, do not use $.`;

    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data?.error) {
      console.log("Gemini chat error:", data.error);
      return res.status(200).json({
        success: false,
        reply:
          "Sorry, I'm having trouble right now. Please try again in a moment.",
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "Sorry, I couldn't understand that. Could you rephrase?";

    res.status(200).json({ success: true, reply });
  } catch (error) {
    console.log("chatWithBot error:", error.message);
    res.status(200).json({
      success: false,
      reply: "Connection error. Please try again.",
    });
  }
});
// Add this import at the top of productController.js:
// import { findSimilarProducts } from "../utils/knnRecommendation.js";

export const fetchSimilarProducts = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const k = parseInt(req.query.k) || 5;

  // Fetch lightweight fields only — enough to build feature vectors and display cards
  const result = await database.query(
    `SELECT id, name, price, category, ratings, images, stock FROM products`,
  );

  const allProducts = result.rows;

  const targetExists = allProducts.some((p) => p.id === productId);
  if (!targetExists) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  const similarProducts = findSimilarProducts(allProducts, productId, k);

  res.status(200).json({
    success: true,
    message: "Similar products fetched successfully.",
    products: similarProducts,
  });
});
