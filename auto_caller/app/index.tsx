import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const index = () => {
  return (
    <ImageBackground 
    //   source={require('../assets/background.jpg')} 
      style={styles.background}
      imageStyle={{ opacity: 0.7 }}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)']}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.cardContainer}>
            <Text style={styles.title}>Voice Assistant</Text>
            <Text style={styles.subtitle}>Your personal voice-activated assistant powered by cutting-edge AI technology</Text>
            
            <View style={styles.featureContainer}>
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>🎤</Text>
                </View>
                <Text style={styles.featureText}>Voice Control</Text>
              </View>
              
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>⚡</Text>
                </View>
                <Text style={styles.featureText}>Fast Response</Text>
              </View>
              
              <View style={styles.feature}>
                <View style={styles.featureIcon}>
                  <Text style={styles.featureIconText}>🔒</Text>
                </View>
                <Text style={styles.featureText}>Secure</Text>
              </View>
            </View>
            
            <Link href="/voicerecord" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  )
}

export default index

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22,
  },
  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  feature: {
    alignItems: 'center',
    width: '30%',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6a11cb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#444',
  },
  button: {
    backgroundColor: '#6a11cb',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});