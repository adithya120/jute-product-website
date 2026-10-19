import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductDetailPage from "../components/ProductDetailPage"; // Make sure path matches your setup
import { getProducts } from "../services/productService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // New state to manage active view and selected product details
  const [currentView, setCurrentView] = useState("list"); // "list" or "detail"
  const [selectedProductData, setSelectedProductData] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        console.log("getProductsssssssss", data.products);
        setProducts(data?.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handler triggered when clicking a Product Card
  const handleViewDetails = async (product) => {
    try {
      // In a real application, you would fetch full product details here:
      // const fullDetails = await getProductById(product.id);
      
      // For now, structuring it to match the single-product JSON payload you provided earlier:
      const mockSingleProductResponse = {
        success: true,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          brand: product.brand || null,
          status: product.status,
          category: {
            id: product.category_id,
            name: product.category_name || "Jute Collection"
          },
          images: [
            {
              id: 1,
              url: product.image || "https://picsum.photos/600/600?random=" + product.id,
              alt: `${product.name} primary view`,
              isPrimary: true,
              displayOrder: 1
            },
            {
              id: 2,
              url: "https://picsum.photos/600/600?random=" + (product.id + 10),
              alt: `${product.name} alternative view`,
              isPrimary: false,
              displayOrder: 2
            }
          ],
          variants: [
            { id: 1, sku: `${product.slug.toUpperCase()}-NAT-S`, color: "Natural", size: "Small", price: product.price || "799.00", discountPrice: product.discount_price || "699.00", stock: 25, status: "active" },
            { id: 2, sku: `${product.slug.toUpperCase()}-NAT-M`, color: "Natural", size: "Medium", price: "999.00", discountPrice: "849.00", stock: 30, status: "active" },
            { id: 3, sku: `${product.slug.toUpperCase()}-BLK-L`, color: "Black", size: "Large", price: "1249.00", discountPrice: "1099.00", stock: 15, status: "active" }
          ]
        }
      };

      setSelectedProductData(mockSingleProductResponse);
      setCurrentView("detail");
    } catch (err) {
      console.error("Failed to load product details", err);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading products...</h2>;
  }

  if (error) {
    console.log(error);
    return <h2 style={{ textAlign: "center", color: "#d9534f", marginTop: "40px" }}>{error}</h2>;
  }

  // If user clicked a card, render the Detail Page instead of the list
  if (currentView === "detail" && selectedProductData) {
    return (
      <ProductDetailPage 
        productData={selectedProductData} 
        onBack={() => setCurrentView("list")} 
      />
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ color: "#5c4033", marginBottom: "20px" }}>Jute Store Catalog</h1>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;