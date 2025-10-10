// src/navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from '../Screens/SplashScreen.jsx';
import LoginScreen from '../Screens/LoginScreen.jsx';
import OTPScreen from '../Screens/OTPScreen.jsx';
import Dashboard from '../Screens/Dashboard.jsx';
import ProfileScreen from '../Screens/ProfileScreen.jsx';
import DrawerNavigator from './DrawerNavigator.js';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(''); // Default to Splash
  const [isChecking, setIsChecking] = useState(true);
   
  useEffect(() => {
    checkUserData();
  }, []);

  const checkUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
        // console.log(userData)
        // console.log(userData.length)
        console.log("intial route", initialRoute);
        

      if (userData) {
        // User data exists, go to Dashboard
      setInitialRoute('Dashboard');
      console.log("intial route change dash", initialRoute);
      } else {
        // No user data, go to Login
        setInitialRoute('Login');
        console.log("intial route change Login", initialRoute);
      }
    } catch (error) {
      console.error('Error checking user data:', error);
      // If there's an error, default to Login
      setInitialRoute('Login');
      console.log("intial route change", initialRoute);
    } finally {
      setIsChecking(false); // Hide splash after check is complete
    }
  };
  
  
  if (!initialRoute) {
    return <SplashScreen />;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute} // Set based on user data check
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Only show Splash if we're still checking */}
        {/* {isChecking && (
          <Stack.Screen name="Splash" component={SplashScreen} />
        )} */}
        
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTPVerification" component={OTPScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        
        {/* Wrap Dashboard with DrawerNavigator */}
        <Stack.Screen
          name="Dashboard"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

// // src/navigation/AppNavigator.js
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import SplashScreen from '../Screens/SplashScreen.jsx';
// import LoginScreen from '../Screens/LoginScreen.jsx';
// import OTPScreen from '../Screens/OTPScreen.jsx';
// import Dashboard from '../Screens/Dashboard.jsx';
// import ProfileScreen from '../Screens/ProfileScreen.jsx';
// import DrawerNavigator from './DrawerNavigator.js';

// const Stack = createStackNavigator();

// const AppNavigator = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Splash"
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         <Stack.Screen name="Splash" component={SplashScreen} />
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="OTPVerification" component={OTPScreen}  />
//         <Stack.Screen name="Profile" component={ProfileScreen} />
//         {/* <Stack.Screen name='Dashboard' component={Dashboard} /> */}
//         {/* 👇 Wrap Dashboard with DrawerNavigator */}
//         <Stack.Screen
//           name="Dashboard"
//           component={DrawerNavigator}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;