import { useState, useEffect } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from "../../store/slices/authSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { authUser, isSigningUp, isLoggingIn, isRequestingForToken } =
    useSelector((state) => state.auth);
    
  const { isAuthPopupOpen } = useSelector((state) => state.popup);

  const [mode, setMode] = useState("signin"); // signin | signup | forgot | reset is mode
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Open reset mode if URL indicates
  useEffect(() => {
  if (location.pathname.startsWith("/password/reset/")) 
    // Returns true if the sequence of elements of searchString converted to a 
    //String is the same as the corresponding elements of this object (converted to a String) starting at position. Otherwise returns false.
     {
    const timer = setTimeout(() => {
      setMode("reset"); // Switch to reset mode if URL indicates
      dispatch(toggleAuthPopup()); // Open the modal of reset password
    }, 0);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }
}, [location.pathname, dispatch]); // This effect runs on component mount and whenever the URL path changes. If the path indicates a password reset, it opens the modal in reset mode.


  const handleInputChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "forgot") {
      dispatch(forgotPassword({ email: formData.email })).then(() => {
        toast.success("Password reset email sent!");
        dispatch(toggleAuthPopup()); // Close the modal after requesting password reset
        setMode("signin");
        setFormData({ email: "", password: "", name: "", confirmPassword: "" });
      });
      return;
    }

    if (mode === "reset") {
      const token = location.pathname.split("/").pop();
      dispatch(
        resetPassword({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })
      );
      return;
    }

    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (mode === "signup") data.append("name", formData.name);

    if (mode === "signup") {
      dispatch(register(data)); // Register action is dispatched with form data when in signup mode
    } else {
      dispatch(login(data));
    }

    // Reset form on successful login/signup
    if (authUser) {
      setFormData({ email: "", password: "", name: "", confirmPassword: "" });
    }
  };

  if (!isAuthPopupOpen || authUser) return null;

  const isLoading = isSigningUp || isLoggingIn || isRequestingForToken;

  // Helper to get input icons
  const getIcon = (field) => {
    switch (field) {
      case "email":
        return <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />;
      case "password":
      case "confirmPassword":
        return <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />;
      case "name":
        return <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* OVERLAY self closing div*/}
      <div className="absolute inset-0 backdrop-blur-md bg-[hsla(var(--glass-bg))]" />

      <div className="relative z-10 glass-panel w-full max-w-md mx-4 animate-fade-in-up p-6">
       
        {/* HEADER of modal */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">
            {mode === "reset"
              ? "Reset Password"
              : mode === "signup"
              ? "Create Account"
              : mode === "forgot"
              ? "Forgot Password"
              : "Welcome Back"}
          </h2>
          <button
            onClick={() => dispatch(toggleAuthPopup())}
            className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="relative">
              {getIcon("name")}
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange("name")}
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
                required
              />
            </div>
          )}

          {mode !== "reset" && (
            <div className="relative">
              {getIcon("email")}
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange("email")}
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
                required
              />
            </div>
          )}

          {mode !== "forgot" && (
            <div className="relative">
              {getIcon("password")}
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange("password")}
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
                required
              />
            </div>
          )}

          {mode === "reset" && (
            <div className="relative">
              {getIcon("confirmPassword")}
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
                required
              />
            </div>
          )}

          {mode === "signin" && (
            <div className="text-right text-sm">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-primary hover:text-accent animate-smooth"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 gradient-primary flex justify-center items-center gap-2 text-primary-foreground rounded-lg font-semibold animate-smooth ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:glow-on-hover"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>
                  {mode === "reset"
                    ? "Resetting password..."
                    : mode === "signup"
                    ? "Signing up..."
                    : mode === "forgot"
                    ? "Requesting email..."
                    : "Signing in..."}
                </span>
              </>
            ) : mode === "reset"
            ? "Reset Password"
            : mode === "signup"
            ? "Create Account"
            : mode === "forgot"
            ? "Send Reset Email"
            : "Sign In"}
          </button>
        </form>

        {/* MODE TOGGLE */}
        {["signin", "signup"].includes(mode) && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() =>
                setMode((prev) => (prev === "signup" ? "signin" : "signup"))
              }
              className="text-primary hover:text-accent animate-smooth"
            >
              {mode === "signup"
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
