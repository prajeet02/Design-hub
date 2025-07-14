import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/footer";
import ProductsPage from "../../features/PerformersPage/ProductsPage/ProductsPage";
import styles from "./Performers.module.scss";

const Performers = () => {
    return (
        <>
            <div className={styles.performersContainer}>
                <Navbar />
                <ProductsPage />
                <Footer />
            </div>
        </>
    )
}

export default Performers;
