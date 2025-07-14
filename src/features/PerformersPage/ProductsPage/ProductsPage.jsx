import { useState, useMemo } from 'react';
import FilterBar from '../FilterBar/FilterBar';
import ProductGrid from '../ProductGrid/ProductGrid';
import styles from './ProductsPage.module.scss';

// Dummy product data
const dummyProducts = [
    {
        id: 1,
        title: "Premium Wireless Headphones",
        price: 199,
        originalPrice: 249,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        availability: "In Stock",
        gender: "Unisex",
        description: "High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.",
        sizes: ["One Size"],
        features: ["Noise Cancellation", "30-hour Battery", "Wireless Charging", "Premium Sound Quality"]
    },
    {
        id: 2,
        title: "Men's Athletic Running Shoes",
        price: 129,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        availability: "In Stock",
        gender: "Men",
        description: "Lightweight and comfortable running shoes designed for performance and style. Perfect for daily workouts and casual wear.",
        sizes: ["8", "9", "10", "11", "12"],
        features: ["Breathable Mesh", "Cushioned Sole", "Lightweight Design", "Durable Construction"]
    },
    {
        id: 3,
        title: "Women's Designer Handbag",
        price: 89,
        originalPrice: 120,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
        availability: "Out of Stock",
        gender: "Women",
        description: "Elegant designer handbag crafted from premium materials. Features multiple compartments and a timeless design.",
        sizes: ["One Size"],
        features: ["Premium Leather", "Multiple Compartments", "Adjustable Strap", "Designer Hardware"]
    },
    {
        id: 4,
        title: "Smart Fitness Watch",
        price: 299,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        availability: "In Stock",
        gender: "Unisex",
        description: "Advanced fitness tracking watch with heart rate monitoring, GPS, and smartphone connectivity.",
        sizes: ["Small", "Medium", "Large"],
        features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "7-day Battery"]
    },
    {
        id: 5,
        title: "Men's Casual Denim Jacket",
        price: 79,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
        availability: "In Stock",
        gender: "Men",
        description: "Classic denim jacket with a modern fit. Perfect for layering and casual occasions.",
        sizes: ["S", "M", "L", "XL"],
        features: ["100% Cotton Denim", "Classic Fit", "Button Closure", "Multiple Pockets"]
    },
    {
        id: 6,
        title: "Women's Yoga Leggings",
        price: 45,
        originalPrice: 60,
        image: "https://images.unsplash.com/photo-1506629905607-d9c36e0a3e3d?w=400&h=400&fit=crop",
        availability: "In Stock",
        gender: "Women",
        description: "High-performance yoga leggings with moisture-wicking fabric and four-way stretch.",
        sizes: ["XS", "S", "M", "L", "XL"],
        features: ["Moisture-Wicking", "Four-Way Stretch", "High Waistband", "Squat-Proof Fabric"]
    },
    {
        id: 7,
        title: "Unisex Sunglasses",
        price: 149,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
        availability: "Out of Stock",
        gender: "Unisex",
        description: "Stylish sunglasses with UV protection and polarized lenses. Perfect for any outdoor activity.",
        sizes: ["One Size"],
        features: ["UV Protection", "Polarized Lenses", "Lightweight Frame", "Scratch Resistant"]
    },
    {
        id: 8,
        title: "Women's Winter Coat",
        price: 189,
        originalPrice: 250,
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop",
        availability: "In Stock",
        gender: "Women",
        description: "Warm and stylish winter coat with water-resistant fabric and insulated lining.",
        sizes: ["XS", "S", "M", "L", "XL"],
        features: ["Water Resistant", "Insulated Lining", "Adjustable Hood", "Multiple Pockets"]
    }
];

const ProductsPage = () => {
    const [filters, setFilters] = useState({
        gender: [],
        priceRange: [0, 1000],
        availability: 'All'
    });
    
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            gender: [],
            priceRange: [0, 1000],
            availability: 'All'
        });
    };

    const filteredProducts = useMemo(() => {
        return dummyProducts.filter(product => {
            // Gender filter
            if (filters.gender.length > 0 && !filters.gender.includes(product.gender)) {
                return false;
            }

            // Price range filter
            if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
                return false;
            }

            // Availability filter
            if (filters.availability !== 'All' && product.availability !== filters.availability) {
                return false;
            }

            return true;
        });
    }, [filters]);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const handleCloseDetail = () => {
        setSelectedProduct(null);
    };

    return (
        <div className={styles.productsPage}>
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <FilterBar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                    />
                </div>
                
                <div className={styles.mainContent}>
                    <div className={styles.header}>
                        <h1>Products</h1>
                        <p className={styles.resultCount}>
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                        </p>
                    </div>
                    
                    <ProductGrid
                        products={filteredProducts}
                        onProductClick={handleProductClick}
                        selectedProduct={selectedProduct}
                        onCloseDetail={handleCloseDetail}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
