import React, { useState, useCallback, useRef, useEffect } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import Slider from "@react-native-community/slider";

export default function YouTubePlayerComponent() {
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
    if (!sliderRef.current.isSeeking()) {
      setCurrentTime(data.currentTime);
    }
  }, []);

  const seekTo = useCallback((value) => {
    playerRef.current?.seekTo(value, true);
    setCurrentTime(value);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playing && playerRef.current) {
        playerRef.current.getCurrentTime().then((time) => {
          if (!sliderRef.current.isSeeking()) {
            setCurrentTime(time);
          }
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
        height={300}
        width={400}
        play={playing}
        videoId={"K4ZSmMHOH6o"}
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
});
