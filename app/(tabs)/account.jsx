import { View,StyleSheet } from "react-native";
import { Button, Text  } from 'react-native-paper';
import { useSession } from "@/login_extras/ctx";
export default function TxnScreen (){
  const { signOut } = useSession();
  return (
    <View style={styles.container}>
      <Button onPress={signOut}>Logout</Button>
    </View>
  )};


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 50,
      backgroundColor: "#f8f8f8",
    },
  });