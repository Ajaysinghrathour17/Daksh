import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '../Constants/Color';

// Use the same date formatter
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
}

const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value || 'N/A'}</Text>
    </View>
  );

const ViewDetailsModal = ({ visible, onClose, item }) => {
    if (!item) return null; // Don't render if no item is selected

    const fullName = [item.FirstName, item.MiddleName, item.LastName].filter(Boolean).join(' ');
    const fullAddress = [item.FullAddress, item.AddressGram, item.AddressMandal, item.AddressKhand, item.AddressJila, item.AddressVibhag, item.PinCode].filter(Boolean).join(', ');
    const starLevel = [item.SamparkSuchiSthar, item.shakhaname, item.subCategory, item.Category].filter(Boolean).join(' - ');


  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <Text style={styles.modalTitle}>संपर्कित व्यक्ति की जानकारी</Text>
            <ScrollView style={{width: '100%'}}>
                <DetailRow label="पूरा नाम" value={fullName} />
                <DetailRow label="मोबाइल नंबर" value={item.number} />
                <DetailRow label="ईमेल" value={item.Email} />
                <DetailRow label="श्रेणी वर्गीकरण" value={item.ShrediVargikaran} />
                <DetailRow label="उपश्रेणी" value={item.UpShrediVargikaran} />
                <DetailRow label="संपर्क स्तर" value={starLevel} />
                <DetailRow label="पूरा पता" value={fullAddress} />
                <DetailRow label="अंतिम संपर्क" value={formatDate(item.lastDate)} />
            </ScrollView>
          <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalView: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: Colors.bg_safron,
      },
      detailRow: {
        flexDirection: 'row',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
      },
      detailLabel: {
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
      },
      detailValue: {
        color: '#555',
        flex: 2,
      },
      button: {
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        marginTop: 15,
      },
      closeButton: {
        backgroundColor: '#6c757d',
        width: '100%',
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
});

export default ViewDetailsModal;