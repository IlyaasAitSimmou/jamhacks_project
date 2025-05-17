import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react'
import { Audio } from 'expo-av'

const VoiceRecord = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [permissionResponse, requestPermission] = Audio.usePermissions()

  useEffect(() => {
    // Request permissions on component mount
    const getPermissions = async () => {
      await requestPermission()
    }
    getPermissions()
  }, [])

  async function startRecording() {
    try {
      // Check if permission is granted
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..')
        await requestPermission()
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
      
      console.log('Starting recording..')
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      setRecording(recording)
      setIsRecording(true)
    } catch (err) {
      console.error('Failed to start recording', err)
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..')
    if (!recording) return
    
    setIsRecording(false)
    await recording.stopAndUnloadAsync()
    const uri = recording.getURI()
    setRecording(null)
    
    if (uri) {
      sendAudioToServer(uri)
    }
  }

  async function sendAudioToServer(uri: string) {
    try {
      // Create FormData for sending the file
      const formData = new FormData()
      formData.append('audio', {
        uri: uri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      } as any)

      console.log('Sending audio to server...')
      const response = await fetch('http://10.37.123.232:5001/upload-audio', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const result = await response.json()
      console.log('Server response:', result)
    } catch (error) {
      console.error('Error sending audio to server:', error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Recorder</Text>
      
      <TouchableOpacity
        style={[
          styles.recordButton,
          isRecording ? styles.recordingActive : null
        ]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.recordButtonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
      
      <Text style={styles.instructions}>
        {isRecording ? 'Recording in progress...' : 'Press button to start recording'}
      </Text>
    </View>
  )
}

export default VoiceRecord

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  recordButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  recordingActive: {
    backgroundColor: '#ff4c4c',
    borderColor: '#cc0000',
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  }
})