import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";

const ProductSlider = ({ title, products }) => {
  const scrollRef = useRef(null);
  //useRef to reference the scrollable container and programmatically scroll it when the left/right buttons are clicked.

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth", 
      });
    }
  };

  const dispatch = useDispatch();
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents the click event from bubbling up to the Link component, which would navigate to the product page.
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <>
      <section className="py-16">
        <div className="flex items-center justify-between mb-8">
        
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        
          <div className="flex space-x-2">
           
            <button
              onClick={() => scroll("left")} //'left is direction' passed to scroll function to determine scroll direction
              className="p-2 glass-card hover:glow-on-hover animate-smooth"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
           
            <button
              onClick={() => scroll("right")}
              className="p-2 glass-card hover:glow-on-hover animate-smooth"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex space-x-6 overflow-x-visible scrollbar-hide pb-4 animate-marquee overflow-x-auto"
        >
          {products.map((product) => {
            return (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="flex-shrink-0 w-80 glass-card hover:glow-on-hover animate-smooth group"
              >
                {/* PRODUCT IMAGE */}
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                     src={product.images?.[0]?.url || "/placeholder.png"}
                     alt={product.name || "Product Image"}
                    className="w-full h-48 object-contain group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* BADGES */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {/* UPDATE THIS CODE */}
                    {new Date() - new Date(product.created_at) <
                      30 * 24 * 60 * 60 * 1000 //30 days in milliseconds 
                      // if product is added within last 30 days show new badge
                       && (
                      <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                        NEW
                      </span>
                    )}
                    {product.ratings >= 4.5 && (
                      <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-rose-500 text-white  bg-primary text-primary-foreground text-xs font-semibold rounded">
                        TOP RATED
                      </span>
                    )}
                  </div>

                  {/* QUICK ADD TO CART*/}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="absolute bottom-3 right-3 p-2 glass-card hover:glow-on-hover animate-smooth opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-5 h-5 text-primary" />
                  </button>
                </div>

                {/* PRODUCT INFO */}
                <div>
                  {/* PRODUCT TITLE */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  {/* PRODUCT RATINGS */}
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => {
                        return (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.ratings)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.review_count})
                    </span>
                  </div>

                  {/* PRODUCT PRICE */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-primary">
                      ${product.price}
                    </span>
                  </div>

                  {/* PRODUCT AVAILABILITY */}
                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        product.stock > 5
                          ? "bg-green-500/20 text-green-400"
                          : product.stock > 0
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {product.stock > 5
                        ? "In Stock" 
                        : product.stock > 0
                        ? "Limited Stock" 
                        : "Out of Stock"}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2 italic  text-orange-400 animate-pulse">
                      {product.stock<5 && product.stock > 0 && `Hurry!! up only ${product.stock} left`}
                      {product.stock === 0 && `Out of stock!! restocking soon`}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ProductSlider;
