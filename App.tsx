/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import Colors from './src/Constants/Color';
import LoginScreen from './src/Screens/LoginScreen';
import AppNavigator from './src/Navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToastProvider from './src/Components/ToastProvider';

function App() {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    // <AppNavigator />
    // <GestureHandlerRootView style={{ flex: 1 }}>
          <ToastProvider > 
      <AppNavigator />
  </ToastProvider>
    // </GestureHandlerRootView>
    // <View style={styles.container}>
    //   {/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> */}
    //   <StatusBar barStyle={  'light-content'} backgroundColor={Colors.purple_500} />
    //   {/* <NewAppScreen templateFileName="App.tsx" /> */}
    //   <LoginScreen  />
      
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
