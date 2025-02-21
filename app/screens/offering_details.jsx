import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Modal, Button } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import SkeletonLoader from "@/components/SkeletonLoader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import api from '@/constants/api'


const OfferingDetailPage = ( ) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id, category } = useLocalSearchParams(); // Get passed data
  const product = {
    title: 'heading',
    description: "This is a sample product description.",
    price: "99.99",
    image: "https://m.media-amazon.com/images/I/41jGfc2vThS._SX522_.jpg",
    reviews: 120,
  };

  const [showZoom, setShowZoom] = useState(false);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
      try {
          const response = await api.get(`/api/v1/listings/${id}/`);
          setData(response.data);
      } catch (error) {
          console.error('Error fetching data:', error);
      } finally {
          setLoading(false);
      }
  };

  const handleAddToCart = () => {
    // Add to cart logic
    alert("Added to Cart!");
  };

  const handleBuyNow = () => {
    // Navigate to payment screen
    navigation.navigate("Checkout", { product });
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
          {/* Product Image   */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
          </View>
          {/* Product Title and Price */}
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.productPrice}>${data.rate}</Text>

          {/* Product Description */}
          <Text style={styles.productDescription}>{product.description}</Text>

          {/* Reviews */}
          <View style={styles.reviewsContainer}>
            <Icon name="star" size={20} color="#FF9900" />
            <Text style={styles.reviewsText}>{product.reviews} Reviews</Text>
          </View>

          {/* Add to Cart and Buy Now Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
              <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
          {/* Image Zoom Modal 
          <Modal visible={showZoom} transparent={true} onRequestClose={() => setShowZoom(false)}>
            <ZoomableImage
              imageUrls={[{ url: product.image }]}
              onCancel={() => setShowZoom(false)}
              enableSwipeDown={true}
              swipeDownThreshold={0.3}
            />
          </Modal>*/}
          </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  imageContainer: { alignItems: "center", marginBottom: 20 },
  productImage: { width: "100%", height: 300, borderRadius: 10 },
  productTitle: { fontSize: 24, fontWeight: "bold", color: "#232F3E", marginTop: 10 },
  productPrice: { fontSize: 20, color: "#FF9900", marginTop: 10 },
  productDescription: { fontSize: 16, color: "#555", marginTop: 10, lineHeight: 24 },
  reviewsContainer: { flexDirection: "row", alignItems: "center", marginTop: 15 },
  reviewsText: { fontSize: 16, color: "#555", marginLeft: 10 },
  buttonContainer: { marginTop: 20, flexDirection: "row", justifyContent: "space-between" },
  addToCartButton: { backgroundColor: "#232F3E", padding: 15, borderRadius: 8, width: "48%" },
  buyNowButton: { backgroundColor: "#FF9900", padding: 15, borderRadius: 8, width: "48%" },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center", fontWeight: "bold" },
});

export default OfferingDetailPage;