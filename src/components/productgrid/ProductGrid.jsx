import React from "react";
import ProductCard from "../productcard/ProductCard";
import ExpandedProductModal from "../../features/PerformersPage/ExpandedProductModal/ExpandedProductModal";
import styles from "./ProductGrid.module.scss";

const ProductGrid = ({
  products,
  onProductClick,
  selectedProduct,
  onCloseDetail,
  onAddToCart,
}) => {
  return (
    <div className={styles.productGridContainer}>
      <div className={styles.productGrid}>
        {products.map((product) => (
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
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
};

export default ProductGrid;
