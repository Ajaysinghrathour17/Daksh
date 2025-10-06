// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { logo_dashboard_daksh, hand_hold_plant } from '../Assets/index.js';
import Colors from '../Contants/Color.js';

const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState('');

  const handleSendOTP = () => {
    if (!mobile || mobile.length <= 2) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit number.');
      //   9672224446  //mobile.length !== 2
      return;
    }
    // Simulate OTP send
    Alert.alert('OTP Sent!', `OTP sent to +91 ${mobile}`);
    navigation.navigate('OTPVerification', {
      mobile: mobile
    });

    // In real app, navigate to OTP verification screen
    // navigation.navigate('OTPVerification');
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={logo_dashboard_daksh}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>अपने अकाउंट में लॉगिन करें</Text>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.countryCode}>+91</Text>
        <TextInput
          style={styles.input}
          placeholder="रजिस्टर्ड मोबाइल नंबर डाले"
          keyboardType="numeric"
          value={mobile}
          onChangeText={setMobile}
          // maxLength={10}
          maxLength={10}

        />
      </View>

      {/* Send OTP Button */}
      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <Text style={styles.buttonText}>ओ.टी.पी. सेंड करें</Text>
      </TouchableOpacity>

      {/* Plant Illustration */}
      <View style={styles.plantContainer}>
        <Image
          source={hand_hold_plant}
          style={styles.plant}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.purple_200,
    padding: 0,
    paddingTop: 50,
    height: "100%"
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 160,
    height: 160,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    // paddingVertical:20,
    marginBottom: 20,
    alignItems: 'center',
    borderColor: Colors.grey_40,
    borderWidth: 1,

  },
  countryCode: {
    fontSize: 16,
    // fontWeight: 'bold',
    marginRight: 10,
    color: '#333',
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 40,
    marginHorizontal: 20,

  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  plantContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 0,
    width: '100%',
    // height: '100%',
    // backgroundColor:'red',
    elevation: 99,

  },
  plant: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',

  },
});

export default LoginScreen;