import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native";

const Dropdown = ({
    label,
    items,
    style,
    onChange
}) => {
  const [selectedValue, setSelectedValue] = useState(`Select ${label}`);
  const [modalVisible, setModalVisible] = useState(false);

    //   const items = ["Electronics", "Fashion", "Home & Kitchen", "Sports"];

  const handleSelect = (value) => {
    setSelectedValue(value);
    onChange(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Dropdown Button */}
      <TouchableOpacity style={style} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>{selectedValue}</Text>
      </TouchableOpacity>

      {/* Modal for Dropdown Options */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={items}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)}>
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  
  dropdownText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 10,
    padding: 10,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
  },
});
