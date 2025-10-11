/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';

import AppNavigator from './src/Navigation/AppNavigator';
import ToastProvider from './src/Components/ToastProvider';

function App() {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
       <View style={styles.container}>
    <ToastProvider >
      <AppNavigator />
    </ToastProvider>
    </View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
