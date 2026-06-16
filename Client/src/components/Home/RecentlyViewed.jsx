import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import ProductCard from "../../components/Products/ProductCard";
import { getRecentlyViewedIds } from "../../lib/recentlyViewed";

const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ids = getRecentlyViewedIds();
    if (ids.length === 0) return;

    const fetchRecentProducts = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/product/ids?ids=${ids.join(",")}`);
        setRecentProducts(res.data.products || []);
      } catch (error) {
        console.error("Failed to load recently viewed products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">Loading recently viewed...</p>
        </div>
      </section>
    );
  }

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Recently Viewed</h2>
          <p className="text-muted-foreground">Quick access to products you checked last.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {recentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
