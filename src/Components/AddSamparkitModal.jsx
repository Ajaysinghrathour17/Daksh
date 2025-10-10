import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../Constants/Color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DAKSH_API } from '../config';
import UserProfileCard from './UserProfileCard';
import { showInfoToast, showErrorToast, showSuccessToast } from '../utils/ToastUtil.js';


// --- Main Component ---
const AddSamparkitModal = ({ visible, onClose, onSave, token }) => {
  // State for the entire form flow
  const [mobileNumber, setMobileNumber] = useState('9131643544');
  const [userStatus, setUserStatus] = useState('unknown');
  const [existingUserData, setExistingUserData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // / New state for contact-level modal & user position
  const [contactLevelModalVisible, setContactLevelModalVisible] = useState(false);
  const [vyasayModalVisible, setVyasayModalVisible] = useState(false);

  // const [levelOptions, setLevelOptions] = useState([]);
  const [currentUserPosition, setCurrentUserPosition] = useState('');

  // States for the logged-in user's context
  const [currentUser, setCurrentUser] = useState(null);
  const [sthanName, setSthanName] = useState('');

  // --- NEW STATE for the Contact Level Modal ---
  const [levelOptions, setLevelOptions] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('स्तर चुने'); // 'sthar' in Java
  const [VyavsayCategoryOptions, setVyavsayCategoryOptions] = useState(["व्यवसाय चुनें"]);
  const [selectedVyavsay, setSelectedVyavsay] = useState('');
  const [vyasayVivranLocal, setVyasayVivranLocal] = useState('');

  // Data options for cascading dropdowns
  const [vibhagOptions, setVibhagOptions] = useState([]);
  const [jilaOptions, setJilaOptions] = useState([]);
  const [khandOptions, setKhandOptions] = useState([]);
  const [mandalOptions, setMandalOptions] = useState([]);
  const [gramOptions, setGramOptions] = useState([]);
  const [shakhaOptions, setShakhaOptions] = useState([]);

  console.log(gramOptions);
  console.log("Shakha option", shakhaOptions);

  // console.log(vibhagOptions);


  // Selected values for cascading dropdowns
  const [selectedVibhag, setSelectedVibhag] = useState('विभाग चुने');
  const [selectedJila, setSelectedJila] = useState('जिला चुने');
  const [selectedKhand, setSelectedKhand] = useState('खंड/नगर चुने');
  const [selectedMandal, setSelectedMandal] = useState('मंडल/बस्ती चुने');
  const [selectedGram, setSelectedGram] = useState('ग्राम चुने');
  const [gramETCode, setGramETCode] = useState('')
  const [selectedShakha, setSelectedShakha] = useState({ id: '', name: 'शाखा चुने' });

  // Loading states for dropdowns
  const [isLoading, setIsLoading] = useState(false);

  const getLevelsForPosition = (position) => {
    const p = (position || '').toLowerCase();
    const base = ['स्तर चुने'];
    if (p === 'prant') {
      return base.concat(['अखिल भारतीय', 'प्रांत स्तर', 'विभाग स्तर', 'जिला स्तर', 'खंड/नगर स्तर', 'शाखा स्तर']);
    } else if (p === 'vibhag') {
      return base.concat(['अखिल भारतीय', 'विभाग स्तर', 'जिला स्तर', 'खंड/नगर स्तर', 'शाखा स्तर']);
    } else if (p === 'jila' || p === 'jila') {
      return base.concat(['अखिल भारतीय', 'जिला स्तर', 'खंड/नगर स्तर', 'शाखा स्तर']);
    } else if (p === 'khand') {
      return base.concat(['अखिल भारतीय', 'खंड/नगर स्तर', 'शाखा स्तर']);
    }
    return base.concat(['अखिल भारतीय', 'शाखा स्तर']);
  };


  // Updated formData to match API parameters more closely
  const [formData, setFormData] = useState({
    FirstName: '',
    MiddleName: '',
    LastName: '',
    Introduction: '',
    Email: '',
    VyavsayCategory: '',
    VyavsayVivran: '',
    ViseshYogyata: '',
    SamparkSuchiSthar: '',
    Place: '',
    ShrediVargikaran: 'श्रेणी वर्गीकरण',
    UpShrediVargikaran: '',
    AddressPrant: '',
    AddressVibhag: '',
    AddressJila: '',
    AddressKhand: '',
    AddressMandal: '',
    AddressGram: '',
    FullAddress: '',
    PinCode: '',
    prant: '',
    vibhag: '',
    jila: '',
    khand: '',
    mandal: '',
    gram: '',
    SamparkDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
    SamparkKarneValeKaryakartaName: '',
    SamparkKarneWaleKaryakartaNumber: '',
    CharchaVivran: '',
    ShahityaBookVivran: '',
    CharchaKaisiRahi: '',
  });

  // This state controls the "Contact Information" section
  const [showContactInfo, setShowContactInfo] = useState(false);

  // Fetch logged-in user's name and number on mount
  useEffect(() => {
    const getUserDetails = async () => {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const user = JSON.parse(userDataString);
        console.log("user in getUserDetails add samparkit modal", user);
        const pos = user?.user?.Position || user?.Position || '';
        // const pos = "Khand"
        console.log(pos);
        setCurrentUser(user?.user)
        console.log(user?.user);

        setCurrentUserPosition(pos);
        setLevelOptions(getLevelsForPosition(pos));
        handleInputChange('SamparkKarneValeKaryakartaName', user.user.Name || '');
        handleInputChange('SamparkKarneWaleKaryakartaNumber', user.user.MobileNumber || '');
      } else {
        setLevelOptions(getLevelsForPosition('')); // default list
      }
    };
    getUserDetails();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // This effect calls the real API to check the mobile number
  useEffect(() => {
    if (mobileNumber.length === 10 && token) {
      const checkNumber = async () => {
        setUserStatus('checking');
        try {
          const details = new URLSearchParams();
          details.append('MobileNo', mobileNumber);

          const response = await fetch(`${DAKSH_API}/api/Gram/GetSamparkVyaktiVyaktigatJankaariUsingMobileNumber`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: details.toString(),
          });

          const result = await response.json();
          console.log("check and return if samparkit vyakti already in database or not", result);


          // The API returns an array in the 'Data' property
          if (response.ok && result.Data && result.Data.length > 0) {
            setExistingUserData(result.Data[0]); // Save the first user found
            setUserStatus('exists');
            setShowContactInfo(true);
          } else {
            setUserStatus('newUser');
          }
        } catch (error) {
          console.error("Error checking mobile number:", error);
          Alert.alert("Error", "Could not verify mobile number.");
          setUserStatus('unknown');
        }
      };
      checkNumber();
    } else {
      setUserStatus('unknown');
      setExistingUserData(null);
      setShowContactInfo(false);
    }
  }, [mobileNumber, token]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (userStatus === 'newUser') {
        // --- Scenario 1: Create a New User ---
        const personPayload = new FormData();
        // Append all required fields for InsertSamparkVyakti
        Object.keys(formData).forEach(key => {
          personPayload.append(key, formData[key]);
        });
        personPayload.append('mobileNo', mobileNumber);

        console.log("Saving new person with payload:", formData);
        const personResponse = await fetch(`${DAKSH_API}/api/Gram/InsertSamparkVyakti`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',

          },
          body: personPayload,
        });

        const personResult = await personResponse.json();
        if (!personResponse.ok || !personResult.Data || personResult.Data.length === 0) {
          throw new Error(personResult.Message || "Failed to create new person.");
        }

        const newUserId = personResult.Data[0].output; // Get the ID of the new user

        // If contact info is also to be added, make the second API call
        if (showContactInfo) {
          await saveContactDetails(newUserId);
        }
      } else if (userStatus === 'exists') {
        // --- Scenario 2: Add Contact Details to Existing User ---
        await saveContactDetails(existingUserData.Id);
      }
      Alert.alert("Success", "Data saved successfully!");
      onSave();
      resetForm();

    } catch (error) {
      console.error("Failed to save data:", error);
      Alert.alert("Error", error.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const saveContactDetails = async (userId) => {
    const detailsPayload = new FormData();
    detailsPayload.append('Id', userId);
    detailsPayload.append('SamparkDate', formData.SamparkDate);
    detailsPayload.append('SamparkKarneValeKaryakartaName', formData.SamparkKarneValeKaryakartaName);
    detailsPayload.append('SamparkKarneWaleKaryakartaNumber', formData.SamparkKarneWaleKaryakartaNumber);
    detailsPayload.append('CharchaVivran', formData.CharchaVivran);
    detailsPayload.append('ShahityaBookVivran', formData.ShahityaBookVivran);
    detailsPayload.append('CharchaKaisiRahi', formData.CharchaKaisiRahi);
    // Add Toli Sadasya details here if you implement that feature

    console.log("Saving contact details for User ID:", userId);
    const detailsResponse = await fetch(`${DAKSH_API}/api/Gram/InsertSamparkVyaktiDetails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: detailsPayload,
    });

    if (!detailsResponse.ok) {
      throw new Error("Failed to save contact details.");
    }
  };


  const resetForm = () => {
    setMobileNumber('');
    setUserStatus('unknown');
    // Reset form data to initial state
  };
  const handleVyasayUpdate = () => {
    // Use the handleInputChange function to update the main form state
    handleInputChange('VyavsayCategory', selectedVyavsay);
    handleInputChange('VyavsayVivran', vyasayVivranLocal);

    // Close the modal after updating
    setVyasayModalVisible(false);
    showSuccessToast('व्यवसाय की जानकारी अपडेट की गई'); // Optional: give user feedback
  };


  // render new star level select function
  // --- Helper function to fetch data for dropdowns (replace with your actual API calls) ---
  // const fetchDataForPicker = async (endpoint, params) => {
  //   setIsLoading(true);
  //   try {
  //     // EXAMPLE API CALL - ADAPT TO YOUR API STRUCTURE
  //     const response = await fetch(`${DAKSH_API}/${endpoint}`, {
  //       method: 'POST',
  //       headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  //       body: JSON.stringify(params),
  //     });
  //     const result = await response.json();
  //     console.log(endpoint, params);

  //     console.log(" data for star level from api", result);


  //     setIsLoading(false);
  //     return result.Data || []; // Assuming API returns data in a 'Data' property
  //   } catch (error) {
  //     console.error(`Failed to fetch from ${endpoint}:`, error);
  //     showInfoToast("डेटा लोड करने में विफल");
  //     setIsLoading(false);
  //     return [];
  //   }
  // };

  const fetchDataForPicker = async (endpoint, params) => {
    setIsLoading(true);
    try {
      +     console.log('fetchDataForPicker', endpoint, params, 'tokenPresent=', !!token);
      const response = await fetch(`${DAKSH_API}/${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const result = await response.json();
      +     console.log('fetchDataForPicker response', endpoint, result);
      setIsLoading(false);
      return result.Data || []; // Assuming API returns data in a 'Data' property
    } catch (error) {
      console.error(`Failed to fetch from ${endpoint}:`, error);
      showInfoToast("डेटा लोड करने में विफल");
      setIsLoading(false);
      return [];
    }
  };

  const fetchDataForVyasay = async (endpoint, params) => {
    setIsLoading(true);
    try {
      // EXAMPLE API CALL - ADAPT TO YOUR API STRUCTURE
      const response = await fetch(`${DAKSH_API}/${endpoint}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const result = await response.json();
      console.log(endpoint);
      console.log(" data for fetchDataForVyasay from api", result);

      setIsLoading(false);
      return result.Data || []; // Assuming API returns data in a 'Data' property
    } catch (error) {
      console.error(`Failed to fetch from ${endpoint}:`, error);
      showInfoToast("डेटा लोड करने में विफल");
      setIsLoading(false);
      return [];
    }
  };
  


  // --- useEffects to handle cascading API calls ---
  useEffect(() => {
    if (selectedVibhag !== 'विभाग चुने') {
      fetchDataForPicker('api/Gram/GetValueFromSanghMaster', { vibhag: selectedVibhag }).then(setJilaOptions);
    }
  }, [selectedVibhag]);

  useEffect(() => {
    if (selectedJila !== 'जिला चुने') {
      fetchDataForPicker('api/Gram/GetKhandNameAndCode', { jila: selectedJila }).then(setKhandOptions);
    }
  }, [selectedJila]);

  useEffect(() => {
    if (selectedKhand !== 'खंड/नगर चुने') {
      fetchDataForPicker('api/Gram/GetKhand', { khand: selectedKhand }).then(setMandalOptions);
    }
  }, [selectedKhand]);

  useEffect(() => {
    if (selectedMandal !== 'मंडल/बस्ती चुने') {
      fetchDataForPicker('api/LogIn/GetgramlistV1', { mandle: selectedMandal }).then(setGramOptions);
      // MandalCodeComplete , Mandle
    }
  }, [selectedMandal]);

  // for geting data option from gram
  // useEffect(() => {
  //   if (selectedGram !== 'ग्राम चुने') {
  //     fetchDataForPicker('api/shakha/GetShakhaKaryaKrtaListV1', { GramName: selectedGram, EtCode: gramETCode }).then(setShakhaOptions); // Assuming a different endpoint for Shakha
  //   }
  //   // "GramName" :"केशव नगर",
  //   // "EtCode" : "JYP0303N010101"
  // }, [selectedGram]);

  useEffect(() => {
    // debug
    console.log('Gram/useEffect trigger:', { selectedGram, gramETCode, tokenPresent: !!token });

    // Only fire the API call if a valid Gram name and EtCode are present
    if (selectedGram && selectedGram !== 'ग्राम चुने' && gramETCode) {
      // Log payload for parity with Postman
      const payload = { GramName: selectedGram, EtCode: gramETCode };
      console.log('Fetching Shakha with payload', payload);
      fetchDataForPicker('api/shakha/GetShakhaKaryaKrtaListV1', payload)
        .then(data => {
          console.log('Shakha API result count:', (data || []).length);
          setShakhaOptions(data);
        });
    }
  }, [selectedGram, gramETCode, token]);

  // Reset dropdowns when level changes
  const resetDependentPickers = () => {
    setSelectedVibhag('विभाग चुने');
    setSelectedJila('जिला चुने');
    setSelectedKhand('खंड/नगर चुने');
    setSelectedMandal('मंडल/बस्ती चुने');
    setSelectedGram('ग्राम चुने');
    setGramETCode('')
    setSelectedShakha({ id: '', name: 'शाखा चुने' });
    setVibhagOptions([]);
    setJilaOptions([]);
    setKhandOptions([]);
    setMandalOptions([]);
    setGramOptions([]);
    setShakhaOptions([]);
  };

  useEffect(() => {
    resetDependentPickers();
    const position = currentUser?.Position?.toLowerCase();
    if ((selectedLevel.includes('विभाग') || selectedLevel.includes('जिला') || selectedLevel.includes('खंड') || selectedLevel.includes('शाखा')) && position === 'prant') {
      fetchDataForPicker('api/Gram/GetValueFromSanghMaster', { prant: currentUser.PositionName }).then(setVibhagOptions);
    }
  }, [selectedLevel]);


  // --- TRANSLATION of Java onClick Logic ---
  const handleLevelUpdate = () => {
    const position = currentUser?.Position?.toLowerCase();
    const positionName = currentUser?.PositionName;
    const { pr, vi, ji, kh, ma } = currentUser || {};  // Assuming these are available from user data

    if (!selectedLevel || selectedLevel === "स्तर चुने") {
      showInfoToast("कृपया संपर्क सूची का स्तर चुनें");
      return;
    }

    let updateData = {};
    let place = '';
    let isValid = false;

    // Logic for each level
    if (selectedLevel === "प्रांत स्तर") {
      updateData = { AddressPrant: positionName, AddressVibhag: '', AddressJila: '', AddressKhand: '', AddressMandal: '', AddressGram: '' };
      place = sthanName || positionName;
      isValid = true;
    } else if (selectedLevel === "अखिल भारतीय") {
      updateData = { AddressPrant: '', AddressVibhag: '', AddressJila: '', AddressKhand: '', AddressMandal: '', AddressGram: '' };
      place = sthanName || "जयपुर"; // Hardcoded as in Java
      isValid = true;
    } else if (selectedLevel === 'विभाग स्तर') {
      if (position === 'prant') {
        if (selectedVibhag === 'विभाग चुने') { showInfoToast("कृपया सही विभाग चुने"); return; }
        updateData = { AddressPrant: positionName, AddressVibhag: selectedVibhag, AddressJila: '', AddressKhand: '', AddressMandal: '', AddressGram: '' };
        place = selectedVibhag;
        isValid = true;
      } else { // Assumes user is already at Vibhag level
        updateData = { AddressPrant: pr, AddressVibhag: positionName, AddressJila: '', AddressKhand: '', AddressMandal: '', AddressGram: '' };
        place = positionName;
        isValid = true;
      }
    } else if (selectedLevel === 'जिला स्तर') {
      if (position === 'prant') {
        if (selectedVibhag === 'विभाग चुने') { showInfoToast("कृपया सही विभाग चुने"); return; }
        if (selectedJila === 'जिला चुने') { showInfoToast("कृपया सही जिला चुने"); return; }
        updateData = { AddressPrant: positionName, AddressVibhag: selectedVibhag, AddressJila: selectedJila, AddressKhand: '', AddressMandal: '', AddressGram: '' };
        place = selectedJila;
        isValid = true;
      } else if (position === 'vibhag') {
        if (selectedJila === 'जिला चुने') { showInfoToast("कृपया सही जिला चुने"); return; }
        updateData = { AddressPrant: pr, AddressVibhag: positionName, AddressJila: selectedJila, AddressKhand: '', AddressMandal: '', AddressGram: '' };
        place = selectedJila;
        isValid = true;
      } else { // Assumes user is at Jila level
        updateData = { AddressPrant: pr, AddressVibhag: vi, AddressJila: positionName, AddressKhand: '', AddressMandal: '', AddressGram: '' };
        place = positionName;
        isValid = true;
      }
    }
    else if (selectedLevel === 'खंड/नगर स्तर') {
      if (position === 'prant') {
        if (selectedVibhag === 'विभाग चुने') return showInfoToast("कृपया सही विभाग चुने");
        if (selectedJila === 'जिला चुने') return showInfoToast("कृपया सही जिला चुने");
        if (selectedKhand === 'खंड/नगर चुने') return showInfoToast("कृपया सही खंड/नगर चुने");
        place = selectedKhand;
        updateData = { AddressPrant: positionName, AddressVibhag: selectedVibhag, AddressJila: selectedJila, AddressKhand: selectedKhand };
        isValid = true;
      } else if (position === 'vibhag') {
        if (selectedJila === 'जिला चुने') return showInfoToast("कृपया सही जिला चुने");
        if (selectedKhand === 'खंड/नगर चुने') return showInfoToast("कृपया सही खंड/नगर चुने");
        place = selectedKhand;
        updateData = { AddressPrant: pr, AddressVibhag: positionName, AddressJila: selectedJila, AddressKhand: selectedKhand };
        isValid = true;
      } else if (position === 'jila') {
        if (selectedKhand === 'खंड/नगर चुने') return showInfoToast("कृपया सही खंड/नगर चुने");
        place = selectedKhand;
        updateData = { AddressPrant: pr, AddressVibhag: vi, AddressJila: positionName, AddressKhand: selectedKhand };
        isValid = true;
      } else { // Assumes user is at Khand level
        place = positionName;
        updateData = { AddressPrant: pr, AddressVibhag: vi, AddressJila: ji, AddressKhand: positionName };
        isValid = true;
      }
    }
    else if (selectedLevel === 'शाखा स्तर') {
      if (position === 'prant') {
        if (selectedVibhag === 'विभाग चुने' || selectedJila === 'जिला चुने' || selectedKhand === 'खंड/नगर चुने' || selectedMandal === 'मंडल/बस्ती चुने' || selectedGram === 'ग्राम चुने' || selectedShakha.name === 'शाखा चुने') {
          return showInfoToast("कृपया सभी स्तर चुनें");
        }
        updateData = { AddressPrant: positionName, AddressVibhag: selectedVibhag, AddressJila: selectedJila, AddressKhand: selectedKhand, AddressMandal: selectedMandal, AddressGram: selectedGram };
        place = selectedShakha.id;
        isValid = true;
      } else if (position === 'vibhag') {
        if (selectedJila === 'जिला चुने' || selectedKhand === 'खंड/नगर चुने' || selectedMandal === 'मंडल/बस्ती चुने' || selectedGram === 'ग्राम चुने' || selectedShakha.name === 'शाखा चुने') {
          return showInfoToast("कृपया सभी स्तर चुनें");
        }
        updateData = { AddressPrant: pr, AddressVibhag: positionName, AddressJila: selectedJila, AddressKhand: selectedKhand, AddressMandal: selectedMandal, AddressGram: selectedGram };
        place = selectedShakha.id;
        isValid = true;
      }
      // ... Add more 'else if' blocks for jila, khand, mandal, gram positions as needed
    }
    // ... Continue this logic for 'खंड/नगर स्तर' and 'शाखा स्तर' following the Java code exactly.

    else if (selectedLevel === 'शाखा स्तर') {
      // This is the most complex one with many checks
      // Example for one path (position === 'prant')
      if (position === 'prant') {
        if (selectedVibhag === 'विभाग चुने') { showInfoToast("कृपया सही विभाग चुने"); return; }
        if (selectedJila === 'जिला चुने') { showInfoToast("कृपया सही जिला चुने"); return; }
        if (selectedKhand === 'खंड/नगर चुने') { showInfoToast("कृपया सही खंड/नगर चुने"); return; }
        if (selectedMandal === 'मंडल/बस्ती चुने') { showInfoToast("कृपया सही मंडल/बस्ती चुने"); return; }
        if (selectedGram === 'ग्राम चुने') { showInfoToast("कृपया सही ग्राम चुने"); return; }
        if (selectedShakha.name === 'शाखा चुने') { showInfoToast("कृपया सही शाखा चुने"); return; }

        updateData = {
          AddressPrant: positionName,
          AddressVibhag: selectedVibhag,
          AddressJila: selectedJila,
          AddressKhand: selectedKhand,
          AddressMandal: selectedMandal,
          AddressGram: selectedGram,
        };
        place = selectedShakha.id; // Place should be Shakha ID
        isValid = true;
      }
      // ... add else if for vibhag, jila, etc.
    }

    if (isValid) {
      handleInputChange('SamparkSuchiSthar', selectedLevel);
      handleInputChange('Place', place);
      // Update all address fields at once
      setFormData(prev => ({ ...prev, ...updateData }));

      // Display the selected text in the main form
      const displayText = selectedLevel === 'शाखा स्तर' ? `${selectedLevel} - ${selectedShakha.name}` : `${selectedLevel} - ${place}`;
      handleInputChange('contactLevelDisplay', displayText); // Use a new state to avoid confusion

      setContactLevelModalVisible(false);
    }
  };

  // --- Render function for the NEW Contact Level Modal ---
  const renderContactLevelModal = () => {
    const position = currentUser?.Position?.toLowerCase();

    // --- Conditions for showing each picker sequentially ---
    const showVibhag = (selectedLevel.includes('विभाग') || selectedLevel.includes('जिला') || selectedLevel.includes('खंड') || selectedLevel.includes('शाखा')) && position === 'prant';
    const showJila = (selectedLevel.includes('जिला') || selectedLevel.includes('खंड') || selectedLevel.includes('शाखा')) && (position === 'prant' || position === 'vibhag') && (showVibhag ? selectedVibhag !== 'विभाग चुने' : true);
    const showKhand = (selectedLevel.includes('खंड') || selectedLevel.includes('शाखा')) && (position === 'prant' || position === 'vibhag' || position === 'jila') && (showJila ? selectedJila !== 'जिला चुने' : true);
    const showMandal = selectedLevel.includes('शाखा') && (position !== 'gram') && (showKhand ? selectedKhand !== 'खंड/नगर चुने' : true);
    const showGram = selectedLevel.includes('शाखा') && (position !== 'shakha') && (showMandal ? selectedMandal !== 'मंडल/बस्ती चुने' : true);
    const showShakha = selectedLevel.includes('शाखा') && (showGram ? selectedGram !== 'ग्राम चुने' : true);


    return (
      <Modal visible={contactLevelModalVisible} transparent animationType="slide" onRequestClose={() => setContactLevelModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>संपर्क सूची का स्तर</Text>
            <ScrollView style={{ width: '100%' }}>
              {/* Level Picker */}
              <View style={styles.pickerContainer}>
                <Picker selectedValue={selectedLevel} onValueChange={(itemValue) => setSelectedLevel(itemValue)}>
                  {levelOptions.map(opt => <Picker.Item key={opt} label={opt} value={opt} />)}
                </Picker>
              </View>

              {/* --- Default Field for Akhil Bhartiya & Prant --- */}
              {(selectedLevel === 'अखिल भारतीय' || selectedLevel === 'प्रांत स्तर') && (
                <>
                  {/* <Text style={styles.modalLabel}>स्थान</Text> */}
                  <TextInput
                    style={[styles.modalInput, styles.disabledInput]}
                    value="जयपुर"
                    editable={false}
                  />
                  {/* <Text style={styles.modalLabel}>स्थान का नाम (वैकल्पिक)</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    placeholder="स्थान का नाम दर्ज करें"
                                    value={sthanName}
                                    onChangeText={setSthanName}
                                /> */}
                </>
              )}

              {/* --- CASCADING DROPDOWNS --- */}
              {showVibhag && (
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={selectedVibhag} onValueChange={(itemValue) => setSelectedVibhag(itemValue)}>
                    <Picker.Item label="विभाग चुने" value="विभाग चुने" />
                    {vibhagOptions.map(v => <Picker.Item key={v.id} label={v.placename} value={v.placename} />)}
                  </Picker>
                </View>
              )}

              {showJila && (
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={selectedJila} onValueChange={(itemValue) => setSelectedJila(itemValue)}>
                    <Picker.Item label="जिला चुने" value="जिला चुने" />
                    {jilaOptions.map(j => <Picker.Item key={j.id} label={j.placename} value={j.placename} />)}
                  </Picker>
                </View>
              )}

              {showKhand && (
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={selectedKhand} onValueChange={(itemValue) => setSelectedKhand(itemValue)}>
                    <Picker.Item label="खंड/नगर चुने" value="खंड/नगर चुने" />
                    {khandOptions.map(k => <Picker.Item key={k.id} label={k.Khand} value={k.Khand} />)}
                  </Picker>
                </View>
              )}

              {showMandal && (
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={selectedMandal} onValueChange={(itemValue) => setSelectedMandal(itemValue)}>
                    <Picker.Item label="मंडल/बस्ती चुने" value="मंडल/बस्ती चुने" />
                    {mandalOptions.map(m => <Picker.Item key={m.id} label={m.Mandle} value={m.MandalCodeComplete} />)}
                  </Picker>
                </View>

                // MandalCodeComplete: "JYP0303N0102" Mandle: "इंदिरा कॉलोनी"
              )}

              {/* {showGram && (
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={selectedGram} onValueChange={(itemValue, ETCode) => {setSelectedGram(itemValue);  
                   setGramETCode(ETCode)}

                  }>
                    <Picker.Item label="ग्राम चुने" value="ग्राम चुने" />
                    {gramOptions.map(g => <Picker.Item key={g.id} label={g.Gram} value={g.placename} />)}
                  </Picker>
                </View>
              )} */}

              {showGram && (
                <View style={styles.pickerContainer}>
                  <Picker
                    // Bind the selected value to the ETCode state
                    selectedValue={gramETCode}
                    onValueChange={(itemValue, itemIndex) => {
                      // When an item is selected, its 'value' (the EtCode) is itemValue
                      setGramETCode(itemValue);

                      // Find the full object from our options array to get the name
                      if (itemValue !== 'ग्राम चुने') {
                        const selectedGramObject = gramOptions.find(g => g.EtCode === itemValue);
                        if (selectedGramObject) {
                          setSelectedGram(selectedGramObject.Gram); // Set the name state
                        }
                      } else {
                        setSelectedGram('ग्राम चुने'); // Reset if placeholder is chosen
                      }
                    }}
                  >
                    <Picker.Item label="ग्राम चुने" value="" />
                    {/* The 'value' of each item is now the EtCode */}
                    {gramOptions.map(g => (
                      <Picker.Item key={g.EtCode} label={g.Gram} value={g.EtCode} />
                    ))}

                  </Picker>
                </View>
              )}

              {showShakha && (
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={selectedShakha.name} onValueChange={(itemValue, itemIndex) => setSelectedShakha({ id: shakhaOptions[itemIndex - 1]?.id, name: itemValue })}>
                    <Picker.Item label="शाखा चुने" value="शाखा चुने" />
                    {shakhaOptions.map(s => <Picker.Item key={s.id} label={s.ShakhaName + "," + s.SubCategory + " " + s.ShakhaCategory} value={s.shakhaName} />)}
                    {/* // ShakhaName , SubCategory ShakhaCategory */}

                  </Picker>
                </View>
              )}

              {isLoading && <ActivityIndicator style={{ marginVertical: 10 }} size="small" color={Colors.bg_safron} />}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.modalCancel]} onPress={() => setContactLevelModalVisible(false)}>
                <Text style={styles.modalCancelText}>रद्द करें</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleLevelUpdate}>
                <Text style={styles.modalButtonText}>अपडेट करें</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };



  // Fetch occupation list when vyasay modal opens
  // useEffect(() => {
  //   if (!vyasayModalVisible) return;
  //   let mounted = true;
  //   (async () => {
  //     try {
  //       const data = await fetchDataForVyasay('api/shakha/GetOccupation_Master', {}); // expects Data: [{ Vyashay: '...' }, ...]
  //       const opts = (data || []).map(d => d.Vyashay).filter(Boolean);
  //       if (mounted) {
  //         setVyavsayCategoryOptions(opts);
  //         setSelectedVyavsay(formData.VyavsayCategory || '');
  //       }
  //     } catch (err) {
  //       console.error('Failed to load occupations', err);
  //     }
  //   })();
  //   return () => { mounted = false; };
  // }, [vyasayModalVisible, token]);

  // Fetch occupation list when vyasay modal opens
  
  useEffect(() => {
    if (!vyasayModalVisible) return;
    let mounted = true;
    (async () => {
      try {
        const data = await fetchDataForVyasay('api/shakha/GetOccupation_Master', {});
        const opts = (data || []).map(d => d.Vyashay).filter(Boolean);
        if (mounted) {
          setVyavsayCategoryOptions(['व्यवसाय चुनें', ...opts]); // Add a blank option to allow un-selecting
          
          // --- MODIFICATION HERE ---
          // Initialize modal state from the main formData
          setSelectedVyavsay(formData.VyavsayCategory || ''); 
          setVyasayVivranLocal(formData.VyavsayVivran || '');
        }
      } catch (err) {
        console.error('Failed to load occupations', err);
      }
    })();
    return () => { mounted = false; };
  }, [vyasayModalVisible, token, formData.VyavsayCategory, formData.VyavsayVivran]); 

  const renderVyasayModal = () => {

    return (
      <Modal visible={vyasayModalVisible} transparent animationType="slide" onRequestClose={() => setVyasayModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>व्यवसाय </Text>
            <ScrollView style={{ width: '100%' }}>
              {/* Level Picker */}
              <View style={styles.pickerContainer}>
                <Picker selectedValue={selectedVyavsay} onValueChange={(itemValue) => setSelectedVyavsay(itemValue)}>
                  {VyavsayCategoryOptions.map(opt => <Picker.Item key={opt} label={opt} value={opt} />)}
                </Picker>
              </View>
            <TextInput style={styles.input} value={formData.VyavsayVivran} onChangeText={val => handleInputChange('VyavsayVivran', val)}  placeholder='व्यवसाय का विस्तृत विवरण भरें '/>

              {isLoading && <ActivityIndicator style={{ marginVertical: 10 }} size="small" color={Colors.bg_safron} />}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.modalCancel]} onPress={() => setVyasayModalVisible(false)}>
                <Text style={styles.modalCancelText}>रद्द करें</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleVyasayUpdate}>
                <Text style={styles.modalButtonText}>अपडेट करें</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // --- RENDER FUNCTIONS FOR CLEANER CODE ---
  const renderContactInfoForm = () => (
    <View style={styles.formSection}>
      <Text style={styles.sectionTitle}>सम्पर्कित जानकारी</Text>

      <Text style={styles.label}>* संपर्क की दिनांक </Text>
      <TextInput style={styles.input} value={formData.SamparkDate} editable={false} />

      <Text style={styles.label}>* संपर्क करने वाले कार्यकर्ता का नाम</Text>
      <TextInput style={styles.input} value={formData.SamparkKarneValeKaryakartaName} editable={false} />
      {/* SamparkKarneValeKaryakartaName: '', */}
      {/*  */}
      <Text style={styles.label}>* संपर्क के दौरान चर्चा के विषय का संक्षिप्त विवरण</Text>
      <TextInput style={[styles.input,]} multiline value={formData.discussionDetails} onChangeText={val => handleInputChange('discussionDetails', val)} />

      <Text style={styles.label}>साहित्य/पुस्तक भेंट का विवरण</Text>
      <TextInput style={[styles.input, {}]} multiline value={formData.literatureDetails} onChangeText={val => handleInputChange('literatureDetails', val)} />

      <Text style={styles.label}>* चर्चा कैसी रही</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={formData.CharchaKaisiRahi} onValueChange={val => handleInputChange('CharchaKaisiRahi', val)}>
          <Picker.Item label="चर्चा कैसी रही" value="चर्चा कैसी रही" />
          <Picker.Item label="सकारात्मक" value="सकारात्मक" />
          <Picker.Item label="नकारात्मक" value="नकारात्मक" />
          <Picker.Item label="आलोचनात्मक" value="आलोचनात्मक" />
          <Picker.Item label="उदासीन" value="उदासीन" />

        </Picker>
      </View>
      {/* <DiscussionRatingPicker  formData={formData}
  handleInputChange={handleInputChange}/> */}
      <View style={styles.toliContainer}>
        <Text style={styles.label}>टोली सदस्य</Text>
        <TouchableOpacity onPress={() => Alert.alert("टोली सदस्य", "यहां आप और सदस्य जोड़ पाएंगे।")}>
          <MaterialIcons name="add-circle" size={36} color={Colors.bg_safron} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPersonalInfoForm = () => (
    <>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>व्यक्तिगत जानकारी</Text>
        <Text style={styles.label}>* सम्पर्कित महानुभाव का प्रथम नाम </Text>
        <TextInput style={styles.input} value={formData.FirstName} onChangeText={val => handleInputChange('FirstName', val)} />
        <Text style={styles.label}>सम्पर्कित महानुभाव का उपनाम</Text>
        <TextInput style={styles.input} value={formData.MiddleName} onChangeText={val => handleInputChange('MiddleName', val)} />
        <Text style={styles.label}>सम्पर्कित महानुभाव का कुलनाम</Text>
        <TextInput style={styles.input} value={formData.LastName} onChangeText={val => handleInputChange('LastName', val)} />

        <Text style={styles.label}>महानुभाव का परिचय (अभिरुचि सहित)</Text>
        <TextInput style={styles.input} value={formData.Introduction} onChangeText={val => handleInputChange('Introduction', val)} />
        <Text style={styles.label}>ईमेल</Text>
        <TextInput style={styles.input} keyboardType="email-address" value={formData.Email} onChangeText={val => handleInputChange('Email', val)} />
      </View>
      <View style={styles.formSection}>
        {/* api/shakha/GetOccupation_Master shoudl get list dropdown form this then option to add VyavsayVivran as input text */}
        <Text style={styles.label}>महानुभाव के व्यवसाय/कार्य क्षेत्र का विवरण</Text>
        {/* <TextInput style={[styles.input,]} multiline value={formData.VyavsayCategory} onChangeText={val => handleInputChange('VyavsayCategory', val)} /> */}
        <TouchableOpacity style={styles.input} onPress={() => setVyasayModalVisible(true)}>
          <Text style={{ color: formData.contactLevelDisplay ? '#000' : '#999' }}>
            {formData.VyavsayCategory || 'व्यवसाय चुनें'}
          </Text>
        </TouchableOpacity>

        {/* विशेष योग्यता- plain text */}
        <Text style={styles.label}>विशेष योग्यता</Text>
        <TextInput style={[styles.input]} multiline value={formData.specialQualification} onChangeText={val => handleInputChange('specialQualification', val)} />


        {/* <Text style={styles.label}>* संपर्क सूची का स्तर</Text>
        <TextInput style={styles.input} placeholder="स्तर चुने" value={formData.contactLevel} onChangeText={val => handleInputChange('contactLevel', val)} /> */}
        <Text style={styles.label}>* संपर्क सूची का स्तर</Text>
        {/* <TouchableOpacity style={styles.input} onPress={() => setContactLevelModalVisible(true)}>
          <Text style={{color: formData.contactLevel ? '#000' : '#999'}}>{formData.contactLevel || 'स्तर चुने'}</Text>
        </TouchableOpacity> */}

        {/* In renderPersonalInfoForm, update the TouchableOpacity to show the display text */}
        <TouchableOpacity style={styles.input} onPress={() => setContactLevelModalVisible(true)}>
          <Text style={{ color: formData.contactLevelDisplay ? '#000' : '#999' }}>
            {formData.contactLevelDisplay || 'स्तर चुने'}
          </Text>
        </TouchableOpacity>

        {renderContactLevelModal()}
        {renderVyasayModal()}


        <Text style={styles.label}>* श्रेणी वर्गीकरण</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={formData.ShrediVargikaran} onValueChange={val => handleInputChange('ShrediVargikaran', val)}>
            <Picker.Item label="श्रेणी वर्गीकरण" value="श्रेणी वर्गीकरण" />
            <Picker.Item label="सामाजिक नेतृत्व" value="सामाजिक नेतृत्व" />
            <Picker.Item label="धार्मिक" value="धार्मिक" />
            <Picker.Item label="आर्थिक" value="आर्थिक" />
            <Picker.Item label="प्रशासनिक अधिकारी" value="प्रशासनिक अधिकारी" />
            <Picker.Item label="न्यायिक" value="न्यायिक" />
            <Picker.Item label="चिकित्सा" value="चिकित्सा" />
            <Picker.Item label="प्रबुद्ध नागरिक" value="प्रबुद्ध नागरिक" />
            <Picker.Item label="कला" value="कला" />
            <Picker.Item label="क्रीड़ा" value="क्रीड़ा" />
            <Picker.Item label="वैज्ञानिक" value="वैज्ञानिक" />

          </Picker>
        </View>

        {/* dropdown data from  api  */}
        <Text style={styles.label}>* पता पिन कोड सहित </Text>
        <TextInput style={[styles.input, {  }]}  value={formData.address} onChangeText={val => handleInputChange('address', val)} />

        <Text style={styles.label}>क्या आप संपर्क की जानकारी भरना चाहते है?</Text>
        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setShowContactInfo(!showContactInfo)}>

          <MaterialIcons name={showContactInfo ? 'check-box' : 'check-box-outline-blank'} size={24} color={Colors.bg_safron} />
          <Text style={styles.checkboxLabel}>हाँ</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <>
      <Modal animationType="slide" visible={visible} onRequestClose={onClose}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="arrow-back" size={30} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={2}>राष्ट्रीय स्वयंसेवक संघ{"\n"}अखिल भारतीय संपर्क विभाग</Text>
            <View style={{ width: 30 }} />
          </View>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <View style={styles.inputContainer}>
                <MaterialIcons name="phone-iphone" size={24} color={Colors.bg_safron} style={styles.inputIcon} />
                <TextInput
                  style={styles.mobileInput}
                  placeholder="मोबाइल नंबर डाले"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                />
              </View>

              {userStatus === 'checking' && <ActivityIndicator style={{ marginVertical: 20 }} size="large" color={Colors.bg_safron} />}

              {userStatus === 'newUser' && renderPersonalInfoForm()}

              {userStatus === 'exists' && existingUserData && (
                <>
                  {/* <View style={{padding: 10}}>
                    <Text style={styles.infoText}>यह व्यक्ति पहले से मौजूद है: {`${existingUserData.FirstName} ${existingUserData.LastName}`}</Text>
                </View> */}
                  <UserProfileCard user={existingUserData} />
                </>
              )}

              {/* Conditionally render the contact info form based on checkbox or if user exists */}
              {showContactInfo && renderContactInfoForm()}

              {userStatus !== 'unknown' && userStatus !== 'checking' && (
                <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
                  <Text style={styles.submitButtonText}>प्रविष्टी करें</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>


      </Modal>


    </>

  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg_safron },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: Colors.bg_safron },
  headerTitle: { color: Colors.white, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  scrollContainer: { padding: 15, backgroundColor: Colors.bg_safron },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 50 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 30, paddingHorizontal: 15, marginBottom: 20,
    backgroundColor: Colors.grey2
  },
  inputIcon: { marginRight: 10 },
  mobileInput: { flex: 1, height: 50, fontSize: 16 },
  sectionTitle: { textAlign: "center", fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  formSection: { marginBottom: 8 },
  label: { fontSize: 16, fontWeight: '500', color: "black", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', backgroundColor: '#f9f9f9', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 15 },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', backgroundColor: '#f9f9f9', borderRadius: 10, marginBottom: 15 },
  infoText: { textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: 'green', marginVertical: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 2, },
  checkboxLabel: { marginLeft: 10, fontSize: 16, color: '#333' },
  toliContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  submitButton: { backgroundColor: Colors.bg_safron, padding: 15, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  submitButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  // style for modal star level ...
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '90%', backgroundColor: 'white', borderRadius: 12, padding: 18, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#333' },
  modalOption: { paddingVertical: 12, paddingHorizontal: 10, width: '100%', borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalOptionText: { fontSize: 16, color: '#333' },
  modalOptionSelected: { backgroundColor: '#fdeee2' },
  modalOptionTextSelected: { color: Colors.bg_safron, fontWeight: '700' },
  modalActions: { flexDirection: 'row', marginTop: 12, width: '100%', justifyContent: 'center' },
  modalCancel: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30, borderWidth: 1, borderColor: Colors.bg_safron },
  modalCancelText: { color: Colors.bg_safron, fontSize: 16 },
  // ...existing code...
  modalActions: { flexDirection: 'row', marginTop: 12, width: '100%', justifyContent: 'space-around' },
  modalButton: { paddingVertical: 10, paddingHorizontal: 30, borderRadius: 30, backgroundColor: Colors.bg_safron },
  modalButtonText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  modalCancel: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.bg_safron },
  modalCancelText: { color: Colors.bg_safron },
  // ADD THESE NEW STYLES for the modal inputs
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: "#333",
    marginBottom: 8,
    alignSelf: 'flex-start',
    paddingLeft: 5,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  disabledInput: {
    backgroundColor: '#e9ecef',
    color: '#6c757d',
  },
});

export default AddSamparkitModal;


