import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PromoStrip = ({ endTimestamp }) => {
  // default: 24 hours from now
  const [defaultEnd] = useState(() => endTimestamp || Date.now() + 24 * 60 * 60 * 1000);
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, (endTimestamp || Date.now() + 24 * 60 * 60 * 1000) - Date.now()),
  );
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return localStorage.getItem("promoStripHidden") !== "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const t = setInterval(() => {
      setRemaining(Math.max(0, defaultEnd - Date.now()));
    }, 1000);
    return () => clearInterval(t);
  }, [defaultEnd]);

  const format = (ms) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  const closeBanner = () => {
    setVisible(false);
    try {
      localStorage.setItem("promoStripHidden", "true");
    } catch (error) {
      console.warn("Unable to save promo banner state", error);
    }
  };

  if (!visible || remaining <= 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-rose-500 to-orange-400 text-white py-2 px-4 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <strong>Limited Time:</strong>
          <span>Flat 10% off on selected categories</span>
          <span className="ml-2 font-mono bg-white/20 px-2 py-1 rounded">Ends in {format(remaining)}</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/products?promo=today" className="px-4 py-2 bg-black/30 rounded font-semibold">Shop Deals</Link>
          <button
            type="button"
            onClick={closeBanner}
            aria-label="Close promo banner"
            className="text-white hover:text-gray-200 rounded-full p-2 transition"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoStrip;