import { View,StyleSheet } from "react-native";
import { Button, Text  } from 'react-native-paper';
import { useSession } from "@/login_extras/ctx";
export default function AccountScreen (){
  const { signOut } = useSession();
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Account</Text>
      <Button mode="contained" onPress={signOut}>Logout</Button>
    </View>
  )};


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#f8f8f8",
    },
  });