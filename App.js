import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [frequency, setFrequency] = useState(76.0);

  const radioUrl = 'https://your-streaming-url.com/stream'; 
  const handlePlayPause = async () => {
    if (isPlaying && sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: radioUrl },
      { shouldPlay: true }
    );
    setSound(newSound);
    setIsPlaying(true);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded || status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  };

  const increaseFrequency = () => {
    if (frequency < 108) setFrequency(frequency + 0.1);
  };

  const decreaseFrequency = () => {
    if (frequency > 76) setFrequency(frequency - 0.1);
  };

  return (
    <ImageBackground source={require('./assets/bg.jpg')} style={styles.background}>
      <View style={styles.container}>
        
        <Text style={styles.frequencyText}>{frequency.toFixed(1)} MHz</Text>

        
        <Svg height={200} width={200}>
          <Circle cx="100" cy="100" r="80" stroke="lightblue" strokeWidth="5" fill="transparent" />
          <Circle cx="140" cy="100" r="10" fill="lightblue" />
        </Svg>

        
        <View style={styles.controls}>
          <TouchableOpacity onPress={decreaseFrequency} style={styles.controlButton}>
            <Text style={styles.controlText}>◀</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
            <Text style={styles.playText}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={increaseFrequency} style={styles.controlButton}>
            <Text style={styles.controlText}>▶</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frequencyText: {
    fontSize: 36,
    color: '#fff',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  controlButton: {
    padding: 15,
    margin: 10,
    backgroundColor: '#004d66',
    borderRadius: 50,
  },
  controlText: {
    fontSize: 24,
    color: '#fff',
  },
  playButton: {
    padding: 20,
    backgroundColor: '#1DB954',
    borderRadius: 50,
  },
  playText: {
    fontSize: 24,
    color: '#fff',
  },
});

