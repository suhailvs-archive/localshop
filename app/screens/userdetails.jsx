import { View, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react';
import api from '@/constants/api'
import { useLocalSearchParams,useRouter } from 'expo-router';
import { List,Text,Button } from 'react-native-paper';

import SkeletonLoader from "@/components/SkeletonLoader";
const UserDetails = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [verifyloading, setVerifyLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        const response = await api.get(`/user/${id}/`);
        setData(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  };
  const handleVerifyUser = async () => {

    // setError("");  // Clear previous errors
    setVerifyLoading(true);
    try {
      const response = await api.post('/verifyuser/',{
        candidate_id: data.id,
        trust_score: '0.8',
      });
      router.replace({ pathname: 'screens/sendmoney/success',params: {name:first_name, amount:amount } });
    } catch (error) {
      if (error.response) {
        setError(JSON.stringify(error.response.data)|| "Invalid credentials");
      } else if (error.request) {
        setError("Network error. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }      
    } finally {
      setVerifyLoading(false);      
    }    
  }
  return (
    <View style={styles.container}>
      {loading ? (
        <View>
          <SkeletonLoader width={100} height={20} />
          <SkeletonLoader width={200} height={15} />
          <SkeletonLoader width={250} height={15} />
        </View>
      ) : (
        <View>
          <Text variant="headlineMedium">User Details</Text>
          <Text>{JSON.stringify(data)}</Text>
          <List.Item
            title="ID"
            description={data.id}
            left={props => <List.Icon {...props} icon="folder" />}
          />
          <List.Item
            title="Last Login"
            description={data.last_login}
            left={props => <List.Icon {...props} icon="folder" />}
          />
          <List.Item
            title="Username"
            description={data.username}
            left={props => <List.Icon {...props} icon="folder" />}
          />
          <List.Item
            title="Balance"
            description={data.balance}
            left={props => <List.Icon {...props} icon="folder" />}
          />
          <List.Item
            title="Government ID"
            description={data.government_id}
            left={props => <List.Icon {...props} icon="folder" />}
          />
          <List.Item
            title="Date of Birth"
            description={data.date_of_birth}
            left={props => <List.Icon {...props} icon="folder" />}
          />
          <List.Item
            title="Exchange"
            description={data.exchange}
            left={props => <List.Icon {...props} icon="folder" />}
          />
          {!data.is_active && 
            <Button style={{marginTop: 15}} onPress={() => handleVerifyUser()}  loading={verifyloading} disabled={verifyloading}
            mode="outlined">{verifyloading ? 'Loading...' : 'Verify User'}</Button>
          }

        </View>
      )}
    </View>
  )
}
// "government_id":"","":"2025-03-09","":1}'
export default UserDetails;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
});