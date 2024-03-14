import {Outlet} from 'react-router-dom'
import Header from '../../components/Header/Header'
import styles from './layout.module.scss'
import {type FC} from 'react'
import {useConnectSocket} from "../../hooks/useConnectSocket";
import Rooms from "../Rooms/Rooms";
import {useAppSelector} from "../../hooks/redux";
import Footer from "../Footer/Footer";
const Layout: FC = () => {
    useConnectSocket();
  return (
    <div className={styles.layout}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout
