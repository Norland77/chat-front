import {Outlet} from 'react-router-dom'
import Header from '../../components/Header/Header'
import styles from './layout.module.scss'
import {type FC} from 'react'
import {useConnectSocket} from "../../hooks/useConnectSocket";
import Rooms from "../Rooms/Rooms";
import {useAppSelector} from "../../hooks/redux";
import Footer from "../../components/Footer/Footer";
const Layout: FC = () => {
    useConnectSocket();
  return (
    <div className={styles.layout}>
      <Header />
      <Outlet />
    </div>
  )
}

export default Layout
