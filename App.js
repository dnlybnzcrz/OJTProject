import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, Animated, Image, Dimensions 
} from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const radioUrl = 'http://58.97.187.52:5001/rp1';

  // Create animated values for the bars
  const barAnimations = Array.from({ length: 10 }, () => useRef(new Animated.Value(30)).current);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startFrequencyAnimation();
    } else {
      resetFrequencyBars();
    }
  }, [isPlaying]);

  const startFrequencyAnimation = () => {
    barAnimations.forEach((anim) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: Math.random() * 50 + 30,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: Math.random() * 50 + 10,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
  };

  const resetFrequencyBars = () => {
    barAnimations.forEach((anim) => {
      anim.setValue(30); // Reset to default height when stream is stopped
    });
  };

  const handlePlayPause = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
          } else {
            await sound.playAsync();
            setIsPlaying(true);
          }
          return;
        }
      } 

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        playsThroughEarpieceAndroid: false,
      });

      const newSound = new Audio.Sound();

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded || status.didJustFinish) {
          setIsPlaying(false);
        }
      });

      await newSound.loadAsync({ uri: radioUrl }, { shouldPlay: true });
      await newSound.playAsync();

      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing stream:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/rp1.jpg')} style={styles.albumCover} />
      
      <Text style={styles.nowPlaying}>Now Playing</Text>
      <Text style={styles.songTitle}>RADYO PILIPINAS</Text>
      <Text style={styles.artist}>102.9 MHZ</Text>

      <View style={styles.frequencyContainer}>
        {barAnimations.map((anim, index) => (
          <Animated.View 
            key={index} 
            style={[styles.frequencyBar, { height: anim }]} 
          />
        ))}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity>
          <Ionicons name="play-skip-back" size={30} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="play-skip-forward" size={30} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  albumCover: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  nowPlaying: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 5,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  artist: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  frequencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.8,
    height: 60,
    marginBottom: 20,
  },
  frequencyBar: {
    width: 10,
    marginHorizontal: 3,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 20,
  },
  playButton: {
    backgroundColor: 'red',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});
  