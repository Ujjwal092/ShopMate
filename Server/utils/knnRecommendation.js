/**
 * KNN-based "Similar Products" recommendation.
 *
 * Approach: Content-based K-Nearest-Neighbors using Euclidean distance
 * on normalized product features (price, category, ratings).
 *
 * This is a "lazy learning" algorithm — there is no training step.
 * At request time, we build feature vectors for all products and
 * compute the distance from the target product to every other product,
 * then return the K closest ones.
 */

// Min-max normalization: scales a value to the [0, 1] range
const normalize = (value, min, max) => {
  if (max === min) return 0;
  return (value - min) / (max - min);
};

/**
 * Build a numeric feature vector for a product.
 * Features used:
 *   1. price (normalized 0-1 across all products)
 *   2. category (one-hot-style encoded as a normalized index)
 *   3. ratings (normalized 0-1, since ratings are 0-5)
 */
const buildFeatureVectors = (products) => {
  const prices = products.map((p) => parseFloat(p.price));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const categories = [...new Set(products.map((p) => p.category))];
  const categoryEncoding = {};
  categories.forEach((cat, idx) => {
    categoryEncoding[cat] =
      categories.length > 1 ? idx / (categories.length - 1) : 0;
  });

  return products.map((p) => ({
    ...p,
    vector: [
      normalize(parseFloat(p.price), minPrice, maxPrice),
      categoryEncoding[p.category],
      (parseFloat(p.ratings) || 0) / 5,
    ],
  }));
};

// Standard Euclidean distance between two vectors
const euclideanDistance = (a, b) => {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));
};

/**
 * Find the K nearest neighbors (most similar products) for a given product.
 *
 * @param {Array} allProducts - All products fetched from DB
 * @param {String} targetProductId - UUID of the product to find neighbors for
 * @param {Number} k - Number of similar products to return (default 5)
 * @returns {Array} - Top K similar products, sorted by similarity (closest first)
 */
export const findSimilarProducts = (allProducts, targetProductId, k = 5) => {
  const vectorized = buildFeatureVectors(allProducts);

  const target = vectorized.find((p) => p.id === targetProductId);
  if (!target) return [];

  const distances = vectorized
    .filter((p) => p.id !== targetProductId)
    // Bonus: prioritize same-category products by giving them a slight boost
    .map((p) => {
      let distance = euclideanDistance(target.vector, p.vector);
      if (p.category === target.category) {
        distance *= 0.85; // small preference for same-category items
      }
      return { ...p, distance };
    });

  return distances
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k)
    .map(({ vector, distance, ...rest }) => rest); // strip internal fields before returning
};
