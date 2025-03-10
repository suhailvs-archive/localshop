import { useEffect } from 'react';
import { useTheme } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Redirect, Tabs } from 'expo-router';
import { useSession } from "@/login_extras/ctx";
import { setupAxiosInterceptors } from "@/constants/api";
import SkeletonLoader from "@/components/SkeletonLoader";

export default function TabLayout() {
  const { session, isLoading, signOut } = useSession();  
  const theme = useTheme();
  useEffect(() => {
    setupAxiosInterceptors(signOut); // Pass signOut to Axios interceptor
  }, [signOut]);

  if (isLoading) {
    return <SkeletonLoader width={250} height={15} />;
  }
  if (!session) {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // tabBarStyle: {
        //   borderTopWidth: 1,
        //   borderTopColor: theme.colors.surfaceVariant, 
        //   height: 60,
        // },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarLabelStyle: {
          // fontSize: 12,
          // fontWeight: '600',
          paddingBottom: 5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Offerings',
          tabBarIcon: ({ color }) => <Icon name="cart" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="wants"
        options={{
          title: 'Wants',
          tabBarIcon: ({ color }) => <Icon name="shopping" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <Icon name="account-group" size={28} color={color} />,
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
