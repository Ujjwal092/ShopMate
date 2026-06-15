import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { toggleWishlistItem } from "../../store/slices/wishlistSlice";
import { toggleAuthPopup } from "../../store/slices/popupSlice";

/**
 * Reusable heart icon button to add/remove a product from the wishlist.
 *
 * Props:
 *  - productId: UUID of the product
 *  - className: optional extra classes for positioning (e.g. "absolute top-2 right-2")
 *  - showLabel: if true, shows "Add to Wishlist" / "Wishlisted" text next to the icon
 */
const WishlistButton = ({ productId, className = "", showLabel = false }) => {
  const dispatch = useDispatch();

  const { authUser } = useSelector((state) => state.auth);
  const { wishlistIds, togglingId } = useSelector((state) => state.wishlist);

  const isWishlisted = wishlistIds.includes(productId);
  const isToggling = togglingId === productId;

  const handleToggle = (e) => {
    e.stopPropagation(); // prevent navigating to product detail when clicked from a card

    if (!authUser) {
      toast.info("Please login to use wishlist.");
      dispatch(toggleAuthPopup());
      return;
    }

    dispatch(toggleWishlistItem(productId));
  };

  if (showLabel) {
    return (
      <button
        onClick={handleToggle}
        disabled={isToggling}
        className={`flex items-center space-x-2 text-muted-foreground hover:text-primary animate-smooth disabled:opacity-50 ${className}`}
      >
        <Heart
          className={`w-5 h-5 ${
            isWishlisted ? "fill-primary text-primary" : ""
          }`}
        />
        <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`p-2 rounded-full bg-background/70 backdrop-blur-md hover:bg-background/90 transition-colors disabled:opacity-50 ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-colors ${
          isWishlisted ? "fill-primary text-primary" : "text-foreground"
        }`}
      />
    </button>
  );
};

export default WishlistButton;
