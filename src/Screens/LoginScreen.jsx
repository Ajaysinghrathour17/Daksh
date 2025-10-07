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
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logo_dashboard_daksh, hand_hold_plant } from '../Assets/index.js';
import Colors from '../Constants/Color.js';
import { showInfoToast, showErrorToast, showSuccessToast } from '../utils/ToastUtil.js';

const LoginScreen = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!mobile || mobile.length !== 10) {
      showInfoToast('कृपया सही मोबाइल नंबर डालें');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Get access token
      const tokenResponse = await fetch('https://loadcrm.com/plantingnewapis/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `userName=${mobile}&grant_type=password`,
      });

      if (!tokenResponse.ok) {
        throw new Error(`Token request failed: ${tokenResponse.status}`);
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.access_token) {
        throw new Error('Invalid token response - no access_token');
      }

      // Step 2: Get user details (using POST as confirmed)
      const userResponse = await fetch('https://loadcrm.com/plantingnewapis/api/LogIn/GetUserDetailProfile', {
        method: 'POST', // Confirmed: using POST as per your API
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}) // Empty body for POST
      });

      if (!userResponse.ok) {
        throw new Error(`User details request failed: ${userResponse.status}`);
      }

      const userData = await userResponse.json();

      if (userData.Item1 !== "Success" || !userData.Item2 || userData.Item2.length === 0) {
        throw new Error('Invalid user data - no success or empty array');
      }

      const user = userData.Item2[0];

      // Store user data and token in AsyncStorage
      const userDataToStore = {
        user: user,
        token: tokenData.access_token,
        mobile: mobile,
        loginTime: new Date().toISOString(), // Timestamp for reference
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(userDataToStore));
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', JSON.stringify(tokenData.access_token));

      // Log for debugging
      console.log('User data stored in AsyncStorage:', userDataToStore);

      // Show success toast
      showSuccessToast('लॉगिन सफल! OTP सेंड किया जा रहा है...');

      // Navigate to OTP screen with user data
      navigation.navigate('OTPVerification', {
        mobile: mobile,
        user: user,
        token: tokenData.access_token,
      });

    } catch (error) {
      console.error('Login error:', error);
      showErrorToast('लॉगिन असफल! कृपया फिर से प्रयास करें');
    } finally {
      setLoading(false);
    }
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
          maxLength={10}
          editable={!loading}
        />
      </View>

      {/* Send OTP Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSendOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>ओ.टी.पी. सेंड करें</Text>
        )}
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
    backgroundColor: Colors.bg_safron,
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
    marginBottom: 20,
    alignItems: 'center',
    borderColor: Colors.grey_40,
    borderWidth: 1,
  },
  countryCode: {
    fontSize: 16,
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
  },
  plant: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
});

export default LoginScreen;



// // add here - on number enter -https://loadcrm.com/plantingnewapis/token  data sent in Body -x-www-form-urlencoded - userName-number , grant_type-password as string then  {
//     "access_token": "84c0Ttle5wNXjUjkTBhMhv87D7SafQ-JhbB56VcMoyZi2Jx7eaIyHHy2kCkp8f5vx2ghmNd-rqafP534_HoWI6Iac3DMwulr_S9zzg6q43wOnm4mfvKJu0BPXfpAkQOrQv_DUjpAR_QymReV1Ks_wsAH0Vgs9HgwgkEZzc9wAm5fMMxxQ_hqceYUt9AgPT7_Nss4qkM40Ajar-SNskHA02IWf_1gOGuQYnQiuDQAlzP2N7GV1JnKJfyIOyDTzu3r-li1JK5k1LrSufRwQHKwbg",
//     "token_type": "bearer",
//     "expires_in": 864998
// }  this if 200 then hit and get user data  https://loadcrm.com/plantingnewapis/api/LogIn/GetUserDetailProfile  otherwise show error show . if here 200 then get data and store and will go on otp screen then static otp verifies then goes to dashboard  -{
//     "Item1": "Success",
//     "Item2": [
//         {
//             "Id": "72aee7b0-78d4-4cc1-8b1b-2a7c6a32e830",
//             "Name": "चेतन सैनी",
//             "MobileNumber": "9672224446",
//             "createDate": "2024-06-24T12:19:36.613",
//             "EmailId": "raj@gmail.com",
//             "Position": "Prant",
//             "PositionName": "जयपुर",
//             "Mandle": "",
//             "KaryaKrtaview": "Yes",
//             "KaryaKrtaExcelDownload": "Yes",
//             "MukhiyaView": "Yes",
//             "MukhiyaExcelDownload": "Yes",
//             "EditMukhiya": "Yes",
//             "EditKaryaKrta": "Yes",
//             "UperPosition": "Prant",
//             "UperPositionName": "जयपुर",
//             "MandalCode": "",
//             "Pratigit": "Yes",
//             "Ghosh": "वंशी,त्रिकोण,त्रिभुज,पणव",
//             "Prant": "जयपुर",
//             "Vibhag": "",
//             "Jila": "",
//             "MemberAddPermission": "Yes",
//             "khand": "",
//             "Vyavshyay": "कलाकार-अभिनेता/लेखक/संगीतकार (Artist/Actor/Writer/Musician)",
//             "DateOfBirth": "1995-03-08T00:00:00",
//             "SanghShikshak": "कोई नहीं",
//             "ShikshakYear": "",
//             "DaitavKabSe": "Aug-2020",
//             "BaithakPermission": "Yes",
//             "ProfileImage": "https://loadcrm.online//plantingnewapis/UploadedFiles/IMG_20250917_185634_1456729193154582820.jpg",
//             "Daitav": "सदस्य (आई टी प्रमुख)",
//             "UpdateAddSangPermission": "Yes",
//             "Anumati": "Yes",
//             "Address": "hhh,देवता,बनेठी,नारेड़ा,कोटपूतली,अलवर,302019",
//             "ProfileComplete": "Yes",
//             "shakhaid": "",
//             "shakha": "No",
//             "GeoFancingPermission": "Yes",
//             "AlternateMobileNumber": "9783954089",
//             "Pura_Vyavshyay": "vhzgz",
//             "MandalPalakMandal": "मेड",
//             "MandalPalakMandalCode": "JYP0301G0107",
//             "MandalPalakShreni": "संगठन श्रेणी",
//             "BloodGroup": "ए नेगेटिव(A-)",
//             "PathyKhandPermission": "No",
//             "PrahaarDivasValidity": "No",
//             "SahityaBikriValidity": "No",
//             "PathyKadValidity": "No",
//             "SamparkDivas": "No",
//             "PanchjanyaPermission": "Yes",
//             "PanchjanyaOrgvalidity": "No",
//             "PrathmikShikhaVergValidity": "Yes",
//             "PrathmikShikhaVergPermission": "Yes",
//             "AbhyaasVargPermission": "Yes",
//             "AbhyaasVargValidity": "Yes",
//             "VargPermission": "Yes",
//             "Ganvesh": "कोई नहीं",
//             "vijayDashmi": "Yes",
//             "jaagranToli": "Yes",
//             "shakhaLakshya": "Yes",
//             "PlaceName": ""
//         }
//     ]
// }