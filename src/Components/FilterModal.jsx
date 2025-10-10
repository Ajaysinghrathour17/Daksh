// import React, { useState } from 'react';
// import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
// import Colors from '../Constants/Color';

// // //
// // श्रेणी वर्गीकरण : - सामाजिक नेतृत्व ,धार्मिक, आर्थिक,प्रशासनिक अधिकारी, न्यायिक,चिकित्सा, प्रबुद्ध नागरिक ,कला,क्रीड़ा,वैज्ञानिक
// // //  levelListF.add("स्तर चुने");
// //               स्तर चुने :- अखिल भारती, प्रांत स्तर, विभाग स्तर, जिला स्तर,सभी स्तर
//                 "
// 3) {"कोई भी एक विकल्प चुने","सभी विभाग","विभाग चुने"};
// //  String[] items = {"कोई भी एक विकल्प चुने","सभी जिला","जिला चुने"};



// const FilterModal = ({ visible, onClose, onApplyFilters }) => {
//   // Use temporary state for filters within the modal
//   const [sthar, setSthar] = useState('All');
//   const [sthan, setSthan] = useState('');
//   const [shredi, setShredi] = useState('चिकित्सा');

//   const handleApply = () => {
//     // Pass the selected filters back to the main screen
//     onApplyFilters({
//       Sthar: sthar,
//       Sthan: sthan,
//       Shredi: shredi,
//     });
//   };

//   return (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={visible}
//       onRequestClose={onClose}>
//       <View style={styles.centeredView}>
//         <View style={styles.modalView}>
//           <Text style={styles.modalTitle}>Filter Sampark Suchi</Text>

//           {/* <Text style={styles.label}>स्तर (Sthar)</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g., All, प्रांत स्तर"
//             value={sthar}
//             onChangeText={setSthar}
//           /> */}

//           <Text style={styles.label}>स्थान (Sthan)</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g., Jaipur"
//             value={sthan}
//             onChangeText={setSthan}
//           />

//           <Text style={styles.label}>श्रेणी (Shredi)</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="e.g., सामाजिक नेतृत्व"
//             value={shredi}
//             onChangeText={setShredi}
//           />

//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
//               <Text style={styles.buttonText}>Close</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={handleApply}>
//               <Text style={styles.buttonText}>Apply</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//     centeredView: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//       },
//       modalView: {
//         width: '85%',
//         backgroundColor: 'white',
//         borderRadius: 10,
//         padding: 20,
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//       },
//       modalTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 15,
//       },
//       label: {
//         alignSelf: 'flex-start',
//         marginLeft: 10,
//         marginBottom: 5,
//         fontWeight: '500',
//       },
//       input: {
//         width: '100%',
//         height: 40,
//         borderColor: 'gray',
//         borderWidth: 1,
//         borderRadius: 5,
//         marginBottom: 15,
//         paddingHorizontal: 10,
//       },
//       buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '100%',
//       },
//       button: {
//         borderRadius: 5,
//         padding: 10,
//         elevation: 2,
//         width: '48%',
//       },
//       applyButton: {
//         backgroundColor: Colors.bg_safron,
//       },
//       closeButton: {
//         backgroundColor: '#6c757d',
//       },
//       buttonText: {
//         color: 'white',
//         fontWeight: 'bold',
//         textAlign: 'center',
//       },
// });

// export default FilterModal;

import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
// --- NEW: Import DropDownPicker ---
import DropDownPicker from 'react-native-dropdown-picker';

import Colors from '../Constants/Color';

const shrediOptions = [
  { label: 'श्रेणी वर्गीकरण चुने', value: null },
  { label: 'सामाजिक नेतृत्व', value: 'सामाजिक नेतृत्व' },
  { label: 'धार्मिक', value: 'धार्मिक' },
  { label: 'आर्थिक', value: 'आर्थिक' },
  { label: 'प्रशासनिक अधिकारी', value: 'प्रशासनिक अधिकारी' },
  { label: 'न्यायिक', value: 'न्यायिक' },
  { label: 'चिकित्सा', value: 'चिकित्सा' },
  { label: 'प्रबुद्ध नागरिक', value: 'प्रबुद्ध नागरिक' },
  { label: 'कला', value: 'कला' },
  { label: 'क्रीड़ा', value: 'क्रीड़ा' },
  { label: 'वैज्ञानिक', value: 'वैज्ञानिक' },
];

const stharOptions = [
  { label: 'स्तर चुने', value: '' },
  { label: 'अखिल भारती', value: '' },
  { label: 'प्रांत स्तर', value: '' },
  { label: 'विभाग स्तर', value: '' },
  { label: 'जिला स्तर', value: '' },
  { label: 'सभी स्तर', value: '' },

];
//  स्तर चुने :- अखिल भारती, प्रांत स्तर, विभाग स्तर, जिला स्तर,सभी स्तर

const FilterModal = ({ visible, onClose, onApplyFilters }) => {
  const [sthar, setSthar] = useState('All');
  const [sthan, setSthan] = useState('');
  const [shredi, setShredi] = useState(null); // null = placeholder
  const [open, setOpen] = useState(false); // controls dropdown open state

  const handleApply = () => {
    onApplyFilters({
      Sthar: sthar,
      Sthan: sthan,
      Shredi: shredi || '', // null becomes empty string
    });
    // setShredi('')
    // setSthan('')
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Filter Sampark Suchi</Text>

          <Text style={styles.label}>स्तर</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., All, प्रांत स्तर"
            value={sthar}
            onChangeText={setSthar}
          />

          {/* <Text style={styles.label}>स्थान (Sthan)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Jaipur"
            value={sthan}
            onChangeText={setSthan}
          /> */}

          <Text style={styles.label}>श्रेणी वर्गीकरण</Text>
          {/* --- NEW: DropDownPicker --- */}
          <DropDownPicker
            open={open}
            value={shredi}
            items={shrediOptions}
            setOpen={setOpen}
            setValue={setShredi}
            placeholder="श्रेणी वर्गीकरण चुने"
            style={styles.dropdown}
            dropDownContainerStyle={[styles.dropdownContainer,]}
            listItemLabelStyle={styles.dropdownItemText}
            labelStyle={styles.dropdownLabel}
            arrowIconStyle={styles.arrowIcon}
            zIndex={3000} // important for modals
            zIndexInverse={1000}
            translation={{ PLACEHOLDER: 'श्रेणी वर्गीकरण चुने' }}

          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
              <Text style={styles.buttonText}>कैंसिल करे</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={handleApply}>
              <Text style={styles.buttonText}>फिल्टर करे</Text>
            </TouchableOpacity>
          </View>
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
    width: '85%',
    height: "60%",
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
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
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  // --- Dropdown styles ---
  dropdown: {
    width: '100%',
    // height: "100%",
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  dropdownContainer: {
    width: '100%',
    height: "600",
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
    marginTop: 0,
  },
  dropdownLabel: {
    color: '#333',
    fontSize: 16,
  },
  dropdownItemText: {
    color: '#333',
    fontSize: 16,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: '48%',
  },
  applyButton: {
    backgroundColor: Colors.bg_safron,
  },
  closeButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FilterModal;