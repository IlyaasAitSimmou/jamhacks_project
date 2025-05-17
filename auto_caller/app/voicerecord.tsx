import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

const VoiceRecord = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [visualFeedback, setVisualFeedback] = useState('Tap to start');
  
  // Animation for the recording button
  const animatedSize = useRef(new Animated.Value(1)).current;
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  
  // Pulse animation when recording
  useEffect(() => {
    let pulseAnimation: any;
    
    if (isRecording) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedSize, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(animatedSize, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      
      pulseAnimation.start();
    } else {
      Animated.spring(animatedSize, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
      }).start();
    }
    
    return () => {
      if (pulseAnimation) {
        pulseAnimation.stop();
      }
    };
  }, [isRecording]);
  
  // Request mic permissions on component mount
  useEffect(() => {
    const getPermissions = async () => {
      await requestPermission();
    };
    getPermissions();
  }, []);

  async function startRecording() {
    try {
      // Check if permission is granted
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      console.log('Starting recording...');
      setVisualFeedback('Listening...');
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      
      // Start opacity pulsing for the ring
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedOpacity, {
            toValue: 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
      
    } catch (err) {
      console.error('Failed to start recording', err);
      setVisualFeedback('Error starting recording');
    }
  }

  async function stopRecording() {
    console.log('Stopping recording...');
    setVisualFeedback('Processing...');
    
    if (!recording) return;
    
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);
    
    if (uri) {
      sendAudioToServer(uri);
    }
    
    // Reset animations
    animatedOpacity.setValue(1);
    setVisualFeedback('Tap to start');
  }

  async function sendAudioToServer(uri: string) {
    try {
      // Create FormData for sending the file
      const formData = new FormData();
      formData.append('audio', {
        uri: uri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any);

      setVisualFeedback('Sending to server...');
      console.log('Sending audio to server...');
      const response = await fetch('http://10.37.123.232:5001/upload-audio', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      console.log('Server response:', result);
      setVisualFeedback('Command received');
      
      // Reset visual feedback after a delay
      setTimeout(() => {
        setVisualFeedback('Tap to start');
      }, 2000);
    } catch (error) {
      console.error('Error sending audio to server:', error);
      setVisualFeedback('Error sending audio');
    }
  }

  return (
    <LinearGradient
      colors={['#6a11cb', '#2575fc']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar translucent backgroundColor="transparent" />
      
      <Text style={styles.title}>Voice Command</Text>
      <Text style={styles.subtitle}>Say "Hey Bob" to activate</Text>
      
      <View style={styles.recordingContainer}>
        <Animated.View 
          style={[
            styles.pulseRing,
            { 
              opacity: animatedOpacity,
              transform: [{ scale: animatedSize }] 
            }
          ]}
        />
        
        <TouchableOpacity
          style={styles.recordButton}
          onPress={isRecording ? stopRecording : startRecording}
          activeOpacity={0.8}
        >
          <FontAwesome5 
            name={isRecording ? "stop" : "microphone"} 
            size={isRecording ? 32 : 38} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.statusText}>{visualFeedback}</Text>
      
      <View style={styles.tipsContainer}>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Tips</Text>
          <Text style={styles.tipText}>• Speak clearly into the microphone</Text>
          <Text style={styles.tipText}>• Start with "Hey Bob" for commands</Text>
          <Text style={styles.tipText}>• Wait for the activation sound</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

export default VoiceRecord;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 50,
  },
  recordingContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ff4c4c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  statusText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  tipsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  tipText: {
    fontSize: 15,
    marginBottom: 5,
    color: '#555',
    lineHeight: 22,
  },
});