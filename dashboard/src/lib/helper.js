// Helper: last N months as { month, date }
export const getLastNMonths = (n) => {
  const months = [];
  const now = new Date(); //current date 
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1); //last n months 
    months.push({
      month: d.toLocaleString("en-US", { month: "short", year: "numeric" }), //jul 2022
      key: d.getTime(), // for sorting
    });
  }
  return months;
}; //[ { month: 'Nov 2025', key: 1761955200000 } ] array will be returned

// Helper: formats number from 100,000 to 100K
export const formatNumber = (num) => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K"; //1000000 -> 1000.0 -> 1000k
  if (num < 1000000000)
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
};