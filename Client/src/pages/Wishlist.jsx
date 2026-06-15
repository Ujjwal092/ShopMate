import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Heart, Star, ShoppingCart, Trash2, Loader } from "lucide-react";
import {
  fetchWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import { addToCart } from "../store/slices/cartSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (e, productId) => {
    e.stopPropagation();
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-7 h-7 text-primary fill-primary heart-beat" />
          <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
          <span className="text-muted-foreground">({wishlist.length})</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="glass-panel text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-muted-foreground mb-6">
              Save items you love by tapping the heart icon on any product.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover animate-smooth"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="glass-card cursor-pointer transition-transform hover:scale-[1.02] overflow-hidden"
              >
                <div className="relative h-44 w-full bg-secondary">
                  {product.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                      No image
                    </div>
                  )}

                  <button
                    onClick={(e) => handleRemove(e, product.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-background/70 backdrop-blur-md hover:bg-destructive/80 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 text-foreground" />
                  </button>

                  {product.stock === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-red-500/80 text-white text-xs font-semibold rounded">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-sm font-medium text-foreground line-clamp-1 mb-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {product.category}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-primary">
                      ₹{product.price}
                    </span>
                    {parseFloat(product.ratings) > 0 && (
                      <span className="text-xs text-yellow-400 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {parseFloat(product.ratings).toFixed(1)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.stock === 0}
                    className="w-full flex items-center justify-center gap-2 py-2 gradient-primary text-primary-foreground rounded-lg text-sm font-semibold hover:glow-on-hover animate-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
