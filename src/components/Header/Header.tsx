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
                accessToken && <Link onClick={() => logoutFunc()} to={'/login'}>
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12L13 12" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M18 15L20.913 12.087V12.087C20.961 12.039 20.961 11.961 20.913 11.913V11.913L18 9" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 5V4.5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19.5V19" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </Link>
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