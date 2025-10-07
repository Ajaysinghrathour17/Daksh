// src/screens/OTPScreen.js
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import { background_enter_otp } from '../Assets';

// const OTPScreen = ({ navigation, route }) => {
//   const { mobile } = route.params || {}; // Get mobile from Login screen

//   const [otp, setOtp] = useState(['', '', '', '']);
//   const [timeLeft, setTimeLeft] = useState(30); // 30 seconds
//   const [isResendEnabled, setIsResendEnabled] = useState(false);
//   const inputs = useRef([]);

//   // Timer effect
//   useEffect(() => {
//     if (timeLeft === 0) {
//       setIsResendEnabled(true);
//       return;
//     }

//     const timerId = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [timeLeft]);

//   // Focus next input on key press
//   const handleChange = (text, index) => {
//     const newOtp = [...otp];
//     newOtp[index] = text;    
//        if (text.length === 1 && index < 3) {
//       inputs.current[index + 1]?.focus();
//     }
//   };

//   // Handle resend OTP
//   const handleResend = () => {
//     setTimeLeft(30);
//     setIsResendEnabled(false);
//     // In real app: call API to resend OTP
//     Alert.alert('OTP Resent', `New OTP sent to +91 ${mobile}`);
//   };

//   // Validate and proceed
//   const handleSubmit = () => {
//     const otpString = otp.join('');
//     if (otpString.length !== 4) {
//       Alert.alert('Invalid OTP', 'Please enter all 4 digits.');
//       return;
//     }

//     // Simulate successful login
//     Alert.alert('Login Successful!', 'Welcome to Daksh!');
//     navigation.replace('Dashboard'); // Replace with your actual home screen
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <View style={styles.container}>
//       {/* Top Branch Image */}
//       <Image
//         source={background_enter_otp} // Update path as needed
//         style={styles.branch}

//       />

//       {/* Main Content */}
//       <View style={styles.content}>
//         <Text style={styles.title}>ओ.टी.पी. डाले</Text>
//         <Text style={styles.subtitle}>
//           आपके मोबाइल नंबर पर प्राप्त 4 अंको का ओ.टी.पी. डाले 
//           मोबाइल नंबर {mobile}
//         </Text>
//         {/* <Text style={styles.mobileText}></Text> */}

//         {/* OTP Input Boxes */}
//         <View style={styles.otpContainer}>
//           {otp.map((digit, index) => (
//             <TextInput
//               key={index}
//               ref={(ref) => (inputs.current[index] = ref)}
//               style={styles.otpBox}
//               value={digit}
//               onChangeText={(text) => handleChange(text, index)}
//               keyboardType="numeric"
//               maxLength={1}
//               textAlign="center"
//               autoFocus={index === 0}
//             />
//           ))}
//         </View>

//         {/* Timer */}
//         <Text style={styles.timerText}>
//           एंटर कोड इन: {formatTime(timeLeft)}
//         </Text>

//         {/* Resend Button */}
//         <TouchableOpacity
//           style={[styles.resendButton, !isResendEnabled && styles.disabledButton]}
//           disabled={!isResendEnabled}
//           onPress={handleResend}
//         >
//           <Text style={[styles.resendText, !isResendEnabled && styles.disabledText]}>
//             फिर से भेजे
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Bottom Hills */}
//       {/* <Image
//         source={background_enter_otp} // Update path as needed
//         style={styles.hills}
//         resizeMode="stretch"
//       /> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'red',
//     width:"100%"
//   },
//   branch: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: "100%",
//     width: "100%",
//     resizeMode:"cover"

//     // zIndex: 1,
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 30,
//     marginTop: 50,
//     marginBottom: 100,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   mobileText: {
//     fontSize: 18,
//     fontWeight: '500',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   otpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     marginBottom: 30,
//   },
//   otpBox: {
//     width: 60,
//     height: 60,
//     // borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 10,
//     fontSize: 24,
//     textAlign: 'center',
//     backgroundColor: '#f0f9e8',
//     // paddingVertical:10,
//     marginHorizontal:6
//   },
//   timerText: {
//     fontSize: 16,
//     color: '#888',
//     marginBottom: 20,
//   },
//   resendButton: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 20,
//     backgroundColor: '#FF6B6B',
//   },
//   disabledButton: {
//     backgroundColor: '#cccccc',
//   },
//   resendText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   disabledText: {
//     color: '#666',
//   },
//   hills: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 120,
//     zIndex: 1,
//   },
// });

// export default OTPScreen;


// src/screens/OTPScreen.js
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
import { background_enter_otp } from '../Assets/index.js';

const OTPScreen = ({ navigation, route }) => {
  const { mobile, user, token } = route.params || {}; // Get mobile from Login screen

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
    // In real app: call API to verify OTP
    // API.verifyOTP(mobile, otpString).then(response => {
    //   if (response.success) {
    //     navigation.replace('Dashboard');
    //   } else {
    //     Alert.alert('Invalid OTP', 'Please try again.');
    //   }
    // });

    // Simulate success after 1 second
    setTimeout(() => {
      Alert.alert('Success', 'OTP Verified! Redirecting...');
      navigation.replace('Dashboard');
    });
  };

  // Handle resend OTP
  const handleResend = () => {
    setTimeLeft(30);
    setIsResendEnabled(false);
    setOtp(['', '', '', '']); // Clear OTP fields
    inputs.current[0]?.focus(); // Focus first input
    // Alert.alert('OTP Resent', `New OTP sent to +91 ${mobile}`);
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
                  <Text >मोबाइल नंबर {mobile}</Text>

        </Text>
        {/* <Text style={styles.mobileText}>मोबाइल नंबर {mobile}</Text> */}

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
      backgroundColor: 'rgba(255,0,0,0.3)',
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
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  mobileText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 30,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
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
        marginHorizontal:6

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
    backgroundColor: '#FF6B6B',
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