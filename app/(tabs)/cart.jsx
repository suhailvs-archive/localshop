import { View, Text } from "react-native";
import { TextInput, List, Button } from "react-native-paper";
import { StyleSheet } from "react-native";

export default function CartScreen() {
  const unit = 'in kg';

  const handleBuyNow = () => {
    // Navigate to payment screen
    // navigation.navigate("Checkout", { product });
    // router.push({ pathname: 'screens/sendmoney/amount', params:{'id':product.user.id, 'username':product.user.username, 'first_name':product.user.first_name} })
  };
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

      {/* Buy Now Buttons */}
      <Button
        mode="contained"
        onPress={handleBuyNow}
        style={styles.buyNowButton}
        labelStyle={styles.buttonText}
      >
        Buy Now
      </Button>
                
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
  buyNowButton: {
    marginVertical: 10,
    borderRadius: 8,
    paddingVertical: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});