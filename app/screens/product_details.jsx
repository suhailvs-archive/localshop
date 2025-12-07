import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Linking} from "react-native";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from 'react-native-paper';
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

  
  const handleBuyNow = () => {
    // Navigate to payment screen
    // navigation.navigate("Checkout", { product });
    // router.push({ pathname: 'screens/sendmoney/amount', params:{'id':product.user.id, 'username':product.user.username, 'first_name':product.user.first_name} })
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
          {/* Product Title and Price */}
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productPrice}>{product.price} ₹</Text>
          {/* Product Image   */}
          {product.image && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
            </View>
          )}
          
          
          {/* Product Description */}          
          <Text>{product.description}</Text>


          {/* Buy Now Buttons */}
          <Button
            mode="contained"
            onPress={handleBuyNow}
            style={styles.buyNowButton}
            labelStyle={styles.buttonText}
          >
            Buy Now
          </Button>
          
          {/* These 3 text boxes are to add some margin Bottom */}
          <Text></Text><Text></Text><Text></Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  imageContainer: { alignItems: "center", marginBottom: 20 },
  productImage: { width: "100%", height: 300, borderRadius: 10 },
  productTitle: { fontSize: 24, fontWeight: "bold", color: "#232F3E", marginTop: 10, borderBottomWidth: 1, borderBottomColor: "#ddd"},
  productPrice: { fontSize: 20, marginTop: 10 },
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

export default ProductDetailPage;