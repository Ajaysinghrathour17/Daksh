 {/* Contact Level Modal */}
      {/* <Modal visible={contactLevelModalVisible} transparent animationType="slide" onRequestClose={() => setContactLevelModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>संपर्क सूची का स्तर</Text>
            <View style={{maxHeight: 320, width: '100%'}}>
              <ScrollView>
                {levelOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.modalOption, formData.contactLevel === opt && styles.modalOptionSelected]}
                    onPress={() => {
                      handleInputChange('SamparkSuchiSthar', opt);
                      setContactLevelModalVisible(false);
                    }}
                  >
                    <Text style={[styles.modalOptionText, formData.contactLevel === opt && styles.modalOptionTextSelected]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setContactLevelModalVisible(false)}>
                <Text style={styles.modalCancelText}>रद्द करें</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}



        // const handleSave = async () => {
        //   setIsSaving(true);
        //   try {
        //     if (userStatus === 'newUser') {
        //       // --- Scenario 1: Create a New User ---
        //       const personPayload = new FormData();
        //       // Append all required fields for InsertSamparkVyakti
        //       Object.keys(formData).forEach(key => {
        //         personPayload.append(key, formData[key]);
        //       });
        //       personPayload.append('mobileNo', mobileNumber);
      
        //       console.log("Saving new person with payload:", formData);
        //       const personResponse = await fetch(`${DAKSH_API}/api/Gram/InsertSamparkVyakti`, {
        //         method: 'POST',
        //         headers: {
        //           'Authorization': `Bearer ${token}`,
        //           'Content-Type': 'application/json',
      
        //         },
        //         body: personPayload,
        //       });
        //      console.log(personResponse)
      
        //       const personResult = await personResponse.json();
        //       if (!personResponse.ok || !personResult.Data || personResult.Data.length === 0) {
        //         throw new Error(personResult.Message || "Failed to create new person.");
        //       }
      
        //       const newUserId = personResult.Data[0].output; // Get the ID of the new user
      
        //       // If contact info is also to be added, make the second API call
        //       if (showContactInfo) {
        //         await saveContactDetails(newUserId);
        //       }
        //     } else if (userStatus === 'exists') {
        //       // --- Scenario 2: Add Contact Details to Existing User ---
        //       await saveContactDetails(existingUserData.Id);
        //     }
        //     Alert.alert("Success", "Data saved successfully!");
        //     onSave();
        //     resetForm();
      
        //   } catch (error) {
        //     console.error("Failed to save data:", error);
        //     Alert.alert("Error", error.message || "An error occurred while saving.");
        //   } finally {
        //     setIsSaving(false);
        //   }
        // };
      
        // REPLACE your entire handleSave function with this corrected version
      
      // const handleSave = async () => {
      //     setIsSaving(true);
      //     try {
      //         if (userStatus === 'newUser') {
      //             // --- Scenario 1: Create a New User ---
      
      //             // 1. Create a simple JavaScript object with all the data
      //             const payload = {
      //                 ...formData,
      //                 mobileNo: mobileNumber
      //             };
      //             console.log("Saving new person with JSON payload:", payload);
      //             const personResponse = await fetch(`${DAKSH_API}/api/Gram/InsertSamparkVyakti`, {
      //                 method: 'POST',
      //                 headers: {
      //                     'Authorization': `Bearer ${token}`,
      //                     'Content-Type': 'application/json', // This header now matches the body
      //                 },
      //                 // 2. Stringify the object to create a valid JSON body
      //                 body: JSON.stringify(payload),
      //             });
      
      //             const personResult = await personResponse.json();
      //             if (!personResponse.ok || !personResult.Data || personResult.Data.length === 0) {
      //                 throw new Error(personResult.Message || "Failed to create new person.");
      //             }
      
      //             const newUserId = personResult.Data[0].output;
      
      //             if (showContactInfo) {
      //                 await saveContactDetails(newUserId);
      //             }
      //         } else if (userStatus === 'exists') {
      //             // --- Scenario 2: Add Contact Details to Existing User ---
      //             await saveContactDetails(existingUserData.Id);
      //         }
      
      //         Alert.alert("Success", "Data saved successfully!");
      //         onSave();
      //         // resetForm(); // You may want to call your reset function here
      
      //     } catch (error) {
      //         console.error("Failed to save data:", error);
      //         Alert.alert("Error", error.message || "An error occurred while saving.");
      //     } finally {
      //         setIsSaving(false);
      //     }
      // };
      
        // const saveContactDetails = async (userId) => {
        //   const detailsPayload = new FormData();
        //   detailsPayload.append('Id', userId);
        //   detailsPayload.append('SamparkDate', formData.SamparkDate);
        //   detailsPayload.append('SamparkKarneValeKaryakartaName', formData.SamparkKarneValeKaryakartaName);
        //   detailsPayload.append('SamparkKarneWaleKaryakartaNumber', formData.SamparkKarneWaleKaryakartaNumber);
        //   detailsPayload.append('CharchaVivran', formData.CharchaVivran);
        //   detailsPayload.append('ShahityaBookVivran', formData.ShahityaBookVivran);
        //   detailsPayload.append('CharchaKaisiRahi', formData.CharchaKaisiRahi);
        //   // Add Toli Sadasya details here if you implement that feature
      
        //   console.log("Saving contact details for User ID:", userId, detailsPayload);
        //   const detailsResponse = await fetch(`${DAKSH_API}/api/Gram/InsertSamparkVyaktiDetails`, {
        //     method: 'POST',
        //     headers: {
        //       'Authorization': `Bearer ${token}`,
        //       'Content-Type': 'application/json'
        //     },
        //     body: detailsPayload,
        //   });
      
        //   if (!detailsResponse.ok) {
        //     throw new Error("Failed to save contact details.");
        //   }
        // };
      
        // else if (selectedLevel === 'शाखा स्तर') {
    //   if (position === 'prant') {
    //     if (selectedVibhag === 'विभाग चुने') { showInfoToast("कृपया सही विभाग चुने"); return; }
    //     if (selectedJila === 'जिला चुने') { showInfoToast("कृपया सही जिला चुने"); return; }
    //     if (selectedKhand === 'खंड/नगर चुने') { showInfoToast("कृपया सही खंड/नगर चुने"); return; }
    //     if (selectedMandal === 'मंडल/बस्ती चुने') { showInfoToast("कृपया सही मंडल/बस्ती चुने"); return; }
    //     if (selectedGram === 'ग्राम चुने') { showInfoToast("कृपया सही ग्राम चुने"); return; }
    //     if (selectedShakha.name === 'शाखा चुने') { showInfoToast("कृपया सही शाखा चुने"); return; }

    //     updateData = {
    //       AddressPrant: positionName,
    //       AddressVibhag: selectedVibhag,
    //       AddressJila: selectedJila,
    //       AddressKhand: selectedKhand,
    //       AddressMandal: selectedMandal,
    //       AddressGram: selectedGram,
    //     };
    //     place = selectedShakha.id; // Place should be Shakha ID
    //     isValid = true;
    //   }
    //   // ... add else if for vibhag, jila, etc.
    // }