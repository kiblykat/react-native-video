import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import Slider from "@react-native-community/slider";

const youtubeIds = [
  "K4ZSmMHOH6o",
  "5JtVP_KrjhE",
  "o_DpuiJq9bc",
  "845By_LKvU8",
  "eQOaZPnMmoE",
];

export default function YouTubePlayerComponent() {
  const [currSong, setCurrSong] = useState(youtubeIds[0]);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef();
  const sliderRef = useRef();

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  const onReady = useCallback(() => {
    playerRef.current?.getDuration().then(setDuration);
  }, []);

  const onProgress = useCallback((data) => {
    setCurrentTime(data.currentTime);
  }, []);

  const seekTo = useCallback((value) => {
    playerRef.current?.seekTo(value, true);
    setCurrentTime(value);
  }, []);

  const nextSong = () => {
    if (youtubeIds.indexOf(currSong) >= youtubeIds.length - 1) {
      setCurrSong(youtubeIds[0]);
    } else {
      setCurrSong((currSong) => youtubeIds[youtubeIds.indexOf(currSong) + 1]);
    }
  };

  const prevSong = useCallback(() => {
    if (youtubeIds.indexOf(currSong) <= 0) {
      setCurrSong(youtubeIds[youtubeIds.length - 1]);
    } else {
      setCurrSong((currSong) => youtubeIds[youtubeIds.indexOf(currSong) - 1]);
    }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing && playerRef.current) {
        playerRef.current.getCurrentTime().then((time) => {
          setCurrentTime(time);
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playing]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <YoutubePlayer
        ref={playerRef}
        height={400}
        width={400}
        play={playing}
        videoId={currSong}
        onChangeState={onStateChange}
        onReady={onReady}
        onProgress={onProgress}
      />
      <View style={styles.controls}>
        <Button title={playing ? "Pause" : "Play"} onPress={togglePlaying} />
        <Slider
          ref={sliderRef}
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onSlidingComplete={seekTo}
        />

        <Text>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Text>
        <View style={styles.nextSong}>
          <Button title={"Prev Song"} onPress={prevSong} />
          <Button title={"Next Song"} onPress={nextSong} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    width: 400,
    marginTop: 10,
  },
  slider: {
    width: "100%",
    marginTop: 10,
  },
  nextSong: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
