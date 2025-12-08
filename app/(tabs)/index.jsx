import { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Image, TouchableOpacity } from "react-native";
import { Text, List, Searchbar } from "react-native-paper";
import { useRouter } from "expo-router";
import SkeletonLoader from "@/components/SkeletonLoader";
import globalStyles from "@/components/Styles"; 
import api from "@/constants/api"; 
import Toast from 'react-native-toast-message';
export default function HomeScreen (){
  const [page, setPage] = useState(1);
  const [totalproducts, setTotalProducts] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addToCartLoading, setaddToCartLoading] = useState(false);
  
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  useEffect(() => {
    fetchData(1);
  }, []);

  const fetchData = async (pageNumber = page) => {
    if (loading || refreshing || !hasNext) return;
    setLoading(true);
    try {
        const res = await api.get(`/products/?page=${pageNumber}`);
        if (pageNumber === 1) {
          setData(res.data.results);
        } else {
          setData(prev => [...prev, ...res.data.results]);
        }
        setTotalProducts(res.data.count);
        if (res.data.next) {
          setPage(pageNumber + 1);
        } else {
          setHasNext(false);   // last page reached
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    try {      
      const res = await api.get(`/products/?page=1`);
      setData(res.data.results);
      setPage(2);                   // next page is 2
      setHasNext(!!res.data.next);  // true if next exists
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };
  const addToCart = async (itemid) => {
    setaddToCartLoading(true);
    try {
      await api.post('/cart/', {product:itemid,quantity:1});
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      Toast.show({type: 'success',text1: 'Success:',
        text2: 'Item Added to Cart.👋'});
      setaddToCartLoading(false);
    }   
  };
  const renderItem = ({ item }) => (
      <List.Item
        title={item.category}
        description={() => (
          <View style={{flexGrow: 1}}>
            <Text variant="bodyMedium">{item.title}</Text>
            <Text variant="bodySmall" style={styles.rating}>{item.price}</Text>
          </View>
        )}
        left={() => 
          // <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
          <Image source={{ uri: item.image }} style={styles.productImage} />
        }
        right={() => (
          <TouchableOpacity 
            onPress={() => !addToCartLoading && addToCart(item.id)}
            disabled={addToCartLoading}    
            style={{
              opacity: addToCartLoading ? 0.4 : 1,
              padding: 10,      // 👈 increases touch area
              marginRight: 5,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <List.Icon icon="plus" />
          </TouchableOpacity>
        )}
        style={styles.listItem}
        onPress={() => router.push({ pathname: 'screens/product_details', params:{'id':item.id, 'category':item.category}})}
      />
    );

  return (
    <View style={[globalStyles.container,{paddingTop:20}]}>
      <Text variant="headlineMedium">Home</Text>
      <Searchbar
        placeholder="Search"
        style={styles.searchBar}
        icon="magnify"
      />
      <Text>Total Products: {totalproducts}</Text>
      {/* Product Listing */}      
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={() => fetchData(page)}
        onEndReachedThreshold={0.2}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={loading ? <SkeletonLoader width={100} height={20} /> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  listItem: {
    margin:5,
    backgroundColor: "#fff",
  },
  
  productImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  loader: {
    marginTop: 20,
  },
});