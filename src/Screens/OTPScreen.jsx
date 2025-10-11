import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
// Assuming these are local assets and utility functions
// import { background_enter_otp } from '../Assets/index.js';
import { showInfoToast, showSuccessToast } from '../utils/ToastUtil.js';
import { background_enter_otp } from '../Assets';

// Mock functions for demonstration since original files are not provided
// const showInfoToast = (message) => Alert.alert('Info', message);
// const showSuccessToast = (message) => Alert.alert('Success', message);
// const background_enter_otp = { uri: 'https://placehold.co/400x800/a2d9ce/4a5568?text=Background' };


const OTPScreen = ({ navigation, route }) => {
  const { mobile, user, token } = route.params || { mobile: '9876543210' }; // Get mobile from Login screen, with fallback for demo

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const inputs = useRef([]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === 0) {
      setIsResendEnabled(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Handle OTP input change
  const handleChange = (text, index) => {
    const newOtp = [...otp];
    
    if (text.length === 1) {
      // Add digit
      newOtp[index] = text;
      setOtp(newOtp);
      
      // Move to next input if not last
      if (index < 3) {
        inputs.current[index + 1]?.focus();
      }
    } else if (text === '') {
      // Backspace: clear current box
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  // Handle key press (for backspace)
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '') {
      // If backspace pressed on empty box, go to previous
      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  // Validate and proceed (auto-called when 4 digits are entered)
  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === 4) {
      // Simulate OTP verification
      verifyOTP(otpString);
    }
  }, [otp]);

  const verifyOTP = (otpString) => {
    console.log("Verifying OTP:", otpString);
    
    // CORRECTED LOGIC: You must compare otpString to each value separately.
    if (otpString === "1234" || otpString === "9990") {
      showSuccessToast('लॉगिन सफल रहा है...');
      // In a real app, you would navigate. We'll comment it out for this example.
      navigation.replace('Dashboard');
    } else {
      showInfoToast("कृपया सही ओटीपी दर्ज करें");
    }
  };

  // Handle resend OTP
  const handleResend = () => {
    setTimeLeft(30);
    setIsResendEnabled(false);
    setOtp(['', '', '', '']); // Clear OTP fields
    inputs.current[0]?.focus(); // Focus first input
    // Alert.alert('OTP Resent', `New OTP sent to +91 ${mobile}`);
    showSuccessToast('OTP Resent', `New OTP sent to +91 ${mobile}`)
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Top Branch Image */}
      <Image
        source={background_enter_otp}
        style={styles.branch}
        resizeMode="cover"
      />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>ओ.टी.पी. डाले</Text>
        <Text style={styles.subtitle}>
          आपके मोबाइल नंबर पर प्राप्त 4 अंको का ओ.टी.पी. डाले
            <Text style={{fontWeight: 'bold'}}> मोबाइल नंबर {mobile}</Text>
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.otpBox}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0}
            />
          ))}
        </View>

        {/* Timer */}
        <Text style={styles.timerText}>
          एंटर कोड इन: {formatTime(timeLeft)}
        </Text>

        {/* Resend Button */}
        <TouchableOpacity
          style={[styles.resendButton, !isResendEnabled && styles.disabledButton]}
          disabled={!isResendEnabled}
          onPress={handleResend}
        >
          <Text style={[styles.resendText, !isResendEnabled && styles.disabledText]}>
            फिर से भेजे
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  branch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    width: "100%",
    resizeMode:"cover",
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 100,
    marginBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  otpBox: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#f0f9e8',
    marginHorizontal: 6,
    color: '#333',
  },
  timerText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  resendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#4CAF50', // A more positive color
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  resendText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#666',
  },
});

export default OTPScreen;
