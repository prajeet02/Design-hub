import styles from "./Performers.module.scss";
import ProductsPage from "../../components/productspage/ProductsPage";

const Performers = () => {
  return (
    <>
      <div className={styles.performersContainer}>
        <ProductsPage />
      </div>
    </>
  );
};

export default Performers;
