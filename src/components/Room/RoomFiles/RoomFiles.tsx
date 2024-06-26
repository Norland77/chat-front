import React, {useState} from 'react';
import styles from "./room-files.module.scss";
import ModalImage from "../../ModalImage/ModalImage";
import AudioPlayer from "../../AudioPlayer/AudioPlayer";
import fileImg from "../../../img/file.svg";
import {IMessage} from "../../../interfaces/IMessage";

interface PropsType {
  message: IMessage
}

const RoomFiles = ({message}: PropsType) => {
  const [isOpenImg, setIsOpenImg] = useState(false);
  const [imgName, setImgName] = useState('');
  return (
    <div className={styles.filesGrid}>
      {message && message?.files?.map(file => (
        <div key={file.id}>
          {
            file.path !== "" &&
            <>
              {
                file.mimetype.split('/')[0] === 'image' ?
                  <>
                    <img onClick={() => {
                      setIsOpenImg(true);
                      setImgName(file.name);
                    }} src={`${file.path}`} alt={`${file.name}`}/>
                    <div onClick={() => {
                      setIsOpenImg(false);
                      setImgName('');
                    }} style={isOpenImg && imgName === file.name ? {display: "flex"} : {}} className={styles.modal}>
                      <ModalImage imageUrl={file.path} imageName={file.name} />
                    </div>
                  </> : file.mimetype.split('/')[0] === 'video' ?
                    <>
                      <video controls>
                        <source src={`${file.path}`} type={`${file.mimetype}`}/>
                      </video >
                    </> : file.mimetype.split('/')[0] === 'audio' ? <>
                      <AudioPlayer src={file.path} name={file.name}/>
                    </> : <div className={styles.file_block}>
                      <img className={styles.file} src={fileImg}></img>
                      <a href={`${file.path}`}>{file.name}</a>
                    </div>
              }
            </>
          }
        </div>
      ))}
    </div>
  );
};

export default RoomFiles;