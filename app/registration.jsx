import { useState,useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useRouter } from 'expo-router';
import { TextInput, Button, useTheme,Text} from "react-native-paper";
import api from '@/constants/api'
import ErrorMessage from "@/components/ErrorMessage";
import Logo from "@/components/Logo";
import Dropdown from "@/components/Dropdown";

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

  const [exchanges, setExchanges] = useState([]);


  useEffect(() => {
    fetchExchanges();
  }, []);

  const fetchExchanges = async () => {
    try {
      const response = await api.get('/ajax/?purpose=exchanges');
      setExchanges(response.data['data']);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        // setLoading(false);
    }
  };
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
    <ScrollView style={styles.container}>
      <Logo/>
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
        value={date_of_birth}
        onChangeText={setDateOfBirth}
        mode="outlined"
        style={styles.input}
      />
      <Dropdown
        label="Select Exchange"
        items={exchanges}
        onSelect={setExchange}
      />
      {/* <TextInput
        label="Exchange"
        value={exchange}
        onChangeText={setExchange}
        mode="outlined"
        style={styles.input}
      /> */}
      <ErrorMessage message={error} onClose={() => setError("")} />
      <Button style={{marginTop: 15}} mode="contained" onPress={handleRegistration} loading={loading} disabled={loading}>
        {loading ? 'Loading...' : 'Sign Up'}
      </Button>


      <Text variant="bodyLarge" style={{ textAlign: "center", marginTop:20 }}>I already have an account !</Text>
      <Button style={{marginTop: 15}} onPress={() => router.navigate('/login')} mode="outlined">Log In</Button>
      <Text></Text><Text></Text><Text></Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
});