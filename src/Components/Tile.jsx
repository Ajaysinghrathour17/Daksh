// src/components/Tile.js
import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

const Tile = ({ 
  icon,           // Can be string (emoji) OR require('./icon.png')
  label, 
  onPress, 
  tileWidth = '48%',  // Default for 2-column grid
}) => {
//   const isImageIcon = typeof icon === 'object' && icon.uri !== undefined;

  return (
    <TouchableOpacity 
      style={[styles.tile, { width: tileWidth }]} 
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
          <Image source={icon} style={styles.imageIcon} resizeMode="contain" />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#FF6B3D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  imageIcon: {
    width: 45,
    height: 45,
    tintColor: 'white', // Optional: for PNG icons
  },
  textIcon: {
    fontSize: 24,
    color: 'white',
  },
  label: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
});

export default Tile;