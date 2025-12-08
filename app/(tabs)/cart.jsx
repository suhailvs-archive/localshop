import { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { Text,TextInput, List, Button } from "react-native-paper";
import api from "@/constants/api"; 
export default function CartScreen() {
  const [cart_total, setCartTotal] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading_btn, setButtonLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  },[]);

  const fetchData = async () => {
    try {
        const response = await api.get('/cart/');
        setData(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  };
  // Handle Qty Change
  const OtyChange = async (cartid,qty) => {
    if (!qty) {
      return;
    }
    setButtonLoading(true);
    try {
      const response = await api.patch(`/cart/${cartid}/`, {quantity:qty});
      setCartTotal(response.data['cart_total']);
    } catch (error) {
      console.error(error.response?.data || error);
    } finally {
      console.log('item quantity changed.');
      // start of very bad change
      // ========================
      // this is to fix while quantity change, get whole cart items from backend
      fetchData(); 
      // ------------------------
      // end of very bad change
      setButtonLoading(false);
    }   
  };
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchData();   // reload data
    } finally {
      setRefreshing(false);
    }
  };

  const handleBuyNow = async () => {
    setButtonLoading(true);
    try {
      await api.post('/orders/');
      router.replace({ pathname: 'screens/order_success',params: {amount:cart_total } });
    } catch (error) {
      console.error(error);
    } finally {
      setButtonLoading(false);      
    }    
  };
  const renderItem = ({ item }) => (
    <List.Item
      title={`#${item.id} ${item.product_title}`}
      description={() => (
        <View style={{ flexGrow: 1 }}>
          <Text>{item.product_price} ₹</Text>
        </View>
      )}
      right={() => (
        <TextInput
          label={`qty in ${item.product_unit}`}
          mode="outlined"
          placeholder="0"
          keyboardType="numeric"
          onChangeText={(newText) => OtyChange(item.id,newText)}
          defaultValue={item.quantity.toString()}
          style={{ width: 80, marginRight: 10 }}
        />
      )}
      style={styles.listItem}
    />
  );
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Cart</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContainer}
      />
      {/* Buy Now Buttons */}
      <Button
        mode="contained"
        onPress={handleBuyNow}
        style={styles.buyNowButton}
        labelStyle={styles.buttonText}
        loading={loading_btn} 
        disabled={loading_btn}
      >{loading ? 'Loading...' : `Buy Now(${cart_total} ₹)`}</Button>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 80,
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