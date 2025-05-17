
// import { Stack } from 'expo-router';
// import { SafeAreaView, Text, View, AppState } from 'react-native';
// import { Audio } from 'expo-av';
// import React, { useEffect, useRef, useState } from 'react';
// // @ts-ignore
// import Alan from 'alan-ai/alan-sdk-react-native';

// let activeRecorder = null;
// let soundObject = null;

// // Audio recording object reference
// // let activeRecorder = null;

// const confirmationSound = require('../assets/sounds/confirmation.mp3');

// // Simplified voice monitoring function (foreground only)
// const listenForAudio = async () => {
//   try {
//     // Check permissions
//     const { status } = await Audio.requestPermissionsAsync();
//     if (status !== 'granted') {
//       console.log('Audio recording permission not granted!');
//       return;
//     }
    
//     console.log('Starting audio monitoring...');
    
//     // Configure audio session for iOS
//     await Audio.setAudioModeAsync({
//       allowsRecordingIOS: true,
//       playsInSilentModeIOS: true,
//       interruptionModeIOS: 1,  // 1 = DO_NOT_MIX
//       shouldDuckAndroid: true,
//       interruptionModeAndroid: 1,  // 1 = DO_NOT_MIX
//     });
    
//     // Create a new recording
//     const recording = new Audio.Recording();
//     await recording.prepareToRecordAsync({
//       ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
//       android: {
//         ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
//         isMetering: true,
//       },
//       ios: {
//         ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
//         meteringEnabled: true,
//       },
//     });
    
//     activeRecorder = recording;
    
//     // Monitor audio levels
//     recording.setOnRecordingStatusUpdate((status) => {
//       if (status.metering) {
//         const level = status.metering;
//         console.log(`Audio level: ${level} dB`);
        
//         // Detect loud sounds (basic voice activity detection)
//         if (level > -20) { // Adjust threshold as needed
//           console.log('Voice activity detected!');
//           handleVoiceDetected(recording);
//         }
//       }
//     });
    
//     // Start recording to monitor audio
//     await recording.startAsync();
//     await recording.setProgressUpdateInterval(300);
    
//     // Stop listening after 5 seconds
//     setTimeout(async () => {
//       if (activeRecorder === recording) {
//         try {
//           await recording.stopAndUnloadAsync();
//           activeRecorder = null;
//         } catch (e) {
//           // Handle possible errors when stopping
//         }
//       }
//     }, 5000);
    
//   } catch (error) {
//     console.error('Error in audio monitoring:', error);
//   }
// };

// const handleVoiceDetected = async (listeningRecording) => {
//   try {
//     // Stop the monitoring recording
//     if (activeRecorder === listeningRecording) {
//       activeRecorder = null;
//       await listeningRecording.stopAndUnloadAsync();
//     }
    
//     // Make sure audio mode is set correctly for recording
//     await Audio.setAudioModeAsync({
//       allowsRecordingIOS: true,
//       playsInSilentModeIOS: true,
//       interruptionModeIOS: 1,  // 1 = DO_NOT_MIX
//       shouldDuckAndroid: true,
//       interruptionModeAndroid: 1,  // 1 = DO_NOT_MIX
//     });
    
//     // Start a new recording for capturing the actual command
//     const { recording } = await Audio.Recording.createAsync(
//       Audio.RecordingOptionsPresets.HIGH_QUALITY
//     );
    
//     console.log('Recording command after voice detection...');
    
//     // Record for a few seconds
//     setTimeout(async () => {
//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();
      
//       if (uri) {
//         await sendAudioToServer(uri);
//       }
//     }, 5000); // Record for 5 seconds
    
//   } catch (error) {
//     console.error('Error handling voice detection:', error);
//   }
// };

// const sendAudioToServer = async (uri) => {
//   try {
//     const formData = new FormData();
//     formData.append('audio', {
//       uri: uri,
//       type: 'audio/m4a',
//       name: 'recording.m4a',
//     } as any);

//     console.log('Sending audio to server...');
//     const response = await fetch('http://10.37.123.232:5001/upload-audio', {
//       method: 'POST',
//       body: formData,
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     const result = await response.json();
//     console.log('Server response:', result);
//   } catch (error) {
//     console.error('Error sending audio to server:', error);
//   }
// };

// export default function RootLayout() {
//   const alanKey = 'YOUR_ALAN_KEY';
//   const appState = useRef(AppState.currentState);
//   const soundRef = useRef(null);

//   useEffect(() => {
//     // Start listening on component mount
//     listenForAudio();
    
//     // Monitor app state changes
//     const subscription = AppState.addEventListener('change', nextAppState => {
//       if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
//         console.log('App has come to the foreground');
//         // Restart listening when app returns to foreground
//         listenForAudio();
//       } else if (nextAppState.match(/inactive|background/) && appState.current === 'active') {
//         console.log('App has gone to the background');
//         // Clean up recording when app goes to background
//         if (activeRecorder) {
//           try {
//             activeRecorder.stopAndUnloadAsync();
//             activeRecorder = null;
//           } catch (e) {
//             // Handle errors
//           }
//         }
//       }
//       appState.current = nextAppState;
//     });
    
//     return () => {
//       subscription.remove();
//       // Clean up any active recording
//       if (activeRecorder) {
//         activeRecorder.stopAndUnloadAsync().catch(() => {});
//       }
//     };
//   }, []);

//   return (
//     <Stack>
//       <Stack.Screen name="index" options={{ headerShown: false }} />
//       <Stack.Screen name="voicerecord" options={{ title: "Voice Recorder" }} />
//     </Stack>
//   );
// }


// import { Stack } from "expo-router";
// import { AppState, View } from "react-native";
// import { Audio } from "expo-av";
// import React, { useEffect, useRef } from "react";

// const sendAudioToServer = async (uri: string) => {
//   try {
//     const formData = new FormData();
//     formData.append("audio", {
//       uri,
//       type: "audio/m4a",
//       name: "recording.m4a",
//     } as any);
//     console.log("Sending audio to server...");
//     const response = await fetch("http://10.37.123.232:5001/upload-audio", {
//       method: "POST",
//       body: formData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     const result = await response.json();
//     console.log("Server response:", result);
//   } catch (error) {
//     console.error("Error sending audio:", error);
//   }
// };

// const recordAndSend = async () => {
//   try {
//     // Ensure audio mode is configured
//     await Audio.setAudioModeAsync({
//       allowsRecordingIOS: true,
//       playsInSilentModeIOS: true,
//     });

//     // Check permissions
//     const { status } = await Audio.requestPermissionsAsync();
//     if (status !== "granted") {
//       console.log("Permission not granted for audio recording");
//       return;
//     }

//     // Create and prepare a new recording
//     const recording = new Audio.Recording();
//     await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
//     await recording.startAsync();
//     console.log("Recording started");

//     // Wait 3 seconds, then stop and send
//     setTimeout(async () => {
//       try {
//         await recording.stopAndUnloadAsync();
//         const uri = recording.getURI();
//         console.log("Recording stopped. URI:", uri);
//         if (uri) {
//           await sendAudioToServer(uri);
//         }
//       } catch (e) {
//         console.error("Error stopping recording", e);
//       }
//     }, 3000);
//   } catch (error) {
//     console.error("Error in recordAndSend:", error);
//   }
// };

// export default function RootLayout() {
//   const recordingLoopRef = useRef<NodeJS.Timeout>();

//   // A recursive loop: record for 3 seconds, send, then wait 3 seconds before recording again.
//   const startRecordingLoop = async () => {
//     await recordAndSend();
//     recordingLoopRef.current = setTimeout(() => {
//       startRecordingLoop();
//     }, 3000);
//   };

//   useEffect(() => {
//     startRecordingLoop();
//     return () => {
//       if (recordingLoopRef.current) {
//         clearTimeout(recordingLoopRef.current);
//       }
//     };
//   }, []);

//   return (
//     <Stack>
//       <Stack.Screen name="index" options={{ headerShown: false }} />
//       <Stack.Screen name="voicerecord" options={{ title: "Voice Recorder" }} />
//     </Stack>
//   );
// }


// import { Stack } from "expo-router";
// import { AppState, View } from "react-native";
// import { Audio } from "expo-av";
// import React, { useEffect, useRef } from "react";

// let isCommandRecording = false;

// const sendAudioToServer = async (uri: string) => {
//   try {
//     const formData = new FormData();
//     formData.append("audio", {
//       uri,
//       type: "audio/m4a",
//       name: "recording.m4a",
//     } as any);
//     console.log("Sending audio to server...");
//     const response = await fetch("http://10.37.123.232:5001/upload-audio-stt", {
//       method: "POST",
//       body: formData,
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     const result = await response.json();
//     console.log("Server response:", result);
//   } catch (error) {
//     console.error("Error sending audio:", error);
//   }
// };

// const recordAndSend = async () => {
//   try {
//     // Ensure audio mode is configured
//     await Audio.setAudioModeAsync({
//       allowsRecordingIOS: true,
//       playsInSilentModeIOS: true,
//     });

//     // Check permissions
//     const { status } = await Audio.requestPermissionsAsync();
//     if (status !== "granted") {
//       console.log("Permission not granted for audio recording");
//       return;
//     }

//     // Create and prepare a new recording
//     const recording = new Audio.Recording();
//     await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
//     await recording.startAsync();
//     console.log("Recording started");

//     // Wait 3 seconds, then stop and send
//     setTimeout(async () => {
//       try {
//         await recording.stopAndUnloadAsync();
//         const uri = recording.getURI();
//         console.log("Recording stopped. URI:", uri);
//         if (uri) {
//           await sendAudioToServer(uri);
//         }
//       } catch (e) {
//         console.error("Error stopping recording", e);
//       }
//     }, 3000);
//   } catch (error) {
//     console.error("Error in recordAndSend:", error);
//   }
// };

// export default function RootLayout() {
//   const recordingLoopRef = useRef<NodeJS.Timeout>();

//   // A recursive loop: record for 3 seconds, send, then wait 3 seconds before recording again.
//   const startRecordingLoop = async () => {
//     await recordAndSend();
//     recordingLoopRef.current = setTimeout(() => {
//       startRecordingLoop();
//     }, 3000);
//   };

//   useEffect(() => {
//     startRecordingLoop();
//     return () => {
//       if (recordingLoopRef.current) {
//         clearTimeout(recordingLoopRef.current);
//       }
//     };
//   }, []);

//   return (
//     <Stack>
//       <Stack.Screen name="index" options={{ headerShown: false }} />
//       <Stack.Screen name="voicerecord" options={{ title: "Voice Recorder" }} />
//     </Stack>
//   );
// }

import { Stack } from "expo-router";
import { AppState } from "react-native";
import { Audio } from "expo-av";
import React, { useEffect, useRef } from "react";

// Global flag for command recording
let isCommandRecording = false;
// Global reference for any active recording
let activeAudioRecording: Audio.Recording | null = null;

const sendAudioToServer = async (uri: string, isCommand = false) => {
  try {
    const formData = new FormData();
    formData.append("audio", {
      uri,
      type: "audio/m4a",
      name: isCommand ? "command_recording.m4a" : "recording.m4a",
    } as any);
    console.log("Sending audio to server...", isCommand ? "command" : "normal");
    const response = await fetch("http://10.37.123.232:5001/upload-audio-stt", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const result = await response.json();
    console.log("Server response:", result);
    // For normal recordings, check for the wake phrase.
    if (!isCommand && result.transcript) {
      const transcriptLower = result.transcript.toLowerCase();
      if (transcriptLower.includes("hey bob")) {
        console.log('Detected "hey bob" in transcription.');
        if (!isCommandRecording) {
          recordCommandAndSend();
        }
      }
    }
  } catch (error) {
    console.error("Error sending audio:", error);
  }
};

const recordAndSend = async () => {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission not granted for audio recording");
      return;
    }
    // If an active recording exists, attempt to unload it.
    if (activeAudioRecording) {
      try {
        await activeAudioRecording.stopAndUnloadAsync();
      } catch (e: any) {
        if (!e.message.includes("already been unloaded")) {
          console.error("Error unloading previous recording:", e);
        }
      }
      activeAudioRecording = null;
    }
    const recording = new Audio.Recording();
    activeAudioRecording = recording;
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await recording.startAsync();
    console.log("Recording started (wake clip)");
    setTimeout(async () => {
      try {
        if (activeAudioRecording === recording) {
          await recording.stopAndUnloadAsync();
          const uri = recording.getURI();
          console.log("Recording stopped. URI:", uri);
          activeAudioRecording = null;
          if (uri) {
            await sendAudioToServer(uri);
          }
        }
      } catch (e: any) {
        // Ignore error if already unloaded.
        if (!e.message.includes("already been unloaded")) {
          console.error("Error stopping wake clip recording", e);
        }
      }
    }, 3000);
  } catch (error) {
    console.error("Error in recordAndSend:", error);
  }
};

const recordCommandUntilSilence = () => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      isCommandRecording = true;
      console.log("Starting command recording (listening until silence)...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission not granted for command recording");
        isCommandRecording = false;
        return reject("Permission not granted");
      }
      if (activeAudioRecording) {
        try {
          await activeAudioRecording.stopAndUnloadAsync();
        } catch (e: any) {
          if (!e.message.includes("already been unloaded")) {
            console.error("Error unloading active recording:", e);
          }
        }
        activeAudioRecording = null;
      }
      const recording = new Audio.Recording();
      activeAudioRecording = recording;
      await recording.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        ios: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
          meteringEnabled: true,
        },
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          isMetering: true,
        },
      });
      const silenceThreshold = -20; // Adjust as needed.
      const silenceDurationRequired = 3000; // 1 second of silence.
      let lastSoundTime = Date.now();
      let stopped = false;
      recording.setOnRecordingStatusUpdate(async (status) => {
        if (!status.isRecording || !status.metering) return;
        if (status.metering > silenceThreshold) {
          lastSoundTime = Date.now();
        } else {
          const silenceTime = Date.now() - lastSoundTime;
          if (silenceTime >= silenceDurationRequired && !stopped) {
            stopped = true;
            try {
              await recording.stopAndUnloadAsync();
              const uri = recording.getURI();
              console.log("Command recording stopped after silence. URI:", uri);
              activeAudioRecording = null;
              isCommandRecording = false;
              resolve(uri);
            } catch (e: any) {
              activeAudioRecording = null;
              isCommandRecording = false;
              if (!e.message.includes("already been unloaded")) {
                reject(e);
              } else {
                resolve(recording.getURI() || "");
              }
            }
          }
        }
      });
      await recording.startAsync();
    } catch (error) {
      isCommandRecording = false;
      reject(error);
    }
  });
};

const recordCommandAndSend = async () => {
  try {
    const uri = await recordCommandUntilSilence();
    if (uri) {
      await sendAudioToServer(uri, true);
    }
  } catch (error) {
    console.error("Error in recordCommandAndSend:", error);
  }
};

export default function RootLayout() {
  const recordingLoopRef = useRef<NodeJS.Timeout>();
  const appState = useRef(AppState.currentState);

  const startRecordingLoop = async () => {
    if (!isCommandRecording) {
      await recordAndSend();
    }
    recordingLoopRef.current = setTimeout(() => {
      startRecordingLoop();
    }, 3000);
  };

  useEffect(() => {
    startRecordingLoop();
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        console.log("App has come to the foreground");
        startRecordingLoop();
      } else if (nextAppState.match(/inactive|background/)) {
        console.log("App has gone to the background");
        if (recordingLoopRef.current) {
          clearTimeout(recordingLoopRef.current);
        }
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
      if (recordingLoopRef.current) {
        clearTimeout(recordingLoopRef.current);
      }
    };
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="voicerecord" options={{ title: "Voice Recorder" }} />
    </Stack>
  );
}