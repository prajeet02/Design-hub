import styles from './ProductCard.module.scss';

const ProductCard = ({ product, onClick }) => {
	    const { title, price, image, availability, gender, originalPrice } = product;

    const isOnSale = originalPrice && originalPrice > price;
    const discountPercentage = isOnSale ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return (
        <div className={styles.productCard} onClick={onClick}>
            <div className={styles.imageContainer}>
                <img src={image} alt={title} className={styles.productImage} />
                {isOnSale && (
                    <div className={styles.saleTag}>
                        -{discountPercentage}%
                    </div>
                )}
                <div className={`${styles.availabilityTag} ${availability === 'Available' ? styles.available : styles.booked}`}>
                    {availability}
                </div>
                <div className={styles.overlay}>
                    <button className={styles.viewButton}>View Details</button>
                </div>
            </div>

            <div className={styles.productInfo}>
                <div className={styles.productMeta}>
                    <span className={styles.gender}>{gender}</span>
                </div>
                <h3 className={styles.productTitle}>{title}</h3>
                <div className={styles.priceContainer}>
                    <span className={styles.currentPrice}>${price}</span>
                    {isOnSale && (
                        <span className={styles.originalPrice}>${originalPrice}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
