import { useSession } from "@/login_extras/ctx";
import { View,  StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Text, Searchbar,Card, Button  } from 'react-native-paper';
import { useState } from 'react';

export default function Index() {
  const { signOut } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const handlePress = () => {
    alert('hi');
  };
  return (
    <ScrollView>
      <View style={styles.header}>
        <Text variant="labelLarge" style={styles.headerText}>Hi Suhail, welcome to KKDE exchange.</Text>
        <Text variant="headlineSmall" style={styles.headerText}>Your Balance is</Text>
        <Text variant="displayLarge" style={styles.headerText}>900 $</Text>        
      </View>
      <View style={styles.container}>
        <Card>
          <Card.Actions>
            <Button>Search</Button>
            <Button>Logout</Button>
            <Button>My Account</Button>
          </Card.Actions>
        </Card>
        {/* <Searchbar placeholder="Search by name/phonenumber" onChangeText={setSearchQuery} value={searchQuery}/> */}
        <Text variant="headlineSmall">People</Text>
        <View style={styles.peopleRow}>
          {['nuzra', 'suhail', 'sumayya', 'Salman', 'SHAKEER', 'naseer', 'Sreeshma'].map((name, i) => (
            <View style={styles.person} key={i}>
              <TouchableOpacity onPress={handlePress}>
              <Avatar.Image size={60} source={{uri:'https://avatars.githubusercontent.com/u/2777384'}} />
              <Text variant="bodyMedium" style={{ textAlign: 'center' }}>{name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  header: { backgroundColor: "#007C8A",paddingBottom: 30, paddingTop:80, paddingHorizontal: 10,position: "relative" },
  headerText: {color: "#99C9CE"},
  container: { flex: 1, backgroundColor:"#fff", padding:10 },
  peopleRow: { flexDirection: 'row', flexWrap: 'wrap' },
  person: { width: 70, alignItems: 'center', margin: 10 },
});
