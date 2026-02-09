import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();

  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
      { name: "Careers", path: "#" },
      { name: "Press", path: "#" },
      { name: "Blog", path: "#" },
    ],
    customer: [
      { name: "Contact Us", path: "/contact" },
      { name: "FAQ", path: "/faq" },
      { name: "Shipping Info", path: "#" },
      { name: "Returns", path: "#" },
    ],
    legal: [
      { name: "Privacy Policy", path: "#" },
      { name: "Terms of Service", path: "#" },
      { name: "Cookie Policy", path: "#" },
      { name: "Security", path: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", className: "bg-blue-600 hover:bg-blue-700" },
    { icon: Twitter, href: "#", label: "Twitter", className: "bg-blue-400 hover:bg-blue-500" },
    { icon: Instagram, href: "#", label: "Instagram", className: "bg-pink-500 hover:bg-pink-600" },
    { icon: Youtube, href: "#", label: "YouTube", className: "bg-red-600 hover:bg-red-700" },
  ];

  const bgClass = theme === "dark" ? "bg-background/80 backdrop-blur-md" : "bg-white/95 backdrop-blur-sm shadow-inner";
  const textClass = theme === "dark" ? "text-foreground" : "text-gray-900";
  const mutedClass = theme === "dark" ? "text-muted-foreground" : "text-gray-600";
  const borderClass = theme === "dark" ? "border-[hsla(var(--glass-border))]" : "border-gray-200";

  return (
    <footer className={`${bgClass} border-t ${borderClass} mt-16 transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-16">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 ml-[4rem]">
          {/* Brand & Contact */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text hover:scale-105 transition-transform duration-300">
              ShopMate
            </h2>
            <p className={`${mutedClass} text-sm`}>
              Your trusted partner for online shopping. Discover amazing products with exceptional quality and service.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-primary" />
                <span className={mutedClass}>shopmate@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary" />
                <span className={mutedClass}>+91 7079839554</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className={mutedClass}>Bengaluru,India</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          {["company", "customer", "legal"].map((section) => (
            <div key={section}>
              <h3 className={`text-lg font-semibold ${textClass} mb-4 capitalize`}>
                {section.replace("-", " ")}
              </h3>
              <ul className="space-y-2">
                {footerLinks[section].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className={`${mutedClass} hover:text-primary transition-colors duration-300`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="bg-secondary rounded-2xl p-8 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h3 className={`text-xl font-semibold ${textClass} mb-2`}>Stay Connected</h3>
            <p className={`${mutedClass} text-sm`}>
              Subscribe to our newsletter for exclusive offers and updates  💜
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground flex-1"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:scale-105 transition-transform duration-300 font-semibold shadow-lg"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Social & Copyright */}
        <div className={`flex flex-col md:flex-row items-center justify-between pt-8 border-t ${borderClass}`}>
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className={`p-2 rounded-full ${social.className} hover:text-white  duration-300 transform hover:scale-110`}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className={`${mutedClass} text-sm font-medium`}>
              © 2026 CartSyy. All rights reserved𑣲
            </p>
            <p className={`${mutedClass} text-xs italic`}>
              Developed By Ujjwal Kumar
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
