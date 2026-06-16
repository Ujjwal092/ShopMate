import { useCallback, useEffect, useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

const TestimonialCard = ({ t }) => {
  return (
    <div className="glass-card max-w-md p-6 mx-auto">
      <div className="flex items-start space-x-4">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg text-foreground">{t.name}</h4>
            {t.verified && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Verified buyer</span>
            )}
          </div>
          <div className="flex items-center mt-2">
            {Array.from({ length: Math.min(5, Math.max(0, t.rating || 0)) }).map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400" />
            ))}
          </div>
          <p className="text-muted-foreground mt-4">{t.message}</p>
          {t.product_id && (
            <Link to={`/products?product=${t.product_id}`} className="text-primary mt-3 inline-block">View product</Link>
          )}
        </div>
      </div>
    </div>
  );
};

const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axiosInstance.get('/testimonials/featured');
        setTestimonials(res.data.testimonials || []);
      } catch {
        // Ignore fetch failures for testimonials
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (!testimonials.length) return;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(timerRef.current);
  }, [testimonials]);

  // keyboard navigation
  const prev = useCallback(() => {
    if (!testimonials.length) return;
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const next = useCallback(() => {
    if (!testimonials.length) return;
    setIndex((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  if (!testimonials.length) return null;

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">What our customers say</h2>
          <div className="flex items-center space-x-2">
            <button onClick={prev} className="p-2 glass-card"><ChevronLeft /></button>
            <button onClick={next} className="p-2 glass-card"><ChevronRight /></button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${index * 100}%)` }}>
            {testimonials.map((t) => (
              <div key={t.id} className="w-full flex-shrink-0 px-3">
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center space-x-2 mt-4">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`w-3 h-3 rounded-full ${i===index? 'bg-primary':'bg-white/30'}`}></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;