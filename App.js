import React, { useState, useCallback } from "react";
import { View, Alert } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

export default function App() {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("Video has finished playing!");
    }
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <YoutubePlayer
        height={300}
        width={400}
        play={playing}
        videoId={"K4ZSmMHOH6o"}
        onChangeState={onStateChange}
      />
    </View>
  );
}
