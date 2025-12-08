import { View } from "react-native";
import { Text } from "react-native-paper";
import globalStyles from "@/components/Styles"; 
export default function CategoriesScreen (){
  return (
    <View style={[globalStyles.container,{paddingTop:20}]}>
      <Text variant="headlineMedium">Categories</Text></View>
  )};