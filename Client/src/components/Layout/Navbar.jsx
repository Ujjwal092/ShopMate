import { Menu, User, ShoppingCart, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAuthPopup,
  toggleCart,
  toggleSearchBar,
  toggleSidebar,
} from "../../store/slices/popupSlice";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch(); // For dispatching actions to toggle various popups and sidebar
  const { cart } = useSelector((state) => state.cart); // Get cart items from Redux store

  const cartItemsCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <nav className="fixed left-0 w-full top-0 z-50 bg-background/60 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* LEFT - HAMBURGER MENU button */}
          <button
            onClick={() => dispatch(toggleSidebar())} //on click of hamburger menu toggle sidebar visibility
            className="p-2 rounded-lg hover:bg-secondary/50 transition-all duration-300 hover:scale-110"
            title="Open Menu"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>

          {/* CENTER - LOGO */}
          <Link
            to="/"
            className="text-2xl font-bold bg-clip-text text-transparent content-center bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition-transform duration-300"
          >
            ShopMate
          </Link>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center space-x-3">
            
            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-all duration-300 hover:scale-110"
              title="Toggle Theme"
            > 
              {theme === "dark" ? ( //if current theme is dark show sun icon to indicate that clicking it will switch to light mode
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            {/* SEARCH */}
            <button
              onClick={() => dispatch(toggleSearchBar())}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-all duration-300 hover:scale-110"
              title="Search Products"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>

            {/* USER Button */}
            <button
              onClick={() => dispatch(toggleAuthPopup())}
              className="p-2 rounded-lg hover:bg-secondary/50 transition-all duration-300 hover:scale-110"
              title="User Account"
            >
              <User className="w-5 h-5 text-foreground" />
            </button>

            {/* CART Button */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 rounded-lg hover:bg-secondary/50 transition-all duration-300 hover:scale-110"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
