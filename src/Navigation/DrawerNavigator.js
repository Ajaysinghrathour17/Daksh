// src/navigation/DrawerNavigator.js
import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Image, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator , Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    logo_dashboard_daksh, samajik_samarsata,
    department_icon,
    permission,
    change,
    logout, institution, add, person, scanner
} from '../Assets';

import ProfileScreen from '../Screens/ProfileScreen.jsx';
import Dashboard from '../Screens/Dashboard.jsx';
import Colors from '../Constants/Color.js';
import SamparkVyaktiTable from '../Screens/SamparkVyaktiTable.jsx';

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ navigation }) => {
    return (
        <Drawer.Navigator
            drawerStyle={{
                backgroundColor: 'red',
                width: 200,
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{ headerShown: false, }}
        >
            <Drawer.Screen name='Home' component={Dashboard} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
            <Drawer.Screen name="samparkList"  component={SamparkVyaktiTable}/>

        </Drawer.Navigator>
    );
};

// Custom Drawer Content (Menu Items)
const CustomDrawerContent = (props) => {
    const { navigation } = props;
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('userData');
            const token = await AsyncStorage.getItem('token');
            // console.log(token);

            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setUserData(parsedData.user); // Get user object from stored data
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'लॉगआउट',
            'क्या आप एप्लिकेशन से लॉगआउट करना चाहते हैं?',
            [
                {
                    text: 'नहीं',
                    style: 'cancel',
                },
                {
                    text: 'हाँ',
                    onPress: async () => {
                        try {
                            // Clear all user data from AsyncStorage
                            await AsyncStorage.removeItem('userData');
                            await AsyncStorage.removeItem('token');

                            // Navigate to Login screen
                            navigation.closeDrawer();
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (error) {
                            console.error('Error during logout:', error);
                            Alert.alert('त्रुटि', 'लॉगआउट में त्रुटि हुई। कृपया पुनः प्रयास करें।');
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };


    const menuItems = [
        { label: 'प्रोफाइल देखे', icon: permission, screen: 'Profile' },
        { label: 'सहयोगी संस्था जोड़ें', icon: institution, screen: 'AddOrg' },
        { label: 'अनुमति प्रदान करे', icon: permission, screen: 'Permission' },
        { label: 'परिवर्तन करे', icon: change, screen: 'ChangePassword' },
        { label: 'वर्ग बनाएं', icon: add, screen: 'CreateGroup' },
        { label: 'बैठक बनाएं', icon: add, screen: 'CreateBank' },
        { label: 'बैठक उपस्थिति दर्ज करे', icon: scanner, screen: 'BankReport' },
        { label: 'लॉगआउट करें', icon: logout, screen: 'Logout', action: handleLogout },
    ];

    if (loading) {
        return (
            <View style={styles.drawerContainer}>
                <View style={styles.header}>
                    <ActivityIndicator size="large" color={Colors.bg_safron} />
                    <Text style={styles.headerText}>लोड हो रहा है...</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.drawerContainer}>
            {/* Header */}
            <View style={styles.header}>
                {/* <Image source={logo_dashboard_daksh} style={styles.logo} resizeMode="contain" /> */}
                <Text style={styles.headerText}>{userData?.Name || 'User '}</Text>
                <Text style={styles.headerSubText}>+91 {userData?.MobileNumber || '00000'}</Text>
            </View>

            <View style={styles.menuList}>
                {/* Menu Items */}
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => {
                            if(item.action) {
                                item.action(); // Execute logout action
                            } else {
                                navigation.closeDrawer();
                                navigation.navigate(item.screen);
                            }
                        }}
                    >
                        <Image
                            source={item.icon}
                            style={styles.menuIcon}
                            resizeMode='contain'
                        />
                        <Text style={styles.menuLabel}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: Colors.bg_safron,
    },
    header: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        alignItems: 'center',
        backgroundColor: Colors.bg_safron,
        color: Colors.white
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
    },
    headerSubText: {
        fontSize: 16,
        color: Colors.white,
    },
    menuList: {
        backgroundColor: Colors.white,
        flex: 1,
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
        marginRight: 15,
        color: Colors.bg_safron,
        height: 22,
        width: 22,
    },
    menuLabel: {
        fontSize: 16,
        color: '#333',
    },
});

export default DrawerNavigator;