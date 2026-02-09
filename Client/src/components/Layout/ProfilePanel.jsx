import { useEffect, useState } from "react";
import { X, LogOut, Upload, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  logout,
  updatePassword,
  updateProfile,
} from "../../store/slices/authSlice";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import { toggleSidebar } from "../../store/slices/popupSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();

  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector(
    (state) => state.auth
  );

  const [name, setName] = useState(authUser?.name || ""); //authUser is back from the backend and we are setting the initial state of name and email to the values from authUser. If authUser is null or doesn't have name/email, we default to an empty string.
  const [email, setEmail] = useState(authUser?.email || "");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (authUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(authUser.name || "");
      setEmail(authUser.email || "");
    }
  }, [authUser]); // This useEffect runs whenever authUser changes (like after a profile update) and updates the name and email state to reflect the latest user information.

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);
  
    dispatch(updateProfile(formData));
  };

  const handleUpdatePassword = () => {
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmNewPassword", confirmNewPassword);
    dispatch(updatePassword(formData));
  };

  if (!isAuthPopupOpen || !authUser) return null;

  return (
    <>
      {/* OVERLAY make background blurry*/}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => dispatch(toggleSidebar())}
      />

      {/* PROFILE PANEL */}
      <div className="fixed right-0 top-0 h-full w-96 z-50 glass-panel animate-slide-in-right overflow-y-auto">
        
        {/* HEADER with title and close button */}
        <div className="flex items-center justify-between p-6 border-b border-[hsla(var(--glass-border))]">
          <h2 className="text-xl font-semibold text-primary">Profile</h2>
          <button
            onClick={() => dispatch(toggleAuthPopup())}
            className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        <div className="p-6">
          {/* AVATAR + BASIC INFO */}
          <div className="text-center mb-6">
            <img
              src={authUser?.avatar?.url || "/avatar-holder.avif"}
              alt={authUser?.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary object-cover"
            />

            <h3 className="text-lg font-semibold text-foreground">
              {authUser?.name}
            </h3>
            
            <p className="text-muted-foreground">{authUser?.email}</p>
       

          </div>

          {/* PROFILE UPDATE FORM */}
          {authUser && (
            <div className="space-y-4 mb-8">
              
              <h3 className="text-lg font-semibold text-primary">
                Update Profile
              </h3>

              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded border border-border bg-secondary text-foreground"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                readOnly // Make email field read-only since it can't be changed
                cursor
                title="Email can't be changed!!"
                className="w-full p-2 rounded border border-border bg-secondary text-foreground cursor-not-allowed"
              />

              <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
              
                <Upload className="w-4 h-4 text-primary" />
                <span>Upload Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="hidden"
                />
              </label>


              <button
                onClick={handleUpdateProfile}
                className="flex justify-center items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover animate-smooth group w-full"
              >
                {/* Show loading spinner and text when updating profile, otherwise show "Save Changes" */}
                {isUpdatingProfile ? (
                  <>
                    <div
                      className={`w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin`}
                    />
                    <span>Updating Profile...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>

            </div>
          )}

          {/* UPDATE PASSWORD FORM */}
          <div className="space-y-4 mb-8">
           
            <h3 className="text-lg font-semibold text-primary">
              Update Password
            </h3>

            <input
            // The type of the password fields toggles between "text" and "password" based on the showPassword state, allowing users to see or hide their password inputs.
              type={showPassword ? "password" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 rounded border border-border bg-secondary text-foreground"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 rounded border border-border bg-secondary text-foreground"
              required
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full p-2 rounded border border-border bg-secondary text-foreground"
            />
          
          {/* The button below toggles the showPassword state, which in turn changes the type of the password input fields to either "text" (visible) or "password" (hidden). It also changes the icon and text of the button to indicate whether the passwords are currently shown or hidden. */}
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-muted-foreground flex items-center gap-1"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-primary" />
              ) : (
                <Eye className="w-4 h-4 text-primary" />
              )}
              {showPassword ? "Hide" : "Show"} Passwords
            </button>

            <button
              onClick={handleUpdatePassword}
              className="flex justify-center items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover animate-smooth group w-full"
            >
              {isUpdatingPassword ? (
                <>
                  <div
                    className={`w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin`}
                  />
                  <span>Updating Password...</span>
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="my-6 flex items-center space-x-3 p-3 rounded-lg 
            glass-card hover:glow-on-hover text-destructive 
            hover:text-destructive-foreground group w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;
