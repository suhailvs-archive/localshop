import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useSession } from '@/login_extras/ctx';
import { useRouter } from 'expo-router';
import { Card, Button } from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AccountBalance from '@/components/AccountBalance';
import globalStyles from '@/components/Styles';

export default function HomeScreen() {
  const { signOut } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => signOut() },
    ]);
  };

  

  return (
    <View style={globalStyles.container}>
      {/* Account Balance */}
      <AccountBalance />

      {/* Quick Actions */}
      <Card>
        <Card.Content style={styles.actionsContainer}>
          <Button
            mode="contained-tonal"
            icon={({ size, color }) => (
              <MaterialCommunityIcons name="logout" size={size} color={color} />
            )}
            onPress={handleLogout}
          >
            Logout
          </Button>

          <Button
            mode="contained-tonal"
            icon={({ size, color }) => (
              <Ionicons name="send" size={size} color={color} />
            )}
            onPress={() => router.push({ pathname: '/(tabs)/home/contacts' })}
          >
            Send Money
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({  
  actionsContainer: {flexDirection: 'row',justifyContent: 'space-around'}
});

