import { View, StyleSheet, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import api from '@/constants/api';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  List,
  Text,
  Button,
  Avatar,
  Card,
  Divider,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
import SkeletonLoader from '@/components/SkeletonLoader';
import UserAppBar from '@/components/UserAppBar';

const UserDetails = () => {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`/user/${id}/`);
      setData(response.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async () => {
    setError('');
    setVerifyLoading(true);
    try {
      const response = await api.post('/verifyuser/', {
        candidate_id: data.id,
        trust_score: '0.8',
      });
      router.replace({ pathname: 'screens/sendmoney/success',params: {name:first_name, amount:amount } });
    } catch (error) {
      if (error.response) {
        setError(JSON.stringify(error.response.data) || 'Invalid credentials');
      } else if (error.request) {
        setError('Network error. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <>
      <UserAppBar />
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <View>
            <SkeletonLoader width={100} height={20} />
            <SkeletonLoader width={200} height={15} />
            <SkeletonLoader width={250} height={15} />
          </View>
        ) : (
          <Card mode="outlined" style={styles.card}>
            <Card.Title
              title={data.username || 'User'}
              subtitle={`ID: ${data.id}`}
              left={(props) => <Avatar.Icon {...props} icon="account" />}
            />
            <Card.Content>
              
              <List.Item
                title="Phone"
                description={data.phone || '-'}
                left={(props) => <List.Icon {...props} icon="phone" />}
              />
              <List.Item
                title="Email"
                description={data.email || '-'}
                left={(props) => <List.Icon {...props} icon="email" />}
              />
              <List.Item
                title="Balance"
                description={`₹ ${data.balance ?? 0}`}
                left={(props) => <List.Icon {...props} icon="wallet" />}
              />
              <List.Item
                title="Date of Birth"
                description={data.date_of_birth || '-'}
                left={(props) => <List.Icon {...props} icon="calendar" />}
              />
              <List.Item
                title="Government ID"
                description={data.government_id || '-'}
                left={(props) => <List.Icon {...props} icon="card-account-details" />}
              />
              <List.Item
                title="Exchange"
                description={data.exchange || '-'}
                left={(props) => <List.Icon {...props} icon="swap-horizontal" />}
              />
              <List.Item
                title="Last Login"
                description={data.last_login || '-'}
                left={(props) => <List.Icon {...props} icon="clock" />}
              />

              <Divider style={{ marginVertical: 10 }} />

              {!data.is_active && (
                <Button
                  mode="contained"
                  onPress={handleVerifyUser}
                  loading={verifyLoading}
                  disabled={verifyLoading}
                >
                  {verifyLoading ? 'Verifying...' : 'Verify User'}
                </Button>
              )}
              {error ? <HelperText type="error">{error}</HelperText> : null}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </>
  );
};

export default UserDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f6f6f6',
    flexGrow: 1,
  },
  card: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});