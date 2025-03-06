import { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Image } from "react-native";
import Button from "@/components/Button";
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import api from '@/constants/api'
import ErrorMessage from "@/components/ErrorMessage";

const AddListingScreen = () => {
  // const [category, setCategory] = useState("");
  const [heading, setHeading] = useState("");
  const [details, setDetails] = useState("");
  const [rate, setRate] = useState("");
  const [image, setImage] = useState(null);
  const [loadingdetails, setLoadingDetails] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { category, ltype } = useLocalSearchParams();
  // Open Image Picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Handle Form Submission
  const handleSubmit = async () => {
    if (!category || !heading || !rate || !image) {
      alert("Please fill all required fields.");
      return;
    }
    console.log({ category, heading, details, rate, image });
    setError("");  // Clear previous errors
    setLoading(true);

    let formData = new FormData();
    formData.append("img", {uri: image,name: "upload.jpg",type: "image/jpeg"});
    formData.append("category", category);
    formData.append("heading", heading);
    formData.append("detail", details);
    formData.append("rate", rate);
    formData.append("listing_type", ltype);
    try {
      const response = await api.post('/api/v1/listings/',formData,{headers: { "Content-Type": "multipart/form-data" }});
      router.replace({ pathname: '/'});
    } catch (error) {
      if (error.response) {
        setError(JSON.stringify(error.response.data)|| "Invalid response");
      } else if (error.request) {
        setError("Network error. Please try again.");
      } else {
        console.log(error)
        setError("Something went wrong. Please try again.");
      }      
    } finally {
      setLoading(false);      
    }    
  };

  const handleGenerateDetail = async () => {
  // const handleGenerateDetail = () => {
    setLoadingDetails(true);
    let url = "https://shihas.stackschools.com/ajax/stackcoinai/"; 
    try {
      const response = await axios.get(`${url}?details=${heading}`);
      setDetails(response.data);
      // setDetails('When making a call to an API using Axios, you can pass a configuration object to Axios or invoke a method for the corresponding CRUD operation you want to perform. For example, you can make a GET request to the /api/users endpoint in one of the following two ways:')
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Listing</Text>

      {/* Category Picker 
      <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.input}>
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Electronics" value="electronics" />
        <Picker.Item label="Fashion" value="fashion" />
        <Picker.Item label="Home & Kitchen" value="home-kitchen" />
      </Picker>*/}

      {/* Heading Input */}
      <TextInput style={styles.input} placeholder="Listing Heading" value={heading} onChangeText={setHeading} />
      
      {showDetails ? (
        <View>
          {/* Details TextArea */}
          <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Listing Details"
              value={details}
              onChangeText={setDetails}
              multiline
          />
          {/* Rate Input */}
          <TextInput style={styles.input} placeholder="Listing Rate" value={rate} onChangeText={setRate} keyboardType="numeric" />

          {/* Image Picker */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={styles.imagePickerText}>{image ? "Change Image" : "Pick an Image"}</Text>
          </TouchableOpacity>          
          {image && <Image source={{ uri: image }} style={styles.image} />}

          {/* Submit Button */}
          <ErrorMessage message={error} onClose={() => setError("")} />
          <Button title="Add Listing" style={styles.submitButton} onPress={handleSubmit} isLoading={loading} />
        </View>        
      ) : (
        <Button title="Generate detail from heading" onPress={handleGenerateDetail} isLoading={loadingdetails} />
        
      )}
      {/* These 3 text boxes are to add some margin Bottom */}
      <Text></Text>
      <Text></Text>
      <Text></Text>
    </ScrollView>
  );
};

export default AddListingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 380,
    textAlignVertical: "top",
  },
  imagePicker: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 14,
    alignItems: "center",
  },
});