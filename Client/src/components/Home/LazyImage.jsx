import { useEffect, useRef, useState } from "react";

const LazyImage = ({ src, alt = "", className = "", style = {} }) => {
  const imgRef = useRef();
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !('IntersectionObserver' in window);
  });

  useEffect(() => {
    let obs;
    if (!visible && imgRef.current && typeof window !== "undefined" && 'IntersectionObserver' in window) {
      obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      });
      obs.observe(imgRef.current);
    }
    return () => obs && obs.disconnect();
  }, [visible]);

  return (
    <div ref={imgRef} className={`relative ${className}`} style={{minHeight: '4rem', ...style}}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      {visible && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`${loaded ? 'opacity-100' : 'opacity-0'} w-full h-full object-contain transition-opacity duration-300`}
        />
      )}
    </div>
  );
};

export default LazyImage;