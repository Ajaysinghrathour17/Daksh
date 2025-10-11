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

const subCategoryMap = {
  "सामाजिक नेतृत्व": ["उपश्रेणी वर्गीकरण", "जाति–वर्गों के प्रमुख", "उनके संघों के पदाधिकारी", "सेवा संस्थान", "विभिन्न क्लब"],
  "धार्मिक": ["उपश्रेणी वर्गीकरण", "विभिन्न अखाड़े व अन्य पूज्य संत गण", "मठ", "मन्दिर", "आश्रम", "गुरूद्वारे", "जैन स्थानक", "बौद्धमठ", "अन्य प्रमुख मठ पंथों के प्रमुख", "कथावाचक", "भजनीक"],
  "आर्थिक": ["उपश्रेणी वर्गीकरण", "व्यापारी", "उद्योगपति", "CA", "CS", "ICWA", "ENGG", "Builders", "Tribunal का सदस्य", "बैंक/बीमा के वरिष्ठ प्रबंधक", "आर्थिक दृष्टि से बड़ी फर्मों के प्रमुख बंधु (PwC, Deloitte, EnY etc.)"],
  "प्रशासनिक अधिकारी": ["उपश्रेणी वर्गीकरण", "सेवारत और सेवा निवृत केन्द्रीय व प्रांतिय सेवा के अधिकारी गण", "सार्वजनिक संस्थानों (PSU’S) के प्रमुख", "सेना व विदेश सेवा के अधिकारी", "विभिन्न आयोगों के पदाधिकारी"],
  "न्यायिक": ["उपश्रेणी वर्गीकरण", "वर्तमान व सेवा निवृत न्यायाधीश", "प्रमुख व प्रभावी अधिवक्ता (सिविल, क्रिमिनल, टैक्सेसशन आदि) न्यायाधीश", "Law Firms"],
  "चिकित्सा": ["उपश्रेणी वर्गीकरण", "सभी चिकित्सा पद्धतियों के (Pathys) प्रमुख चिकित्सक", "अस्पतालों के निदेशक", "प्रमुख डायग्नोस्टिक सेंटर"],
  "प्रबुद्ध नागरिक": ["उपश्रेणी वर्गीकरण", "VC", "Dean", "Registrar", "Prof", "लेखक", "साहित्यकार", "सामाजिक संचार पटल (Social Media, Twitter, Blogger, YouTuber) पर सक्रिय व प्रभावी", "प्रमुख पत्रकार", "कवि", "अन्य"],
  "कला": ["उपश्रेणी वर्गीकरण", "चित्रकार", "मूर्तिकार", "नृत्य", "वादक", "अभिनय", "गायन", "लोक गीत गायक", "लोक नृर्तक", "फिल्म", "निर्माता", "निर्देशक", "कलाकार", "पटकथा", "लेखक"],
  "क्रीड़ा": ["उपश्रेणी वर्गीकरण", "राष्ट्रीय पदक विजेता खिलाड़ी", "अंतरराष्ट्रीय पदक विजेता खिलाड़ी", "कोच", "अखाड़ों के प्रमुख", "मार्शल आर्ट में प्रवीण", "व्यायामशालो के प्रमुख द्रोणाचार्य", "अर्जुन", "राजीव गांधी (मेजर ध्यान चंद) पुरस्कार", "विश्वविद्यालयों के प्रमुख"],
  "वैज्ञानिक": ["उपश्रेणी वर्गीकरण", "प्रमुख वैज्ञानिक", "सरकारी व गैर सरकारी वैज्ञानिक/शोध संस्थानों के प्रमुख वैज्ञानिक"],
};


// --- Main Component ---
const AddSamparkitModal = ({ visible, onClose, onSave, token }) => {
  // State for the entire form flow
  const [mobileNumber, setMobileNumber] = useState('7067666026');
  const [userStatus, setUserStatus] = useState('unknown');
  const [existingUserData, setExistingUserData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // / New state for contact-level modal & user position
  const [contactLevelModalVisible, setContactLevelModalVisible] = useState(false);
  const [vyasayModalVisible, setVyasayModalVisible] = useState(false);

  const [currentUserPosition, setCurrentUserPosition] = useState('');

  // States for the logged-in user's context
  const [currentUser, setCurrentUser] = useState(null);
  const [sthanName, setSthanName] = useState('');

  // --- States for the NEW Address Modal ---
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [selectedAddressVibhag, setSelectedAddressVibhag] = useState('विभाग चुने');
  const [selectedAddressJila, setSelectedAddressJila] = useState('जिला चुने');
  const [selectedAddressKhand, setSelectedAddressKhand] = useState('खंड/नगर चुने');
  const [selectedAddressMandal, setSelectedAddressMandal] = useState('मंडल/बस्ती चुने');
  const [selectedAddressGram, setSelectedAddressGram] = useState('ग्राम चुने');

  // Local state for the text inputs inside the address modal
  const [localFullAddress, setLocalFullAddress] = useState('');
  const [localPinCode, setLocalPinCode] = useState('');

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

  // Selected values for cascading dropdowns
  const [selectedVibhag, setSelectedVibhag] = useState('विभाग चुने');
  const [selectedJila, setSelectedJila] = useState('जिला चुने');
  const [selectedKhand, setSelectedKhand] = useState('खंड/नगर चुने');
  const [selectedMandal, setSelectedMandal] = useState('मंडल/बस्ती चुने');
  const [selectedGram, setSelectedGram] = useState('ग्राम चुने');
  const [gramETCode, setGramETCode] = useState("")
  const [selectedShakha, setSelectedShakha] = useState({ id: '', name: 'शाखा चुने' });
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);

  // --- State for Toli Sadasya feature ---
  const [toliMembers, setToliMembers] = useState([]); // Array of objects: { mobile: '', name: '', status: 'idle' | 'checking' | 'found' | 'notFound' }
  const toliMemberTitles = ['प्रथम', 'द्वितीय', 'तृतीय'];
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
    VyavsayVivran: vyasayVivranLocal,
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
    ToliSadasyaOneKaName: '',
    ToliSadasyaOneKaNumber: '',
    ToliSadasyaTwoKaName: '',
    ToliSadasyaTwoKaNumber: '',
    ToliSadasyathreeKaName: '',
    ToliSadasyathreeKaNumber: '',
  });

  // useEffect(() => { console.log(formData) }, [formData])

  // This state controls the "Contact Information" section
  const [showContactInfo, setShowContactInfo] = useState(false);

  // --- ✨ NEW: Toli Member Functions ---
  // --- ✨ NEW: Toli Member Functions ---
  const addToliMember = () => {
    if (toliMembers.length < 3) {
      setToliMembers([...toliMembers, { mobile: '', name: '', status: 'idle' }]);
    } else {
      showInfoToast('आप अधिकतम 3 सदस्य जोड़ सकते हैं');
    }
  };

  const removeToliMember = (index) => {
    const updatedMembers = toliMembers.filter((_, i) => i !== index);
    setToliMembers(updatedMembers);
  };

  const handleToliMemberChange = (text, index) => {
    const updatedMembers = [...toliMembers];
    const currentMember = updatedMembers[index];
    currentMember.mobile = text.replace(/[^0-9]/g, ''); // Ensure only numbers
    currentMember.name = ''; // Reset name when number changes
    currentMember.status = currentMember.mobile.length === 10 ? 'checking' : 'idle';
    setToliMembers(updatedMembers);
  };

  // Effect to check Toli Member number via API
  useEffect(() => {
    const checkMember = async (member, index) => {
      if (member.status !== 'checking') return;

      try {
        const response = await fetch(`${DAKSH_API}/api/Gram/GetKaryaKartadetailUsingNumberV1`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ MobileNumber: member.mobile }),
        });
        const result = await response.json();
        console.log(member.mobile, result);

        // Use a functional update to avoid stale state issues in loops
        setToliMembers(currentMembers => {
          const newMembers = [...currentMembers];
          console.log("newMembers", newMembers);

          if (newMembers[index]) { // Check if the member still exists
            if (result.Data && result.Data.length > 0) {
              newMembers[index].name = result.Data[0].UserName;
              newMembers[index].status = 'found';
            } else {
              // showInfoToast('इस नंबर से कोई कार्यकर्ता जुड़ा हुआ नहीं है।');
              // console.log('इस नंबर से कोई कार्यकर्ता जुड़ा हुआ नहीं है।');
              Alert.alert(
                "टोली सदस्य",
                "इस नंबर से कोई कार्यकर्ता जुड़ा हुआ नहीं है।",);
              newMembers[index].mobile = '';
              newMembers[index].name = '';
              newMembers[index].status = 'idle';
            }
          }
          return newMembers;
        });

      } catch (err) {
        console.error("Toli member check failed:", err);
        setToliMembers(currentMembers => {
          const newMembers = [...currentMembers];
          if (newMembers[index]) newMembers[index].status = 'idle';
          return newMembers;
        });
      }
    };

    toliMembers.forEach((member, index) => {
      if (member.status === 'checking') {
        // Debounce the API call slightly to prevent firing on every keystroke
        const timer = setTimeout(() => checkMember(member, index), 500);
        return () => clearTimeout(timer);
      }
    });
  }, [toliMembers, token]);

  // Effect to sync found Toli Members to the main formData
  useEffect(() => {
    const memberKeys = ['One', 'Two', 'three'];
    let updatedFormData = {};

    memberKeys.forEach((key, index) => {
      const member = toliMembers[index];
      if (member && member.status === 'found') {
        updatedFormData[`ToliSadasya${key}KaName`] = member.name;
        updatedFormData[`ToliSadasya${key}KaNumber`] = member.mobile;
      } else {
        updatedFormData[`ToliSadasya${key}KaName`] = '';
        updatedFormData[`ToliSadasya${key}KaNumber`] = '';
      }
    });

    setFormData(prev => ({ ...prev, ...updatedFormData }));
  }, [toliMembers]);

  // toli code ends

  // Fetch logged-in user's name and number on mount
  useEffect(() => {
    const getUserDetails = async () => {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const user = JSON.parse(userDataString);
        console.log("user in getUserDetails add samparkit modal", user);
        const pos = user?.user?.Position || user?.Position || '';

        console.log(pos);
        setCurrentUser(user?.user)
        // console.log(user?.user);

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

  // useEffect hook to manage the dependent dropdown's options
  useEffect(() => {
    const selectedCategory = formData.ShrediVargikaran;

    // Find the options for the selected category in our map
    const options = subCategoryMap[selectedCategory] || [];
    setSubCategoryOptions(options);

    // IMPORTANT: Reset the sub-category selection when the main category changes
    handleInputChange('UpShrediVargikaran', '');

  }, [formData.ShrediVargikaran]);

  // useeffect  for adddress with pinn code 
  useEffect(() => {
    if (addressModalVisible && currentUser?.PositionName) {
      // Load Vibhag options based on the logged-in user's Prant
      fetchDataForPicker('api/Gram/GetValueFromSanghMaster', { prant: currentUser.PositionName }).then(setVibhagOptions);
    }
  }, [addressModalVisible, currentUser]);

  // When Vibhag changes, fetch Jila
  useEffect(() => {
    if (selectedAddressVibhag !== 'विभाग चुने') {
      fetchDataForPicker('api/Gram/GetValueFromSanghMaster', { vibhag: selectedAddressVibhag }).then(setJilaOptions);
    } else {
      setJilaOptions([]); // Clear dependent options
    }
    setSelectedAddressJila('जिला चुने'); // Reset child picker
    setKhandOptions([]);
    setMandalOptions([]);
    setGramOptions([]);
  }, [selectedAddressVibhag]);

  // When Jila changes, fetch Khand
  useEffect(() => {
    if (selectedAddressJila !== 'जिला चुने') {
      fetchDataForPicker('api/Gram/GetKhandNameAndCode', { jila: selectedAddressJila }).then(setKhandOptions);
    } else {
      setKhandOptions([]);
    }
    setSelectedAddressKhand('खंड/नगर चुने');
    setMandalOptions([]);
    setGramOptions([]);
  }, [selectedAddressJila]);

  // When Khand changes, fetch Mandal
  useEffect(() => {
    if (selectedAddressKhand !== 'खंड/नगर चुने') {
      fetchDataForPicker('api/Gram/GetKhand', { khand: selectedAddressKhand }).then(setMandalOptions);
    } else {
      setMandalOptions([]);
    }
    setSelectedAddressMandal('मंडल/बस्ती चुने');
    setGramOptions([]);
  }, [selectedAddressKhand]);

  // When Mandal changes, fetch Gram
  useEffect(() => {
    if (selectedAddressMandal !== 'मंडल/बस्ती चुने') {
      fetchDataForPicker('api/LogIn/GetgramlistV1', { mandle: selectedAddressMandal }).then(setGramOptions);
    } else {
      setGramOptions([]);
    }
    setSelectedAddressGram('ग्राम चुने');
  }, [selectedAddressMandal]);

  // When the modal opens, initialize its local state from the main formData
  useEffect(() => {
    if (addressModalVisible) {
      setLocalFullAddress(formData.FullAddress || '');
      setLocalPinCode(formData.PinCode || '');
      setSelectedAddressVibhag(formData.AddressVibhag || 'विभाग चुने');
      // You can add similar lines for Jila, Khand etc. if you want them to persist
    }
  }, [addressModalVisible]);

  // use effect for address with pin code

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
        // --- 🟢 SCENARIO 1: Create a New User ---
        const {
          FirstName,
          MiddleName,
          LastName,
          Introduction,
          Email,
          VyavsayCategory,
          VyavsayVivran,
          ViseshYogyata,
          SamparkSuchiSthar,
          Place,
          ShrediVargikaran,
          UpShrediVargikaran,
          AddressPrant,
          AddressVibhag,
          AddressJila,
          AddressKhand,
          AddressMandal,
          AddressGram,
          FullAddress,
          PinCode,
          prant,
          vibhag,
          jila,
          khand,
          mandal,
          gram
        } = formData;

        // --- Create JSON payload for InsertSamparkVyakti ---
        const payload = {
          FirstName,
          MiddleName,
          LastName,
          Introduction,
          Email,
          VyavsayCategory,
          VyavsayVivran,
          ViseshYogyata,
          SamparkSuchiSthar,
          Place,
          ShrediVargikaran,
          UpShrediVargikaran,
          AddressPrant,
          AddressVibhag,
          AddressJila,
          AddressKhand,
          AddressMandal,
          AddressGram,
          FullAddress,
          PinCode,
          prant,
          vibhag,
          jila,
          khand,
          mandal,
          gram,
          mobileNo: mobileNumber,
        };

        console.log("🟢 Sending JSON payload to InsertSamparkVyakti:", payload);

        const personResponse = await fetch(`${DAKSH_API}/api/Gram/InsertSamparkVyakti`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const personResult = await personResponse.json();
        console.log("🟣 Response from InsertSamparkVyakti:", personResult);

        if (!personResponse.ok || !personResult.Data || personResult.Data.length === 0) {
          throw new Error(personResult.Message || "Failed to create new person.");
        }

        const newUserId = personResult.Data[0].output;
        console.log("✅ New user created with ID:", newUserId);

        // --- Add contact details if available ---
        if (showContactInfo) {
          await saveContactDetails(newUserId);
        }

      } else if (userStatus === 'exists') {
        // --- 🟡 SCENARIO 2: Existing User, just add contact details ---
        console.log("🟡 Adding contact details for existing user:", existingUserData?.Id);
        await saveContactDetails(existingUserData.Id);
      }

      // Alert.alert("Success", "Data saved successfully!");
      showSuccessToast('सम्पर्कित जानकारी सफलतापूर्वक सेव हुआ')
      onSave();

    } catch (error) {
      console.error("❌ Failed to save data:", error);
      Alert.alert("Error", error.message || "An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };


  const saveContactDetails = async (userId) => {
    const detailsPayload = {
      Id: userId,
      SamparkDate: formData.SamparkDate,
      SamparkKarneValeKaryakartaName: formData.SamparkKarneValeKaryakartaName,
      SamparkKarneWaleKaryakartaNumber: formData.SamparkKarneWaleKaryakartaNumber,
      CharchaVivran: formData.CharchaVivran,
      ShahityaBookVivran: formData.ShahityaBookVivran,
      CharchaKaisiRahi: formData.CharchaKaisiRahi,

      // Optional — Add Toli Sadasya details if available
      ToliSadasyaOneKaName: formData.ToliSadasyaOneKaName || "",
      ToliSadasyaOneKaNumber: formData.ToliSadasyaOneKaNumber || "",
      ToliSadasyaTwoKaName: formData.ToliSadasyaTwoKaName || "",
      ToliSadasyaTwoKaNumber: formData.ToliSadasyaTwoKaNumber || "",
      ToliSadasyathreeKaName: formData.ToliSadasyathreeKaName || "",
      ToliSadasyathreeKaNumber: formData.ToliSadasyathreeKaNumber || "",
    };

    console.log("Saving contact details for User ID:", userId, detailsPayload);

    const detailsResponse = await fetch(`${DAKSH_API}/api/Gram/InsertSamparkVyaktiDetails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(detailsPayload),
    });

    if (!detailsResponse.ok) {
      throw new Error("Failed to save contact details.");
    }

    const result = await detailsResponse.json();
    console.log("Details saved successfully:", result);
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
  }, [selectedGram, gramETCode]);

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
    } else if (selectedLevel === 'खंड/नगर स्तर') {
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
    } else if (selectedLevel === 'शाखा स्तर') {
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
    // 1. Vibhag is needed for all lower levels (if user is Prant)
    const showVibhag = (selectedLevel === 'विभाग स्तर' || selectedLevel === 'जिला स्तर' || selectedLevel === 'खंड/नगर स्तर' || selectedLevel === 'शाखा स्तर') && position === 'prant';
    // 2. Jila is needed for Jila level and below, and only if Vibhag is selected
    const showJila =
      showVibhag && selectedVibhag !== 'विभाग चुने' && (selectedLevel === 'जिला स्तर' || selectedLevel === 'खंड/नगर स्तर' || selectedLevel === 'शाखा स्तर');
    // 3. Khand is needed for Khand level and below, and only if Jila is selected
    const showKhand = showJila && selectedJila !== 'जिला चुने' && (selectedLevel === 'खंड/नगर स्तर' || selectedLevel === 'शाखा स्तर');
    // 4. Mandal, Gram, and Shakha are ONLY needed for Shakha level
    const showMandal = showKhand && selectedKhand !== 'खंड/नगर चुने' && selectedLevel === 'शाखा स्तर';
    const showGram = showMandal && selectedMandal !== 'मंडल/बस्ती चुने' && selectedLevel === 'शाखा स्तर';
    const showShakha = showGram && selectedGram !== 'ग्राम चुने' && selectedLevel === 'शाखा स्तर';

    // console.log(`
    //   showVibhag ${showVibhag},
    //   showJila ${showJila},
    //   showKhand ${showKhand},
    //   showMandal ${showMandal},
    //   showGram ${showGram},
    //   showShakha ${showShakha},
    //   `)
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
                        const selectedGramObject = gramOptions.find(g => g.ETCode === itemValue);
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
                      <Picker.Item key={g.ETCode} label={g.Gram} value={g.ETCode} />
                    ))}

                  </Picker>
                </View>
              )}

              {showShakha && (
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={selectedShakha.name} onValueChange={(itemValue, itemIndex) => setSelectedShakha({ id: shakhaOptions[itemIndex - 1]?.id, name: itemValue })}>
                    <Picker.Item label="शाखा चुने" value="शाखा चुने" />
                    {shakhaOptions.map(s => <Picker.Item key={s.id} label={s.ShakhaName + "," + s.SubCategory + " " + s.ShakhaCategory} value={s.ShakhaName + "," + s.SubCategory + " " + s.ShakhaCategory} />)}
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
              <TextInput style={styles.input} value={formData.VyavsayVivran} onChangeText={val => handleInputChange('VyavsayVivran', val)} placeholder='व्यवसाय का विस्तृत विवरण भरें ' />

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

  // --- Handler function to save address from the modal to the main form state ---
  const handleAddressUpdate = () => {
    // Find the readable name for Mandal from the selected code
    const mandalObject = mandalOptions.find(m => m.MandalCodeComplete === selectedAddressMandal);

    // Basic Validation
    if (selectedAddressVibhag === 'विभाग चुने' || selectedAddressJila === 'जिला चुने' || selectedAddressKhand === 'खंड/नगर चुने' || !mandalObject || selectedAddressGram === 'ग्राम चुने') {
      showErrorToast('कृपया सभी क्षेत्र चुनें');
      return;
    }
    if (!localFullAddress.trim()) {
      showErrorToast('कृपया पूरा पता दर्ज करें');
      return;
    }
    if (!localPinCode.trim() || localPinCode.length !== 6) {
      showErrorToast('कृपया 6 अंकों का पिनकोड दर्ज करें');
      return;
    }

    // Update the main formData state
    handleInputChange('AddressPrant', currentUser.PositionName); // Assumes Prant is from user context
    handleInputChange('AddressVibhag', selectedAddressVibhag);
    handleInputChange('AddressJila', selectedAddressJila);
    handleInputChange('AddressKhand', selectedAddressKhand);
    handleInputChange('AddressMandal', mandalObject.Mandle); // Save the readable name
    handleInputChange('AddressGram', selectedAddressGram);
    handleInputChange('FullAddress', localFullAddress);
    handleInputChange('PinCode', localPinCode);

    setAddressModalVisible(false);
    showSuccessToast('पता अपडेट किया गया');
  };

  // --- Render function for the NEW Address Modal ---
  const renderAddressModal = () => {
    // Conditions for showing each picker sequentially
    const showJila = selectedAddressVibhag !== 'विभाग चुने';
    const showKhand = showJila && selectedAddressJila !== 'जिला चुने';
    const showMandal = showKhand && selectedAddressKhand !== 'खंड/नगर चुने';
    const showGram = showMandal && selectedAddressMandal !== 'मंडल/बस्ती चुने';
    const showAddressInputs = showGram && selectedAddressGram !== 'ग्राम चुने';

    return (
      <Modal visible={addressModalVisible} transparent animationType="slide" onRequestClose={() => setAddressModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxHeight: '80%' }]}>
            <Text style={styles.modalTitle}>पता दर्ज करें</Text>
            <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingHorizontal: 5 }}>
              {/* Vibhag Picker */}
              <View style={styles.pickerContainer}>
                <Picker selectedValue={selectedAddressVibhag} onValueChange={itemValue => setSelectedAddressVibhag(itemValue)}>
                  <Picker.Item label="विभाग चुने" value="विभाग चुने" />
                  {vibhagOptions.map(v => <Picker.Item key={v.id} label={v.placename} value={v.placename} />)}
                </Picker>
              </View>

              {/* Jila Picker */}
              {showJila && (
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={selectedAddressJila} onValueChange={itemValue => setSelectedAddressJila(itemValue)}>
                    <Picker.Item label="जिला चुने" value="जिला चुने" />
                    {jilaOptions.map(j => <Picker.Item key={j.id} label={j.placename} value={j.placename} />)}
                  </Picker>
                </View>
              )}

              {/* Khand Picker */}
              {showKhand && (
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={selectedAddressKhand} onValueChange={itemValue => setSelectedAddressKhand(itemValue)}>
                    <Picker.Item label="खंड/नगर चुने" value="खंड/नगर चुने" />
                    {khandOptions.map(k => <Picker.Item key={k.id} label={k.Khand} value={k.Khand} />)}
                  </Picker>
                </View>
              )}

              {/* Mandal Picker */}
              {showMandal && (
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={selectedAddressMandal} onValueChange={itemValue => setSelectedAddressMandal(itemValue)}>
                    <Picker.Item label="मंडल/बस्ती चुने" value="मंडल/बस्ती चुने" />
                    {mandalOptions.map(m => <Picker.Item key={m.id} label={m.Mandle} value={m.MandalCodeComplete} />)}
                  </Picker>
                </View>
              )}

              {/* Gram Picker */}
              {showGram && (
                <View style={styles.pickerContainer}>
                  <Picker selectedValue={selectedAddressGram} onValueChange={itemValue => setSelectedAddressGram(itemValue)}>
                    <Picker.Item label="ग्राम चुने" value="ग्राम चुने" />
                    {gramOptions.map(g => <Picker.Item key={g.EtCode} label={g.Gram} value={g.Gram} />)}
                  </Picker>
                </View>
              )}

              {/* Address and Pincode Inputs */}
              {showAddressInputs && (
                <>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="कृपया अपना पूरा पता दर्ज करे"
                    value={localFullAddress}
                    onChangeText={setLocalFullAddress}
                  />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="कृपया अपना पिनकोड दर्ज करे"
                    value={localPinCode}
                    onChangeText={setLocalPinCode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </>
              )}

              {isLoading && <ActivityIndicator style={{ marginVertical: 10 }} size="small" color={Colors.bg_safron} />}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.modalCancel]} onPress={() => setAddressModalVisible(false)}>
                <Text style={styles.modalCancelText}>रद्द करें</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddressUpdate}>
                <Text style={styles.modalButtonText}>ओके</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // --- RENDER FUNCTIONS FOR CLEANER CODE ---
  const renderContactInfoForm = () => (
    <View style={[styles.formSection, styles.samparkitSection]} >
      <Text style={styles.sectionTitle}>सम्पर्कित जानकारी</Text>

      <Text style={styles.label}>* संपर्क की दिनांक </Text>
      <TextInput style={styles.input} value={formData.SamparkDate} editable={false} />

      <Text style={styles.label}>* संपर्क करने वाले कार्यकर्ता का नाम</Text>
      <TextInput style={styles.input} value={formData.SamparkKarneValeKaryakartaName} editable={false} />
      {/* SamparkKarneValeKaryakartaName: '', */}
      <Text style={styles.label}>* संपर्क के दौरान चर्चा के विषय का संक्षिप्त विवरण</Text>
      <TextInput style={[styles.input,]} multiline value={formData.CharchaVivran} onChangeText={val => handleInputChange('CharchaVivran', val)} />

      <Text style={styles.label}>साहित्य/पुस्तक भेंट का विवरण</Text>
      <TextInput style={[styles.input, {}]} multiline value={formData.ShahityaBookVivran} onChangeText={val => handleInputChange('ShahityaBookVivran', val)} />

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

      {/* ---Toli Member Section --- */}
      <View style={styles.toliContainer}>
        <Text style={styles.label}>टोली सदस्य</Text>
        {toliMembers.length < 3 && (
          <TouchableOpacity onPress={addToliMember}>
            <MaterialIcons name="add-circle" size={24} color={Colors.bg_safron} />
          </TouchableOpacity>
        )}
      </View>
      {toliMembers.map((member, index) => (
        <View key={index} style={styles.toliMemberCard}>
          <View style={styles.toliCardHeader}>
            <Text style={styles.toliCardTitle}>टोली सदस्य ({toliMemberTitles[index]})</Text>
            <TouchableOpacity onPress={() => removeToliMember(index)}>
              <MaterialIcons name="close" size={24} color={Colors.bg_safron} />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="मोबाइल नंबर"
            keyboardType="phone-pad"
            maxLength={10}
            value={member.mobile}
            onChangeText={(text) => handleToliMemberChange(text, index)}
          />
          {member.status === 'checking' && <ActivityIndicator size="small" style={{ marginVertical: 10, color: Colors.bg_safron }} />}
          {
            (member.status === 'found' || member.name) && (
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={member.name}
                editable={false}
                placeholder='name'
              />
            )
          }
        </View>
      ))}
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
            {formData.VyavsayCategory + " " + formData.VyavsayVivran || 'व्यवसाय चुनें'}
          </Text>
        </TouchableOpacity>

        {/* विशेष योग्यता- plain text */}
        <Text style={styles.label}>विशेष योग्यता</Text>
        <TextInput style={[styles.input]} multiline value={formData.ViseshYogyata} onChangeText={val => handleInputChange('ViseshYogyata', val)} />


        {/* <Text style={styles.label}>* संपर्क सूची का स्तर</Text>
        <TextInput style={styles.input} placeholder="स्तर चुने" value={formData.contactLevel} onChangeText={val => handleInputChange('contactLevel', val)} /> */}
        <Text style={styles.label}>* संपर्क सूची का स्तर</Text>
        {/* In renderPersonalInfoForm, update the TouchableOpacity to show the display text */}
        <TouchableOpacity style={styles.input} onPress={() => setContactLevelModalVisible(true)}>
          <Text style={{ color: formData.contactLevelDisplay ? '#000' : '#999' }}>
            {formData.contactLevelDisplay || 'स्तर चुने'}
          </Text>
        </TouchableOpacity>

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
        {/* --- THIS is CONDITIONAL PICKER for ShrediVargikaran --- */}
        {subCategoryOptions.length > 0 && (
          <>
            <Text style={styles.label}>* उपश्रेणी वर्गीकरण</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.UpShrediVargikaran}
                onValueChange={val => handleInputChange('UpShrediVargikaran', val)}
              >
                {subCategoryOptions.map(opt => (
                  <Picker.Item key={opt} label={opt} value={opt} />
                ))}
              </Picker>
            </View>
          </>
        )}

        {/* dropdown data from  api  */}
        <Text style={styles.label}>* पता पिन कोड सहित </Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center', minHeight: 50 }]}
          onPress={() => setAddressModalVisible(true)}
        >
          <Text style={{ color: formData.FullAddress ? '#000' : '#999' }} numberOfLines={3}>
            {formData.FullAddress && formData.PinCode
              ? `${formData.FullAddress}, ${formData.AddressGram}, ${formData.AddressMandal}, ${formData.AddressKhand} - ${formData.PinCode}`
              : 'पता दर्ज करने के लिए यहां टैप करें'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>क्या आप संपर्क की जानकारी भरना चाहते है?</Text>
        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setShowContactInfo(!showContactInfo)}>

          <MaterialIcons name={showContactInfo ? 'check-box' : 'check-box-outline-blank'} size={24} color={Colors.bg_safron} />
          <Text style={styles.checkboxLabel}>हाँ</Text>
        </TouchableOpacity>

        {renderContactLevelModal()}
        {renderVyasayModal()}
        {renderAddressModal()}
      </View>
    </>
  );

  return (
    <>
      <Modal animationType="slide" visible={visible} onRequestClose={onClose} >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="arrow-back" size={30} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={2}>राष्ट्रीय स्वयंसेवक संघ अखिल भारतीय {"\n"} संपर्क विभाग</Text>
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
  safeArea: {
    flex: 1,
    // backgroundColor: Colors.bg_safron ,
    backgroundColor: 'transparent'

  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: Colors.bg_safron },
  headerTitle: { color: Colors.white, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  scrollContainer: { padding: 15, backgroundColor: Colors.bg_safron },
  card: { backgroundColor: 'white', borderRadius: 15, padding: 20, marginBottom: 50 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 30, paddingHorizontal: 15, marginBottom: 20,
    backgroundColor: '#d9d6d6db'
  },
  inputIcon: { marginRight: 10 },
  mobileInput: { flex: 1, height: 50, fontSize: 16 },
  sectionTitle: { textAlign: "center", fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  formSection: { marginBottom: 4, marginTop: 2 },
  samparkitSection: { marginTop: 10 },
  label: { fontSize: 16, fontWeight: '500', color: "black", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', backgroundColor: '#d9d6d6db', borderRadius: 25, padding: 12, fontSize: 16, marginBottom: 15 },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', backgroundColor: '#d9d6d6db', borderRadius: 25, marginBottom: 15, paddingHorizontal: 10 },
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
  toliContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toliMemberCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.bg_safron,
    padding: 15,
    marginBottom: 15,
  },
  toliCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    textAlign: "center"
  },
  toliCardTitle: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  disabledInput: {
    backgroundColor: '#f0e9e9', // A slightly different background for the name
    color: '#333', // Darker text for readability
  }

});

export default AddSamparkitModal;


