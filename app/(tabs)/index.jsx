import { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View, Image } from "react-native";
import { Text, List } from "react-native-paper";
import { useRouter } from "expo-router";
import SkeletonLoader from "@/components/SkeletonLoader";
import {useIsFocused} from '@react-navigation/native';

export default function HomeScreen (){
  const [page, setPage] = useState(1);
  const [data, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const router = useRouter();
  const getProductsList = async () => {
    try {
      const res = await fetch('https://dummyjson.com/products');
      const data = await res.json();

      if (Array.isArray(data.products) && data.products.length) {
        const updatedProducts = data.products.map((product) => {
          return {
            ...product,
            isFavorite: false,
          };
        });
        setProductList(updatedProducts);
      }
    } catch (error) {
      console.error('Failed to get products list!', error);
    }
  };

  useEffect(() => {
    getProductsList();
  }, [isFocused]);


  const renderItem = ({ item }) => (
      <List.Item
        title={item.category}
        description={() => (
          <View style={{flexGrow: 1}}>
            <Text variant="bodyMedium">{item.title}</Text>
            <Text variant="bodySmall" style={styles.rating}>{item.price}</Text>
          </View>
        )}
        left={() => <Image source={{ uri: item.thumbnail }} style={styles.productImage} />}
        style={styles.listItem}
        onPress={() => router.push({ pathname: 'screens/listing_details', params:{'id':item.id, 'category':item.category}})}
      />
    );

  return (
    <View style={styles.container}>
      {/* Product Listing */}
      
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        onEndReached={() => setPage(page + 1)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && <SkeletonLoader width={100} height={20} />}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  productImage: {
    width: 60,
    // height: 60,
  },
  loader: {
    marginTop: 20,
  },
});