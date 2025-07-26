import { useState, useMemo } from 'react';
import FilterBar from '../FilterBar/FilterBar';
import ProductGrid from '../ProductGrid/ProductGrid';
import styles from './ProductsPage.module.scss';

// Import model images
import model1 from '../../../assets/images/25002106_050_3a42.jpg';
import model2 from '../../../assets/images/25952977_014_5972.jpg';
import model3 from '../../../assets/images/44266157_063_6caf.jpg';
import model4 from '../../../assets/images/63577610_039_5904.jpg';
import model5 from '../../../assets/images/72134073_003_e877.jpg';
import model6 from '../../../assets/images/72723020_161_28f6.jpg';

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
        description: "Professional model with extensive experience in fashion and commercial photography. Specializes in high-end fashion shoots and brand campaigns.",
        sizes: ["Premium Package"],
        features: ["Fashion Photography", "Commercial Shoots", "Brand Campaigns", "Professional Portfolio"]
    },
    {
        id: 2,
        title: "Isabella Grace",
        price: 249,
        image: model2,
        availability: "Available",
        gender: "Female",
        description: "Versatile model with expertise in lifestyle and beauty photography. Known for natural expressions and professional demeanor.",
        sizes: ["Standard Package", "Premium Package"],
        features: ["Lifestyle Photography", "Beauty Shoots", "Natural Expressions", "Professional Experience"]
    },
    {
        id: 3,
        title: "Victoria Luxe",
        price: 199,
        originalPrice: 279,
        image: model3,
        availability: "Booked",
        gender: "Female",
        description: "Elegant model specializing in luxury brand photography and high-fashion editorial work. Perfect for sophisticated campaigns.",
        sizes: ["Premium Package"],
        features: ["Luxury Brands", "Editorial Work", "High Fashion", "Sophisticated Style"]
    },
    {
        id: 4,
        title: "Anastasia Star",
        price: 349,
        image: model4,
        availability: "Available",
        gender: "Female",
        description: "Top-tier model with international experience. Specializes in runway, editorial, and commercial photography with exceptional versatility.",
        sizes: ["Standard Package", "Premium Package", "Exclusive Package"],
        features: ["International Experience", "Runway Modeling", "Editorial Photography", "Commercial Work"]
    },
    {
        id: 5,
        title: "Natasha Divine",
        price: 229,
        image: model5,
        availability: "Available",
        gender: "Female",
        description: "Creative model with a passion for artistic photography and unique concepts. Brings creativity and professionalism to every shoot.",
        sizes: ["Standard Package", "Premium Package"],
        features: ["Artistic Photography", "Creative Concepts", "Unique Style", "Professional Attitude"]
    },
    {
        id: 6,
        title: "Elena Prestige",
        price: 189,
        originalPrice: 249,
        image: model6,
        availability: "Available",
        gender: "Female",
        description: "Experienced model with a focus on beauty and glamour photography. Known for stunning visuals and professional reliability.",
        sizes: ["Standard Package", "Premium Package"],
        features: ["Beauty Photography", "Glamour Shoots", "Stunning Visuals", "Professional Reliability"]
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

            // Availability filter - map "In Stock" to "Available" and "Out of Stock" to "Booked"
            let availabilityToCheck = filters.availability;
            if (filters.availability === 'In Stock') availabilityToCheck = 'Available';
            if (filters.availability === 'Out of Stock') availabilityToCheck = 'Booked';

            if (filters.availability !== 'All' && product.availability !== availabilityToCheck) {
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
                        <h1>Models</h1>
                        <p className={styles.resultCount}>
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'model' : 'models'} available
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
