import { View, FlatList } from "react-native";
import { Button, Text, Divider, List } from 'react-native-paper';
import { useSession } from "@/login_extras/ctx";
import { useEffect, useState } from 'react';
import SkeletonLoader from "@/components/SkeletonLoader";
import api from '@/constants/api'
import globalStyles from "@/components/Styles"; 

export default function AccountScreen() {
  const { signOut } = useSession();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchData();   // reload data
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <View style={[globalStyles.container,{paddingTop:20}]}>
      <Text variant="headlineMedium">Account</Text>
      <View style={{padding:40}}><Button mode="contained" onPress={signOut}>Logout</Button></View>
      <Text variant="titleLarge">Orders</Text>
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
              <List.Accordion
                title={formatDate(item.created_at)}
                description={`Total: ₹${item.total}, Status: ${item.status}`}
                left={props => <List.Icon {...props} color={item.status=='delivered' ? "green" : "red"} icon="information-outline" />}
              >
                {item.items.map((orderitem, j) => (
                  <List.Item
                    key={j}
                    title={orderitem.product}
                    description={`qty: ${orderitem.quantity}, ₹${orderitem.price}`}
                  />
                ))}
              </List.Accordion>
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={!loading && <Text variant="titleMedium">Order is Empty</Text>}
        />
      )}
    </View>
  )
};
