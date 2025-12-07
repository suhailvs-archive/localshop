import { useEffect, useState } from 'react';
import { Divider, Text } from 'react-native-paper';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet, Linking} from "react-native";
import { useRouter, useLocalSearchParams } from 'expo-router';
import SkeletonLoader from "@/components/SkeletonLoader";
import api from '@/constants/api'

const ProductDetailPage = ( ) => {
  const { id, category } = useLocalSearchParams(); // Get passed data
  const router = useRouter();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  // let userdata;
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
      try {
          const response = await api.get(`/products/${id}/`);
          setProduct(response.data);
      } catch (error) {
          console.error('Error fetching data:', error);
      } finally {
          setLoading(false);
      }
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View>
          <SkeletonLoader width={100} height={20} />
          <SkeletonLoader width={200} height={15} />
          <SkeletonLoader width={250} height={15} />
        </View>
      ) : (
        <View>
          {/* Product Title */}
          <Text style={styles.productTitle}>{product.title}</Text>
          
          {/* Product Image   */}
          {product.image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
            </View>
          )}
          <Text style={styles.productPrice}>Price: {product.price} ₹</Text>
          <Divider />
          {/* Product Description */}
          <Text style={styles.productPrice}>Description:</Text>      
          <Text>{product.description}</Text>
          {/* These 3 text boxes are to add some margin Bottom */}
          <Text></Text><Text></Text><Text></Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  imageContainer: { alignItems: "center", margin: 20 },
  productImage: {
    width: 260,
    height: 260,
    resizeMode: "contain",
  },  
  productTitle: { fontSize: 24, fontWeight: "bold", color: "#232F3E", marginTop: 10, borderBottomWidth: 1, borderBottomColor: "#ddd"},
  productPrice: { fontSize: 20, marginTop: 10 },  
});

export default ProductDetailPage;