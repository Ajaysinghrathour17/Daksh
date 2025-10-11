// src/Screens/Dashboard.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    logo_dashboard_daksh, menuIcon, hundred,
    samajik_samarsata,
    department_icon,
    permission,
    change,
    logout, institution, add, person,
    sampark_icon, sampark_divas_icon
} from '../Assets';
import Colors from '../Constants/Color';
import Tile from '../Components/Tile';

const Dashboard = () => {
    const navigation = useNavigation();

    // Handle click on image
    const handleImagePress = () => {
        Alert.alert(
            "अपडेट",
            "कार्य चल रहा है", // Hindi message as requested
            [{ text: "ठीक है", style: "default" }]
        );
    };

    return (
        <SafeAreaView style={{backgroundColor:Colors.bg_safron, height:"100%"}}>
            <ScrollView>
                <View style={styles.container}>
                    {/* Hamburger Menu Button */}
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => navigation.openDrawer()}
                    >
                        {/* <Text style={styles.menuIcon}>☰</Text> */}
                        <Image
                            source={menuIcon}
                            style={styles.menuIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Logo at Top */}
                    <View style={styles.logoContainer}>
                        <Image source={logo_dashboard_daksh} style={styles.logo} resizeMode="contain" />
                        <Text style={styles.title}>जयपुर प्रांत</Text>
                    </View>

                    {/* <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={handleImagePress}>
                            <Image
                                source={hundred}
                                style={styles.hundredImage}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    </View> */}

                    {/*  inside container*/}
                    <View style={{ backgroundColor: 'white', borderRadius: 20, margin: 20 }}>

                        {/* <TouchableOpacity >

                            < Image
                                source={hundred}
                                //   resizeMethod='auto' 
                                resizeMode='cover'
                            />

                        </TouchableOpacity> */}

                        {/* Fixed Image Container */}
                        <View style={styles.imageContainer}>
                            <TouchableOpacity onPress={handleImagePress}>
                                <Image
                                    source={hundred}
                                    style={styles.hundredImage}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>▶ प्रलेखन भेजने हेतु यहाँ क्लिक करें ▶</Text>
                            </TouchableOpacity> */}
                        </View>

                        {/* Main Content */}

                        <View style={styles.content}>
                            {/*  */}
                            <Text style={styles.sectionTitle}>संपर्क विभाग</Text>

                            <View style={styles.grid}>
                                {[
                                    // { icon: sampark_icon, label: 'संपर्क', screen: 'GeographicStructure' },
                                    { icon: sampark_divas_icon, label: 'संपर्क सूची जोड़ें', screen: 'samparkList' },
                                ].map((item, index) => (
                                    <Tile
                                        key={index}
                                        icon={item.icon}
                                        label={item.label}
                                        onPress={() => navigation.navigate(item.screen)}
                                        tileWidth="48%" // 2 columns
                                    />
                                ))}
                            </View>

                            {/* Report Section */}
                            {/* <Text style={styles.sectionTitle}>रिपोर्ट सम्बंधित विकल्प</Text>
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
                            </View> */}

                        </View>

                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:Colors.bg_safron,
        paddingTop: 20,
    },
    menuButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    menuIcon: {
        height: 22,
        width: 22,
        tintColor: Colors.white,
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    logo: {
        width: 60,
        height: 60,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    },

    // ✅ New: Fixed image container
    imageContainer: {
        marginHorizontal: 0,
        marginVertical: 0,
        // borderRadius: 20,
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    hundredImage: {
        width: '100%',
        height: 200, // Adjust as needed
        borderRadius: 0,
    },

    content: {
        paddingHorizontal: 16,
        marginVertical: 20,
        backgroundColor: Colors.gray,
    },
    sectionTitle: {
        color: "black",
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: Colors.bg_safron,
        borderRadius: 30,
    },
    gridItem: {
        width: '48%',
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 40,
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
    button: {
        backgroundColor: 'white',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginBottom: 0,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
});

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#FF7A3D',
//         paddingTop: 20,
//         height: "100%"
//     },
//     menuButton: {
//         position: 'absolute',
//         top: 40,
//         left: 20,
//         zIndex: 10,
//     },
//     menuIcon: {
//         // fontSize: 20,
//         marginRight: 15,
//         color: Colors.bg_safron,
//         height: 22,
//         width: 22,
//         // backgroundColor:Colors.bg_safron
//     },
//     logoContainer: {
//         alignItems: 'center',
//         marginVertical: 10,
//     },
//     logo: {
//         width: 60,
//         height: 60,
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: 'white',
//         marginTop: 10,
//     },
//     content: {
//         paddingHorizontal: 16,
//         marginVertical: 20,
//         backgroundColor: Colors.gray,
//         // borderWidth: 1,
//         // borderColor: 'red'

//     },
//     sectionTitle: {
//         color: "black",
//         fontSize: 16,
//         fontWeight: 'bold',
//         marginVertical: 4,
//         // textAlign: 'center',
//     },
//     subTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: 'white',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     button: {
//         backgroundColor: 'white',
//         borderRadius: 25,
//         paddingVertical: 10,
//         paddingHorizontal: 15,
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     buttonText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#FF6B6B',
//     },
//     grid: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         justifyContent: 'space-between',
//         marginBottom: 20,
//         borderWidth: 2,
//         borderColor: Colors.bg_safron,
//         borderRadius: 30
//     },
//     gridItem: {
//         width: '48%',
//         backgroundColor: 'rgba(255,255,255,0.9)',
//         borderRadius: 40,
//         padding: 10,
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     gridIcon: {
//         fontSize: 24,
//         marginBottom: 5,
//     },
//     gridLabel: {
//         fontSize: 12,
//         textAlign: 'center',
//     },
// });
export default Dashboard;




{/* कार्य विभाग */ }
{/* <View style={{ flexDirection: 'row', justifyContent: 'space-around', textAlign: 'right' }} >
       
       
       
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', textAlign: 'right' }} >
            <Text style={styles.sectionTitle}>कार्य विभाग</Text>
            <View>
                <Image
                    source={department_icon}
                    style={styles.menuIcon}
                    resizeMode='contain'
                />
            </View>
        </View>
        <View>
            <Text style={styles.sectionTitle}> गतिविधि</Text>
        </View>
    </View> */}