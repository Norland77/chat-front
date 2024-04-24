import {useEffect, useState} from "react";

interface PropsType {
  imageUrl: string | undefined
  imageName: string
}

const ModalImage = ({ imageUrl, imageName }: PropsType) => {
  const [imageStyle, setImageStyle] = useState({});

  useEffect(() => {
    const img = new Image();
    if (typeof imageUrl === "string") {
      img.src = imageUrl;
    }
    img.onload = () => {
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight;
      const width = img.width;
      const height = img.height;

      if (width > maxWidth || height > maxHeight) {
        setImageStyle({
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        });
      } else {
        setImageStyle({

        });
      }
    };
  }, [imageUrl]);

  return <img src={imageUrl} alt={imageName} style={imageStyle} />;
};

export default ModalImage;