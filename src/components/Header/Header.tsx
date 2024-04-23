import {useAppDispatch, useAppSelector} from "../../hooks/redux";
import styles from './header.module.scss'
import {Link, useNavigate} from "react-router-dom";
import {setName, setToken} from "../../store/reducers/UserSlice";
import {authAPI} from "../../services/AuthServices";
import {useState} from "react";
const Header = () => {
    const {username, accessToken} = useAppSelector(state => state.userReducer)
    const [logout, {}] = authAPI.useLogoutMutation()
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const [isOpen, setOpen] = useState(false);
    const logoutFunc = () => {
        logout(null);
        dispatch(setName(''));
        dispatch(setToken(''));
        return navigate('/login')
    }

    const toggle = () => {
        setOpen(!isOpen);
    }

    return (
        <div className={styles.header}>
            <div>
                <div onClick={() => toggle()} className={`${styles.burger_menu} ${isOpen && styles.open}`}>
                    <div className={styles.burger_menu_bar}></div>
                    <div className={styles.burger_menu_bar}></div>
                    <div className={styles.burger_menu_bar}></div>
                </div>
                <h1>{username}</h1>
            </div>
            <h1>Chat</h1>
            {
                accessToken && <Link onClick={() => logoutFunc()} to={'/login'}>Logout</Link>
            }
            <div className={`${styles.modal} ${isOpen && styles.active}`}>
                <Link onClick={() => setOpen(false)} to={'/home/room-create'}>Create Chat</Link>
                <Link onClick={() => setOpen(false)} to={'/home/users'}>Show all users</Link>
                <Link onClick={() => setOpen(false)} to={'/home/profile'}>Profile</Link>
            </div>
        </div>
    );
};

export default Header;