import { useState, useEffect } from 'react';
import styles from './ProductDetail.module.scss';

const ProductDetail = ({ product, onClose }) => {
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const { title, price, image, availability, gender, description, sizes, originalPrice, features } = product;
    
    const isOnSale = originalPrice && originalPrice > price;
    const discountPercentage = isOnSale ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleQuantityChange = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>

                <div className={styles.content}>
                    <div className={styles.imageSection}>
                        <div className={styles.mainImage}>
                            <img src={image} alt={title} />
                            {isOnSale && (
                                <div className={styles.saleTag}>
                                    -{discountPercentage}%
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.detailsSection}>
                        <div className={styles.productMeta}>
                            <span className={styles.gender}>{gender}</span>
                            <span className={`${styles.availability} ${availability === 'In Stock' ? styles.inStock : styles.outOfStock}`}>
                                {availability}
                            </span>
                        </div>

                        <h1 className={styles.title}>{title}</h1>
                        
                        <div className={styles.priceContainer}>
                            <span className={styles.currentPrice}>${price}</span>
                            {isOnSale && (
                                <span className={styles.originalPrice}>${originalPrice}</span>
                            )}
                        </div>

                        <p className={styles.description}>{description}</p>

                        {features && features.length > 0 && (
                            <div className={styles.features}>
                                <h3>Features:</h3>
                                <ul>
                                    {features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {sizes && sizes.length > 0 && (
                            <div className={styles.sizeSection}>
                                <h3>Size:</h3>
                                <div className={styles.sizeOptions}>
                                    {sizes.map(size => (
                                        <button
                                            key={size}
                                            className={`${styles.sizeButton} ${selectedSize === size ? styles.selected : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className={styles.quantitySection}>
                            <h3>Quantity:</h3>
                            <div className={styles.quantityControls}>
                                <button 
                                    className={styles.quantityButton}
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className={styles.quantity}>{quantity}</span>
                                <button 
                                    className={styles.quantityButton}
                                    onClick={() => handleQuantityChange(1)}
                                    disabled={quantity >= 10}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button 
                                className={styles.addToCartButton}
                                disabled={availability === 'Out of Stock'}
                            >
                                {availability === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                            <button className={styles.wishlistButton}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
