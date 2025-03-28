import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Image, Dimensions, Easing } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function RadioScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const radioUrl = 'http://58.97.187.52:5001/rp1';

  const barAnimations = useRef(
    Array.from({ length: 18 }, () => new Animated.Value(30))).current;

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  useEffect(() => {
    if (isPlaying) {
      startContinuousFrequencyAnimation();
    } else {
      resetFrequencyBars();
    }
  }, [isPlaying]);

  const startContinuousFrequencyAnimation = () => {
    barAnimations.forEach((anim) => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: Math.random() * 50 + 20, 
          duration: Math.random() * 600 + 400, 
          easing: Easing.inOut(Easing.linear),
          useNativeDriver: false,
        })
      ).start();
    });
  };

  const resetFrequencyBars = () => {
    barAnimations.forEach((anim) => {
      Animated.timing(anim, {
        toValue: 30,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
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
      console.error('Error playing stream:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#0D47A1', '#B71C1C']} style={styles.container}>
      <View style={styles.centerContent}>
        <Image source={require('../assets/rp1.jpg')} style={styles.albumCover} />
        
        <Text style={styles.nowPlaying}>Now Streaming</Text>
        <Text style={styles.songTitle}>RADYO PILIPINAS</Text>
        <Text style={styles.artist}>88.7 MHz</Text>

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
            <Ionicons name="play-skip-back" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={40} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="play-skip-forward" size={30} color="white" />
          </TouchableOpacity>
        </View>

        
        <Image source={require('../assets/nobg.png')} style={styles.logoHandle} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.9,
    height: height * 0.9,
  },
  albumCover: {
    width: 275,
    height: 275,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFD700', 
  },
  nowPlaying: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  songTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  artist: {
    fontSize: 18,
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  frequencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.8,
    height: 60,
    marginBottom: 20,
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
  },
  frequencyBar: {
    width: 5,
    marginHorizontal: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: 'gold',
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 10,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    marginTop: 20,
  },
  playButton: {
    backgroundColor: '#FFD700', 
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'black', 
  },
  logoHandle: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 1, // Adjusts placement just above bottom navigation
    alignSelf: 'center',
  },
});
