const API_URL = "https://jute-product-website.onrender.com/api/products";

export const getProducts = async () => {
  
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};