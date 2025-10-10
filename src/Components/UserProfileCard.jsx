import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../Constants/Color';



const InfoBlock = ({ label, value }) => {
    // If there's no value, you might want to render a placeholder or nothing at all
    const displayValue = value || ' ';

    return (
        <View style={styles.infoBlock}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{displayValue}</Text>
        </View>
    );
};

const UserProfileCard = ({ user }) => {
    // Constructing complex fields from the user data object
    const contactLevel = user.SamparkSuchiSthar && user.shakhaname ?
        `${user.SamparkSuchiSthar} - ${user.shakhaname}, ${user.subCategory} ${user.Category}` :
        '';

    const professionDetails = user.VyavsayCategory && user.VyavsayVivran ?
        `${user.VyavsayCategory} - ${user.VyavsayVivran}` :
        '';

    const fullAddress = [
        user.AddressJila,
        user.AddressGram,
        user.AddressMandal,
        user.AddressKhand,
        user.vibhag,
        user.PinCode
    ].filter(Boolean).join(', ');

    return (
        <View style={styles.card}>
            <Text style={styles.title}>व्यक्तिगत जानकारी</Text>

            {/* --- Two-Column Rows --- */}
            <View style={styles.row}>
                <InfoBlock label="सम्पर्कित महानुभाव का प्रथम नाम" value={user.FirstName} />
                <InfoBlock label="सम्पर्कित महानुभाव का उपनाम" value={user.LastName} />
            </View>

            <View style={styles.row}>
                <InfoBlock label="सम्पर्कित महानुभाव का कुलनाम" value={user.MiddleName} />
                <InfoBlock label="नंबर" value={user.number} />
            </View>

            <View style={styles.row}>
                <InfoBlock label="ईमेल" value={user.Email} />
                <InfoBlock label="संपर्क सूची का स्तर" value={contactLevel} />
            </View>

            <View style={styles.row}>
                <InfoBlock label="श्रेणी वर्गीकरण" value={user.ShrediVargikaran} />
                <InfoBlock label="उपश्रेणी वर्गीकरण" value={user.UpShrediVargikaran} />
            </View>

            {/* --- Full-Width Rows --- */}
            <InfoBlock label="महानुभाव का परिचय (अभिरुचि सहित)" value={user.Introduction} />
            <InfoBlock label="महानुभाव के व्यवसाय/कार्य क्षेत्र का विवरण" value={professionDetails} />
            <InfoBlock label="विशेष योग्यता" value={user.ViseshYogyata} />
            <InfoBlock label="पता पिन कोड सहित" value={fullAddress} />
        </View>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.grey2,
        borderRadius: 20,
        padding: 16,
        margin: 0,
        width:'100%'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        // color: Colors.primaryText,
        marginBottom: 6,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    infoBlock: {
        flex: 1, // Each block takes up equal space in a row
    },
    label: {
        fontSize: 14,
        color: Colors.primaryText,
        fontWeight: '700',
        marginBottom: 2,
    },
    value: {
        fontSize: 14,
        color: Colors.secondaryText,
                marginBottom: 4,

    },
});

export default UserProfileCard;