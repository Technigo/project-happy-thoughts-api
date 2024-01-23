import Lottie from "lottie-react";
import loadingAnimation from "../animations/Animation - 1702389468969.json";

export const LoadingComp = () => {
  const style = {
    width: 300,
  };
  return <Lottie animationData={loadingAnimation} style={style} />;
};
