
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Redirect, Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2A4BA0',
        tabBarInactiveTintColor: '#B2BBCE',
        tabBarLabelStyle: {
          paddingBottom: 5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color }) => <Icon name="animation-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <Icon name="account-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <Icon name="cart" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
