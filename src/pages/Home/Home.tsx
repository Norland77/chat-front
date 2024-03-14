import styles from "./home.module.scss";
import Header from "../../components/Header/Header";
import {Outlet} from "react-router-dom";
import Rooms from "../Rooms/Rooms";

const Home = () => {
    return (
        <div className={styles.home}>
            <Rooms />
            <div className={styles.outlet}>
                <Outlet/>
            </div>

        </div>
    );
};

export default Home;