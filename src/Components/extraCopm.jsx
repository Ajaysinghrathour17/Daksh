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