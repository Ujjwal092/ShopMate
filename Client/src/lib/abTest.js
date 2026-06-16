export function getVariant(testName) {
  const key = `ab-${testName}`;
  let v = localStorage.getItem(key);
  if (!v) {
    v = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem(key, v);
  }
  return v;
}

export function setVariant(testName, variant) {
  localStorage.setItem(`ab-${testName}`, variant);
}