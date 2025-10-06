// src/Screens/Dashboard.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logo_dashboard_daksh } from '../Assets';

const Dashboard = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Hamburger Menu Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      {/* Logo at Top */}
      <View style={styles.logoContainer}>
        <Image source={logo_dashboard_daksh} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>जयपुर प्रांत</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>राष्ट्रीय स्वयंसेवक संघ</Text>
        <Text style={styles.subTitle}>शताब्दी वर्ष</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>▶ प्रलेखन भेजने हेतु यहाँ क्लिक करें ▶</Text>
        </TouchableOpacity>

        {/* Report Section */}
        <Text style={styles.sectionTitle}>रिपोर्ट सम्बंधित विकल्प</Text>
        <View style={styles.grid}>
          {[
            { label: 'कार्यस्थिति', icon: '📊' },
            { label: 'भौगोलिक रचना', icon: '🌐' },
            { label: 'साप्ताहिक बौद्धिक दिवस', icon: '📖' },
            { label: 'साप्ताहिक सेवा दिवस', icon: '📋' },
            { label: 'मासिक सेवा बस्ती सम्पर्क', icon: '📆' },
            { label: 'शाखा वृत', icon: '🚩' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.gridItem}>
              <Text style={styles.gridIcon}>{item.icon}</Text>
              <Text style={styles.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Shakh Section */}
        <Text style={styles.sectionTitle}>शाखा सम्बंधित विकल्प</Text>
        <View style={styles.grid}>
          {[
            { label: 'शाखा वृत', icon: '🚩' },
            { label: 'शाखा द्वारा करणीय', icon: '📍' },
            { label: 'दैनिक उपस्थिति दर्ज करे', icon: '➖➕' },
            { label: 'दैनिक उपस्थिति देखे', icon: '📞' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.gridItem}>
              <Text style={styles.gridIcon}>{item.icon}</Text>
              <Text style={styles.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF7A3D',
    paddingTop: 20,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  menuIcon: {
    fontSize: 24,
    color: 'white',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 15,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  gridIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  gridLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default Dashboard;