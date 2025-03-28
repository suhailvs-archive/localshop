import { useState } from 'react';
import { StyleSheet, View } from "react-native";
import { TextInput, Button, ActivityIndicator, useTheme,Text} from "react-native-paper";
import { useSession } from "@/login_extras/ctx";

export default function Login() {
  const { signIn } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme(); // Get Paper Theme Colors 

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    setError("");  // Clear previous errors
    setLoading(true);
    
    try {
      const userData = await signIn(username, password);      
    } catch (err) {
      setError(err.message); // Show error message
    } finally {
      setLoading(false);
    }
  };

  return (
  <View style={styles.container}>
    <Text variant="headlineMedium" style={{ color: theme.colors.primary, textAlign: "center", marginBottom:20 }}>
        Login to LETS
    </Text>
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

    {error ? <Button textColor="red">{error}</Button> : null}

    {loading ? (
      <ActivityIndicator animating={true} size="large" style={styles.loader} />
    ) : (
      <Button mode="contained" onPress={handleLogin} style={styles.button} disabled={loading}>
        Login
      </Button>
    )}
  </View>
  );
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
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});