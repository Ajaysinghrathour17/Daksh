// src/navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { logo_dashboard_daksh } from '../Assets';

import ProfileScreen from '../Screens/ProfileScreen.jsx';
import AddOrgScreen from '../Screens/AddOrgScreen.jsx';
import PermissionScreen from '../Screens/PermissionScreen.jsx';
import ChangePasswordScreen from '../Screens/ChangePasswordScreen.jsx';
import CreateGroupScreen from '../Screens/CreateGroupScreen.jsx';
import CreateBankScreen from '../Screens/CreateBankScreen.jsx';
import BankReportScreen from '../Screens/BankReportScreen.jsx';
import LogoutScreen from '../Screens/LogoutScreen.jsx';

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ navigation }) => {
  return (
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: '#fff',
        width: 300,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="AddOrg" component={AddOrgScreen} />
      <Drawer.Screen name="Permission" component={PermissionScreen} />
      <Drawer.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Drawer.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Drawer.Screen name="CreateBank" component={CreateBankScreen} />
      <Drawer.Screen name="BankReport" component={BankReportScreen} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
};

// Custom Drawer Content (Menu Items)
const CustomDrawerContent = (props) => {
  const { navigation } = props;

  const menuItems = [
    { label: 'प्रोफाइल देखे', icon: 'user', screen: 'Profile' },
    { label: 'सहयोगी संस्था जोड़ें', icon: 'building', screen: 'AddOrg' },
    { label: 'अनुमति प्रदान करे', icon: 'key', screen: 'Permission' },
    { label: 'परिवर्तन करे', icon: 'lock', screen: 'ChangePassword' },
    { label: 'वर्ग बनाएं', icon: 'plus-square', screen: 'CreateGroup' },
    { label: 'बैठक बनाएं', icon: 'plus-square', screen: 'CreateBank' },
    { label: 'बैठक उपस्थिति दर्ज करे', icon: 'calendar', screen: 'BankReport' },
    { label: 'लॉगआउट करें', icon: 'logout', screen: 'Logout' },
  ];

  return (
    <View style={styles.drawerContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={logo_dashboard_daksh} style={styles.logo} resizeMode="contain" />
        <Text style={styles.headerText}>चेतन सैनी</Text>
        <Text style={styles.headerSubText}>+91 9672224446</Text>
      </View>

      {/* Menu Items */}
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate(item.screen);
          }}
        >
          <Text style={styles.menuIcon}>{getIcon(item.icon)}</Text>
          <Text style={styles.menuLabel}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Simple Icon Mapping (you can replace with react-native-vector-icons later)
const getIcon = (iconName) => {
  const icons = {
    user: '👤',
    building: '🏛️',
    key: '🔑',
    lock: '🔒',
    'plus-square': '+',
    calendar: '📅',
    logout: '🚪',
  };
  return icons[iconName] || '📦';
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubText: {
    fontSize: 16,
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
    color: '#FF6B6B',
  },
  menuLabel: {
    fontSize: 16,
    color: '#333',
  },
});

export default DrawerNavigator;