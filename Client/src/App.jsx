import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toast.css";
import Chatbot from "../src/components/Layout/Chatbot"




// Layout Components
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import SearchOverlay from "./components/Layout/SearchOverlay";
import CartSidebar from "./components/Layout/CartSidebar";
import ProfilePanel from "./components/Layout/ProfilePanel";
import LoginModal from "./components/Layout/LoginModal";
import Footer from "./components/Layout/Footer";

// Pages
import Index from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./store/slices/authSlice";
import { Loader } from "lucide-react";
import { fetchAllProducts } from "./store/slices/productSlice";

const App = () => {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [getUser]);

  useEffect(() => {
    dispatch(
      fetchAllProducts({
        category: "",
        price: `0-10000`,
        search: "",
        ratings: "",
        availability: "",
        page: 1,
      })
    );
  }, []);

  const { products } = useSelector((state) => state.product);

  if ((isCheckingAuth && !authUser) || !products) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            {/* All components that need to be rendered in the app and 
            it will be rendered in the order they are defined here */}
            <Navbar /> 
            <Sidebar />
            <SearchOverlay />
            <CartSidebar />
            <ProfilePanel />
            <LoginModal />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/password/reset/:token" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 Not Found */}
            </Routes>
            <Footer />
            <Chatbot />
          </div>
          <ToastContainer 
           position="top-right"
           autoClose={3000}
           hideProgressBar={false} // Show progress bar for each toast
           newestOnTop={false} // New toasts will appear below existing ones
           closeOnClick // Allow users to close toasts by clicking on them
           rtl={false} // Left-to-right layout
           pauseOnFocusLoss // Pause toast timer when the window loses focus
           draggable
           pauseOnHover
           theme="bg-background text-foreground" // Custom theme for toasts
           className="toast-container" // Custom class for additional styling

           
           />  {/* Container for displaying toast notifications */}
        </BrowserRouter> {/* enables routing in the app */}
      </ThemeProvider> {/* allows different themes to be applied across the app */}
    </>
  );
};

export default App;
