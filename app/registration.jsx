import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from 'expo-router';
import { TextInput, Button, useTheme,Text} from "react-native-paper";
import api from '@/constants/api'
import ErrorMessage from "@/components/ErrorMessage";
export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [first_name, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [government_id, setGovernmentID] = useState('');
  const [date_of_birth, setDateOfBirth] = useState('');
  const [exchange, setExchange] = useState('');
  const [secureText, setSecureText] = useState(true);
  const theme = useTheme();
  const router = useRouter();
  const handleRegistration = async () => {
    if (!first_name || !username || !password  || !government_id || !date_of_birth || !exchange) {
      setError("Please fill all fields.");
      return;
    }
    setError("");  // Clear previous errors
    setLoading(true);
    let datas = {first_name,username,password,government_id,date_of_birth,exchange};
    try {
      await api.post('/registration/', datas);
      router.replace({ pathname: '/inactiveuser',params:{'username':username} });
    } catch (error) {
      setError(JSON.stringify(error.response?.data) || "Something went wrong.");
    } finally {
      setLoading(false);
    }   
  };
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={{ color: theme.colors.primary, textAlign: "center", marginBottom:20 }}>Sign up to LETS</Text>
      <TextInput
        label="First Name"
        value={first_name}
        onChangeText={setFirstName}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        secureTextEntry={secureText}
        mode="outlined"
        right={
            <TextInput.Icon
            icon={secureText ? "eye-off" : "eye"}
            onPress={() => setSecureText(!secureText)}
            />
        }
        style={styles.input}
      />
      <TextInput
        label="Government ID"
        value={government_id}
        onChangeText={setGovernmentID}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Date Of Birth(YYYY-MM-DD)"
        // value={date_of_birth}
        onChangeText={setDateOfBirth}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Exchange"
        value={exchange}
        onChangeText={setExchange}
        mode="outlined"
        style={styles.input}
      />
      <ErrorMessage message={error} onClose={() => setError("")} />
      <Button style={{marginTop: 15}} mode="contained" onPress={handleRegistration} loading={loading} disabled={loading}>
        {loading ? 'Loading...' : 'Sign Up'}
      </Button>


      <Text variant="bodyLarge" style={{ textAlign: "center", marginTop:20 }}>I already have an account !</Text>
      <Button style={{marginTop: 15}} onPress={() => router.navigate('/login')} mode="outlined">Log In</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
});