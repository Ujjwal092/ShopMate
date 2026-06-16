import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const Testimonials = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axiosInstance.get('/testimonials');
        setItems(res.data.testimonials || []);
      } catch {
        // Ignore testimonial fetch errors
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-foreground mb-6">Testimonials</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((t) => (
            <div key={t.id} className="glass-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{t.name}</h3>
                {t.verified && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Verified</span>}
              </div>
              <p className="text-muted-foreground mt-3">{t.message}</p>
              <p className="text-sm text-muted-foreground mt-4">{new Date(t.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;