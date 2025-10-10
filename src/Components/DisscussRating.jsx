import React, { useState } from 'react';
import {
  Text,
  View,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

const DiscussionRatingPicker = ({ formData, handleInputChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const options = [
    { label: 'सकारात्मक', value: 'सकारात्मक' },
    { label: 'नकारात्मक', value: 'नकारात्मक' },
    { label: 'आलोचनात्मक', value: 'आलोचनात्मक' },
    { label: 'उदासीन', value: 'उदासीन' },
  ];

  const selectedLabel =
    options.find(opt => opt.value === formData.discussionRating)?.label ||
    'चर्चा कैसी रही';

  return (
    <>
      <Text style={styles.label}>* चर्चा कैसी रही</Text>
      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.pickerText}>
          {selectedLabel}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>चर्चा कैसी रही</Text>
              <View style={{ width: 60 }} /> {/* Spacer for alignment */}
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    handleInputChange('discussionRating', item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      formData.discussionRating === item.value && styles.selectedOption,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  optionText: {
    fontSize: 17,
    color: '#333',
  },
  selectedOption: {
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default DiscussionRatingPicker;