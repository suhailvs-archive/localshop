import { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Image, TouchableOpacity } from "react-native";
import { Text, List, Searchbar } from "react-native-paper";
import { useRouter } from "expo-router";
import SkeletonLoader from "@/components/SkeletonLoader";

import api from "@/constants/api"; 

export default function HomeScreen (){
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  useEffect(() => {
    fetchData(page === 1);
  }, [page]);

  const fetchData = async (reset = false) => {
    try {
        const response = await api.get(`/products/?page=${page}`);
        setData(prev => reset ? response.data.results : [...prev, ...response.data.results]);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  };
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      setPage(1);          // reset page if needed
      await fetchData();   // reload data
    } finally {
      setRefreshing(false);
    }
  };
  const addToCart = async (itemid) => {
    try {
      await api.post('/cart/', {product:itemid,quantity:1});
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      console.log('added to cart.');
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
          <TouchableOpacity onPress={() => addToCart(item.id)}>
            <List.Icon icon="plus" />
          </TouchableOpacity>
        )}
        style={styles.listItem}
        onPress={() => router.push({ pathname: 'screens/product_details', params:{'id':item.id, 'category':item.category}})}
      />
    );

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Home</Text>
      <Searchbar
        placeholder="Search"
        style={styles.searchBar}
        icon="magnify"
      />
      {/* Product Listing */}      
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={() => {if (!loading) {setPage(prev => prev + 1)}}}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={loading ? <SkeletonLoader width={100} height={20} /> : null}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
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
  
  productImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  loader: {
    marginTop: 20,
  },
});