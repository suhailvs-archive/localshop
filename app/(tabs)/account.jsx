import { View, FlatList, StyleSheet } from "react-native";
import { Button, Text, Divider } from 'react-native-paper';
import { useSession } from "@/login_extras/ctx";
import { useEffect, useState } from 'react';
import SkeletonLoader from "@/components/SkeletonLoader";
import api from '@/constants/api'
import globalStyles from "@/components/Styles"; 

export default function AccountScreen() {
  const { signOut } = useSession();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/orders/');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  function formatDate(date, options = {}) {
    try {
      if (!date) return "";
      const parsedDate = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(parsedDate)) return 'Invalid date';
      const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      return new Intl.DateTimeFormat('en-US', {
        ...defaultOptions,
        ...options,
      }).format(parsedDate);
    } catch (err) {return 'Invalid date';}
  }

  return (
    <View style={[globalStyles.container,{padding:20}]}>
      <Text variant="headlineMedium">Account</Text>
      <Divider />
      <Button mode="contained" onPress={signOut}>Logout</Button>
      <Text variant="headlineMedium">Orders</Text>
      {loading ? (
        <View>
          <SkeletonLoader width={100} height={20} />
          <SkeletonLoader width={200} height={15} />
          <SkeletonLoader width={250} height={15} />
        </View>
      ) : (     
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderItem}>
              <Text variant="labelLarge" style={[item.status=='delivered' ? styles.positive : styles.negative]}>#{item.id} {item.status}</Text>
              <Text style={styles.orderAmount}>{item.total}₹</Text>
              <Text style={styles.orderDate}>{formatDate(item.created_at)}</Text>                
            </View>
          )}
        />
      )}
    </View>
  )
};


const styles = StyleSheet.create({
  orderItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  orderAmount: { fontSize: 16, fontWeight: "bold", position: "absolute", right: 10, top: 15 },
  orderDate: { fontSize: 12, color: "gray", marginTop: 2 },
  positive: { color: "green" },
  negative: { color: "red" },
});