
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Redirect, Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
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
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <Icon name="file-document" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
