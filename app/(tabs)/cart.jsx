import { View, Text } from "react-native";
import { TextInput, List, Searchbar } from "react-native-paper";
import { StyleSheet } from "react-native";

export default function CartScreen() {
  const unit = 'in kg';
  return (
    <View style={styles.container}>
      <List.Item
        title="1. Amount"
        description={() => (
          <View style={{ flexGrow: 1 }}>
            <Text>description</Text>
          </View>
        )}
        right={() => (
          <TextInput
          label={unit}
            mode="outlined"
            placeholder="0"
            keyboardType="numeric"
            style={{ width: 80, marginRight: 10 }}
          />
        )}
        style={styles.listItem}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  listItem: {
    margin:5,
    backgroundColor: "#fff",
  },
});