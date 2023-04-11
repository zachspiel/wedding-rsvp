import React from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../database/database";

interface Props {
  image: string;
  className?: string;
  height?: string;
}

const FirebaseImage = (props: Props): JSX.Element => {
  const { image, className, height } = props;
  const [url, setUrl] = React.useState("");

  React.useEffect(() => {
    const pathReference = ref(storage, image);
    getDownloadURL(pathReference).then((url) => {
      setUrl(url);
    });
  }, [image]);

  return (
    <>
      {url.length > 0 && (
        <img src={url} className={className} alt={image} style={{ height: height }} />
      )}
    </>
  );
};

export default FirebaseImage;
