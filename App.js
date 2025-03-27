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

  const blinkOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setupAudioMode(); 
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startBlinking();
    } else {
      stopBlinking();
    }
  }, [isPlaying]);

  async function setupAudioMode() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }

  const startBlinking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopBlinking = () => {
    blinkOpacity.setValue(1);
  };

  const handlePlayPause = async () => {
    if (isLoading) return;
  
    if (isPlaying && sound) {
      setIsLoading(true);
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }
  
    if (!sound) {
      setIsLoading(true);
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        playsThroughEarpieceAndroid: false,
      });
  
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: radioUrl },
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      
      await newSound.playAsync();
      setSound(newSound);
      setIsPlaying(true);
      setIsLoading(false);
  
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded || status.didJustFinish) {
          setIsPlaying(false);
          setSound(null);
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.headerTitle}>Live Radio</Text>
      <Text style={styles.headerSubtitle}>RADYO BISELCO</Text>
      <Text style={styles.headerSub}>102.9 MHZ</Text>

      <View style={styles.radioCard}>
        <Image source={require('./assets/logo.jpg')} style={styles.radioImage} />

        {isPlaying && (
          <Animated.View style={[styles.onAirBadge, { opacity: blinkOpacity }]}>
            <Text style={styles.onAirText}>🔴 ON AIR</Text>
          </Animated.View>
        )}

        <View style={styles.showInfo}>
          <Text style={styles.showTitle}>PBS AFFILIATE</Text>
        </View>

        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={40} color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="radio" size={24} color="white" />
          <Text style={styles.navText}>Radio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="newspaper" size={24} color="white" />
          <Text style={styles.navText}>News</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="alert-circle" size={24} color="white" />
          <Text style={styles.navText}>Alert</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0033A0', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold',
    
  },
  headerSubtitle: {
    fontSize: 40,
    color: '#FFCC00', 
    fontWeight: 'bold',
  },
  headerSub: {
    fontSize: 20,
    color: '#FFCC00', 
    fontWeight: 'bold',
    marginBottom: 20,
  },
  radioCard: {
    width: width * 0.9,
    borderRadius: 15,
    backgroundColor: '#D00000', 
    overflow: 'hidden',
    position: 'relative',
    MarginTop: 100,
  },
  radioImage: {
    width: 300, 
    height: 300,
    borderRadius: 150, 
    alignSelf: 'center',
    marginTop: 20,
  },
  onAirBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#FFD700', 
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  onAirText: {
    color: '#000080', 
    fontWeight: 'bold',
  },
  showInfo: {
    padding: 15,
  },
  showTitle: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
    padding: 15,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    flexDirection: 'row',
    backgroundColor: '#D00000',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
  },
});
