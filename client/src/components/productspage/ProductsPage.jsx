import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import FilterBar from "../filterbar/FilterBar";
import ProductGrid from "../productgrid/ProductGrid";
import styles from "./ProductsPage.module.scss";
import { apiFetch } from "../../auth/api";

// Import model images
import model1 from "../../assets/images/models/1.jpg";
import model2 from "../../assets/images/models/2.jpg";
import model3 from "../../assets/images/models/3.jpg";
import model4 from "../../assets/images/models/4.jpg";
import model5 from "../../assets/images/models/5.jpg";
import model6 from "../../assets/images/models/6.jpg";

// Model profiles data
const dummyProducts = [
  {
    id: 1,
    title: "Sophia Elite",
    price: 299,
    originalPrice: 399,
    image: model1,
    availability: "Available",
    gender: "Female",
    description:
      "Professional model with extensive experience in fashion and commercial photography. Specializes in high-end fashion shoots and brand campaigns.",
    sizes: ["Premium Package"],
    features: [
      "Fashion Photography",
      "Commercial Shoots",
      "Brand Campaigns",
      "Professional Portfolio",
    ],
  },
  {
    id: 2,
    title: "Isabella Grace",
    price: 249,
    image: model2,
    availability: "Available",
    gender: "Female",
    description:
      "Versatile model with expertise in lifestyle and beauty photography. Known for natural expressions and professional demeanor.",
    sizes: ["Standard Package", "Premium Package"],
    features: [
      "Lifestyle Photography",
      "Beauty Shoots",
      "Natural Expressions",
      "Professional Experience",
    ],
  },
  {
    id: 3,
    title: "Victoria Luxe",
    price: 199,
    originalPrice: 279,
    image: model3,
    availability: "Booked",
    gender: "Female",
    description:
      "Elegant model specializing in luxury brand photography and high-fashion editorial work. Perfect for sophisticated campaigns.",
    sizes: ["Premium Package"],
    features: [
      "Luxury Brands",
      "Editorial Work",
      "High Fashion",
      "Sophisticated Style",
    ],
  },
  {
    id: 4,
    title: "Anastasia Star",
    price: 349,
    image: model4,
    availability: "Available",
    gender: "Female",
    description:
      "Top-tier model with international experience. Specializes in runway, editorial, and commercial photography with exceptional versatility.",
    sizes: ["Standard Package", "Premium Package", "Exclusive Package"],
    features: [
      "International Experience",
      "Runway Modeling",
      "Editorial Photography",
      "Commercial Work",
    ],
  },
  {
    id: 5,
    title: "Natasha Divine",
    price: 229,
    image: model5,
    availability: "Available",
    gender: "Female",
    description:
      "Creative model with a passion for artistic photography and unique concepts. Brings creativity and professionalism to every shoot.",
    sizes: ["Standard Package", "Premium Package"],
    features: [
      "Artistic Photography",
      "Creative Concepts",
      "Unique Style",
      "Professional Attitude",
    ],
  },
  {
    id: 6,
    title: "Elena Prestige",
    price: 189,
    originalPrice: 249,
    image: model6,
    availability: "Available",
    gender: "Female",
    description:
      "Experienced model with a focus on beauty and glamour photography. Known for stunning visuals and professional reliability.",
    sizes: ["Standard Package", "Premium Package"],
    features: [
      "Beauty Photography",
      "Glamour Shoots",
      "Stunning Visuals",
      "Professional Reliability",
    ],
  },
];

const fallbackImages = [model1, model2, model3, model4, model5, model6];

const mergeUniqueProducts = (primary, secondary) => {
	const out = [];
	const seen = new Set();
	for (const item of [...(primary || []), ...(secondary || [])]) {
		const key = item?.id || item?._id || item?.title;
		if (!key || seen.has(key)) continue;
		seen.add(key);
		out.push(item);
	}
	return out;
};

const ProductsPage = () => {
	const navigate = useNavigate();
  const [filters, setFilters] = useState({
    gender: [],
    priceRange: [0, 1000],
	    availability: "All",
	    searchQuery: "",
  });

	const [allProducts, setAllProducts] = useState(dummyProducts);
	const [loading, setLoading] = useState(false);
	const [loadError, setLoadError] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      gender: [],
      priceRange: [0, 1000],
	      availability: "All",
	      searchQuery: "",
    });
  };

	useEffect(() => {
		let mounted = true;
		const loadModels = async () => {
			setLoading(true);
			setLoadError("");
			try {
				const data = await apiFetch("/api/v1/models", { method: "GET" });
				const models = Array.isArray(data?.models) ? data.models : [];
				const mapped = models.map((m, idx) => ({
						id: m?._id || m?.id || `model-${idx}`,
						title: m?.title || m?.name || m?.stageName || "Performer",
						price: m?.price,
					originalPrice: m.originalPrice,
					image:
						m.imageUrl && String(m.imageUrl).trim().length > 0
							? m.imageUrl
							: fallbackImages[idx % fallbackImages.length],
					availability: m.availability,
					gender: m.gender,
					description: m.description,
					sizes: m.sizes || [],
					features: m.features || [],
					location: m.location || "",
					tagline: m.tagline || "",
				}));

				if (!mounted) return;
					setAllProducts(
						mapped.length > 0
							? mergeUniqueProducts(mapped, dummyProducts)
							: dummyProducts
					);
			} catch (e) {
				if (!mounted) return;
				setLoadError(e?.message || "Failed to load performers");
				setAllProducts(dummyProducts);
			} finally {
				if (mounted) setLoading(false);
			}
		};
		loadModels();
		return () => {
			mounted = false;
		};
	}, []);

	const filteredProducts = useMemo(() => {
		return allProducts.filter((product) => {
	      // Search filter (by name/title)
	      const q = String(filters.searchQuery || "")
	        .trim()
	        .toLowerCase();
	      if (q) {
	        const name = String(product?.title || "").toLowerCase();
	        if (!name.includes(q)) return false;
	      }

      // Gender filter
      if (
        filters.gender.length > 0 &&
        !filters.gender.includes(product.gender)
      ) {
        return false;
      }

      // Price range filter
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Availability filter - map "In Stock" to "Available" and "Out of Stock" to "Booked"
      let availabilityToCheck = filters.availability;
      if (filters.availability === "In Stock")
        availabilityToCheck = "Available";
      if (filters.availability === "Out of Stock")
        availabilityToCheck = "Booked";

      if (
        filters.availability !== "All" &&
        product.availability !== availabilityToCheck
      ) {
        return false;
      }

      return true;
    });
	}, [filters, allProducts]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCartDropdown = () => {
    setShowCartDropdown(!showCartDropdown);
  };

  const addToCart = (performer) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === performer.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === performer.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...performer, quantity: 1 }];
    });
  };

  const removeFromCart = (performerId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== performerId));
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className={styles.productsPage}>
      {/* Mobile Filter Toggle Button */}
      <button
        className={styles.filterToggle}
        onClick={toggleSidebar}
        aria-label="Toggle filters"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 7H21M3 12H21M3 17H21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Filters
      </button>

      <div className={styles.container}>
        <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ""}`}>
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <h1>PERFORMERS</h1>
              <div className={styles.headerActions}>
							<button
								className={styles.performerButton}
								onClick={() => navigate("/be-performer")}
							>
                  Be a Performer
                </button>
								<button
									className={styles.adminButton}
									onClick={() => navigate("/admin-dashboard")}
								>
								  Admin Dashboard
								</button>
							{loadError ? (
								<div style={{ color: "#fecaca", fontSize: 12 }}>
									{loadError}
								</div>
							) : null}
							{loading ? (
								<div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
									Loading...
								</div>
							) : null}
                <div className={styles.cartContainer}>
                  <button
                    className={styles.cartIcon}
                    onClick={toggleCartDropdown}
                    aria-label="View cart"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13H7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {getTotalCartItems() > 0 && (
                      <span className={styles.cartBadge}>
                        {getTotalCartItems()}
                      </span>
                    )}
                  </button>

                  {showCartDropdown && (
                    <div className={styles.cartDropdown}>
                      <div className={styles.cartHeader}>
                        <h3>Booked Performers</h3>
                        <button
                          className={styles.closeCart}
                          onClick={() => setShowCartDropdown(false)}
                        >
                          ×
                        </button>
                      </div>

                      {cartItems.length === 0 ? (
                        <div className={styles.emptyCart}>
                          <p>No performers booked yet</p>
                        </div>
                      ) : (
                        <>
                          <div className={styles.cartItems}>
                            {cartItems.map((item) => (
                              <div key={item.id} className={styles.cartItem}>
                                <img src={item.image} alt={item.title} />
                                <div className={styles.itemDetails}>
                                  <h4>{item.title}</h4>
                                  <p>
                                    ${item.price} × {item.quantity}
                                  </p>
                                </div>
                                <button
                                  className={styles.removeItem}
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className={styles.cartFooter}>
                            <div className={styles.cartTotal}>
                              <strong>Total: ${getTotalPrice()}</strong>
                            </div>
                            <button className={styles.checkoutButton}>
                              Proceed to Checkout
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <ProductGrid
            products={filteredProducts}
            onProductClick={handleProductClick}
            selectedProduct={selectedProduct}
            onCloseDetail={handleCloseDetail}
            onAddToCart={addToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
