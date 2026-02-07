import { useState } from "react";
import { X, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleSearchBar } from "../../store/slices/popupSlice";

const SearchOverlay = () => {
  const [searchQuery, setSearchQuery] = useState(""); 
  const dispatch = useDispatch(); // For toggling search bar visibility
  const navigate = useNavigate(); // For navigating to products page with search query
  const { isSearchBarOpen } = useSelector((state) => state.popup); // Get search bar visibility state from Redux
  // Don't render the search overlay if it's not open
  if (!isSearchBarOpen) return null;

  // Handle search action like navige to products page with search query as parameter
  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      dispatch(toggleSearchBar());
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  

  return (
    <>
      <div className="fixed inset-0 z-50">
        {/* GLASS BACKGROUND */}
        <div className="absolute inset-0 backdrop-blur-md bg-[hsla(var(--glass-bg))]">
          {/* SEARCH CONTAINER */}
          <div className="relative z-10 animate-slide-in-top"> 
            {/* animate-slide-in-top make sure that the seach container slides in from the top */}
            <div className="glass-panel m-6 max-w-2xl mx-auto">

              {/* HEADER AND CLOSE BUTTON */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-primary">
                  Search Products
                </h2>
                <button
                  onClick={() => dispatch(toggleSearchBar())}
                  className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"
                >
                  <X className="w-5 h-5 text-primary" />
                </button>
              </div>

                {/* SEARCH ICON BUTTON and Place hiolder*/}
              <div className="relative">
                <button
                  onClick={handleSearch} //ONCLICK of search icon trigger search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
                >
                  <Search className="w-5 h-5 text-primary" />
                </button>

                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery} // Controlled input for search query
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Trigger search on Enter key press
                  className="w-full pl-12 pr-4 py-4 bg-secondary border border-border rounded-lg focus:outline-none text-foreground placeholder-muted-foreground"
                  autoFocus // Automatically focus the input when the search overlay opens
                />
              </div>

              <div className="mt-6 text-center ">
                <p>Start typing to search for products...</p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;
