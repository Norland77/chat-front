import {Outlet} from 'react-router-dom'
import Header from '../../components/Header/Header'
import styles from './layout.module.scss'
import {type FC} from 'react'
const Layout: FC = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <Outlet />
    </div>
  )
}

export default Layout
