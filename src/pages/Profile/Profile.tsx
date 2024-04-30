import {useAppSelector} from "../../hooks/redux";
import {chatAPI} from "../../services/ChatServices";
import styles from './profile.module.scss'
import {Link} from "react-router-dom";
import ProfileEditModal from "../../components/ProfileEditModal/ProfileEditModal";
import {useEffect, useState} from "react";


const Profile = () => {
  const { accessToken, id } = useAppSelector(state => state.userReducer)
  const [fetchUser, {data: user}] = chatAPI.useFetchUserMutation()
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUser({accessToken: accessToken, id: id});
  }, [accessToken]);


  return (
    <>
      <div className={styles.body}>
        {
          user && user.avatar_url ? <img className={styles.avatar} src={user.avatar_url} alt="avatar"/> :
            <div className={styles.avatarNone}>

            </div>
        }
        <div className={styles.info}>
          <span>Username: {user && user.username}</span>
          <span>Email: {user && user.email ? user.email : 'Empty'}</span>
          <span>Phone number: {user && user.phone_number ? user.phone_number : 'Empty'}</span>
          <span>Description: {user && user.description ? user.description : 'Empty'}</span>
        </div>
        <div className={styles.buttonsBlock}>
          <Link className={styles.button} onClick={() => {
            setIsModalOpen(true);
          }} to={'#'}>Edit Profile</Link>
        </div>
      </div>
      <ProfileEditModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} user={user} fetchUser={fetchUser}/>
    </>
  );
};

export default Profile;