// // src/screens/SplashScreen.js
// import React, { useEffect } from 'react';
// import { View, Image, StyleSheet, Animated } from 'react-native';
// import { logo_splash_daksh } from '../Assets';
// import Colors from '../Contants/Color';

// const SplashScreen = ({ navigation }) => {
//   const fadeAnim = new Animated.Value(0);

//   useEffect(() => {
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 1500,
//       useNativeDriver: true,
//     }).start();

//     // Navigate to Login after 2 seconds
//     const timer = setTimeout(() => {
//       navigation.replace('Login');
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, [navigation, fadeAnim]);

//   return (
//     // <View style={styles.container}>
//     //   <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
//     //     <Image
//     //       source={logo_splash_daksh} // Update path as needed
//     //       style={styles.logo}
//     //       resizeMode="contain"
//     //     />
//     //   </Animated.View>
//     // </View>
//       <View style={styles.container}>
//       <View style={[styles.logoContainer]}>
//         <Image
//           source={logo_splash_daksh} // Update path as needed
//           style={styles.logo}
//           resizeMode="contain"
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.purple_700  , //'#F87134', // Orange background as per screenshot
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logoContainer: {
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   logo: {
//     width: '100%',
//     height: '100%',
//   },
// });

// export default SplashScreen;

// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { logo_splash_daksh } from '../Assets'; // Ensure this path is correct
import Colors from '../Constants/Color';

const SplashScreen = () => {
  // // Navigate to Login immediately after render (or after a tiny delay if needed)
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigation.replace('Login');
  //   }, 200); // 100ms delay for UI to render — optional, can be 0

  //   return () => clearTimeout(timer);
  // }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={logo_splash_daksh}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg_safron, // Or use '#F87134' if you want orange
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 200,
    height: 200,
    // borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});

export default SplashScreen;