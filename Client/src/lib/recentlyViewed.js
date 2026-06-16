export const getRecentlyViewedIds = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
  } catch {
    return [];
  }
};

export const addRecentlyViewedId = (productId) => {
  if (typeof window === "undefined" || !productId) return;
  const ids = getRecentlyViewedIds();
  const updated = [productId, ...ids.filter((id) => id !== productId)].slice(0, 6);
  localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  return updated;
};
