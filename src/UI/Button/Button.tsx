import styles from './button.module.scss'

interface PropsType {
  text: string,
  width?: string,
  height?: string,
  onClick?: () => void,
  img?: string,
  font_size?: string
}

const Button = ({ height, width, text, onClick, img, font_size}: PropsType) => {
  return (
    <button onClick={onClick}
            style={{height: height, width: width, fontSize: font_size}}
            className={styles.button}
    >
      {text}
      {img && <img src={img} alt="icon"/>}
    </button>
  );
};

export default Button;