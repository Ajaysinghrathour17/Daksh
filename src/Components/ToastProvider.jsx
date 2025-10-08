// src/components/ToastProvider.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { setToastInstance } from '../utils/ToastUtil';

const ToastProvider = ({ children }) => {
  const [toastConfig, setToastConfig] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const showToast = useCallback((message, type = 'info', duration = 1000) => {
    setToastConfig({ message, type, duration });

    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto close after duration
    setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setToastConfig(null);
      });
    }, duration);
  }, [opacity]);

  // Register the toast API globally so ToastUtil can call it
  useEffect(() => {
    // expose only the showToast function
    setToastInstance({ showToast });
    return () => setToastInstance(null);
  }, [showToast]);

  // Background color mapping
  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return '#4CAF50'; // Green
      case 'error':
        return '#F44336'; // Red
      case 'info':
      default:
        return '#3F51B5'; // Blue
    }
  };

  // Icon mapping
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {children}

      {/* Use your Toast component */}
      {toastConfig && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              backgroundColor: getBackgroundColor(toastConfig.type),
              opacity: opacity,
            },
          ]}
        >
          <View style={styles.iconWrapper}>
            <Text style={styles.icon}>
              {getIcon(toastConfig.type)}
            </Text>
          </View>
          <Text style={styles.message}>
            {toastConfig.message}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: "30%",
    left: 20,
    right: 20,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 9999,
  },
  iconWrapper: {
    marginRight: 8,
  },
  icon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default ToastProvider;