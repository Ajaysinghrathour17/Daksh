// src/components/Toast.js
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';

const Toast = ({ message, type = 'info', duration = 800, onClose }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();

    // Auto close after duration
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (onClose) onClose();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [opacity, duration, onClose]);

  // Icon mapping
  const getIcon = () => {
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

  // Background color mapping
  const getBackgroundColor = () => {
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

  // Text color
  const textColor = '#FFFFFF';

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          backgroundColor: getBackgroundColor(),
          opacity: opacity,
        },
      ]}
    >
      <View style={styles.iconWrapper}>
        <Text style={[styles.icon, { color: textColor }]}>
          {getIcon()}
        </Text>
      </View>
      <Text style={[styles.message, { color: textColor }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60,
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
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Toast;