"use client";

import { SectionContainer } from "../../components/common";
import React from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import classes from "./styles.module.css";

const Video = () => {
  const opts = {
    height: "350",
    width: "640",
    playerVars: {
      autoplay: 0,
    },
    loop: 1,
  };

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    //event.target.pauseVideo();
  };

  return (
    <YouTube
            className={classes.youtubeVideo}
            videoId="b8VGL6DL8iM"
            opts={opts}
            onReady={onPlayerReady}
          />
  );
};

export default Video;
