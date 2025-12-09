import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { StyleSheet, FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { Text,TextInput, List, Button } from "react-native-paper";
import api from "@/constants/api"; 
import SkeletonLoader from "@/components/SkeletonLoader";
import globalStyles from "@/components/Styles"; 
import Toast from 'react-native-toast-message';
export default function CartScreen() {
  const [cart_total, setCartTotal] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loading_btn, setButtonLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {fetchData();}
  }, [isFocused]);

  const fetchData = async () => {
    setLoading(true);
    try {
        const response = await api.get('/cart/');
        setData(response.data);
        const resp_cart_total = await api.get('/ajax_views/?purpose=cart_total');
        setCartTotal(resp_cart_total.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  };
  // Handle Qty Change
  const QtyChange = async (cartid,qty) => {
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
      Toast.show({type: 'success',visibilityTime:1000,text1: 'Success:',
              text2: 'Item Quantity Updated.👋'});
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
    if (data.length === 0) {return};
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
          onChangeText={(newText) => QtyChange(item.id,newText)}
          defaultValue={item.quantity.toString()}
          style={{ width: 80, marginRight: 10 }}
        />
      )}
      style={styles.listItem}
    />
  );
  return (
    <View style={[globalStyles.container,{padding:20}]}>
      <Text variant="headlineMedium">Cart</Text>
      {loading && (
        <View>
          <SkeletonLoader width={100} height={20} />
          <SkeletonLoader width={200} height={15} />
          <SkeletonLoader width={250} height={15} />
        </View>
      )}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={!loading && <Text variant="titleMedium">Cart is Empty</Text>}
      />
      {/* Buy Now Buttons */}
      <Button
        mode="contained"
        onPress={handleBuyNow}
        style={styles.buyNowButton}
        labelStyle={styles.buttonText}
        loading={loading_btn||loading} 
        disabled={loading_btn||loading}
      >{loading_btn||loading ? 'Loading...' : `Buy Now(${cart_total} ₹)`}</Button>
    </View>
  )
};

const styles = StyleSheet.create({
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