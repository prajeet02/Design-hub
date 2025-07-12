import styles from "./Performers.module.scss";
import ProductsPage from "../../components/productspage/ProductsPage";
import Footer from "../../components/footer/Footer";

const Performers = () => {
  return (
    <>
      <div className={styles.performersContainer}>
        <ProductsPage />
      </div>
      <div className={styles["footer-wrapper"]}>
        <Footer />
      </div>
    </>
  );
};

export default Performers;
