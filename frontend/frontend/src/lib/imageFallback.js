// generic light-gray placeholder shown if a product photo URL ever fails to load
export const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23F0EFEA'/%3E%3Cpath d='M160 150h80a10 10 0 0110 10v80a10 10 0 01-10 10h-80a10 10 0 01-10-10v-80a10 10 0 0110-10z' fill='none' stroke='%23C9C6BD' stroke-width='3'/%3E%3Ccircle cx='180' cy='180' r='8' fill='%23C9C6BD'/%3E%3Cpath d='M150 230l30-30 20 20 40-40 30 30' fill='none' stroke='%23C9C6BD' stroke-width='3'/%3E%3C/svg%3E";

export const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = FALLBACK_IMAGE;
};
