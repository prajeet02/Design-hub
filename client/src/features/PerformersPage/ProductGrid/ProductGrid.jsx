import ProductCard from '../ProductCard/ProductCard';
import ExpandedProductModal from '../ExpandedProductModal/ExpandedProductModal';
import styles from './ProductGrid.module.scss';

const ProductGrid = ({ products, onProductClick, selectedProduct, onCloseDetail }) => {
    return (
        <div className={styles.productGridContainer}>
            <div className={styles.productGrid}>
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => onProductClick(product)}
                    />
                ))}
            </div>

            {selectedProduct && (
                <ExpandedProductModal
                    product={selectedProduct}
                    onClose={onCloseDetail}
                />
            )}
        </div>
    );
};

export default ProductGrid;
