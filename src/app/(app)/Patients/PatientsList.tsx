import MaterialIcons from "@react-native-vector-icons/material-icons";
import { View, Text, FlatList, Pressable } from "react-native";

const mock = [
  {
    _id: "123",
    name: "Fulano",
  },
  {
    _id: "456",
    name: "Ciclano",
  },
  {
    _id: "789",
    name: "Beltrano",
  },
  {
    _id: "123",
    name: "Fulano",
  },
  {
    _id: "456",
    name: "Ciclano",
  },
  {
    _id: "789",
    name: "Beltrano",
  },
  {
    _id: "123",
    name: "Fulano",
  },
  {
    _id: "456",
    name: "Ciclano",
  },
  {
    _id: "789",
    name: "Beltrano",
  },
  {
    _id: "123",
    name: "Fulano",
  },
  {
    _id: "456",
    name: "Ciclano",
  },
  {
    _id: "789",
    name: "Beltrano",
  },
  {
    _id: "123",
    name: "Fulano",
  },
  {
    _id: "456",
    name: "Ciclano",
  },
  {
    _id: "789",
    name: "Beltrano",
  },
  {
    _id: "123",
    name: "Fulano",
  },
  {
    _id: "456",
    name: "Ciclano",
  },
  {
    _id: "789",
    name: "Beltrano",
  },{
    _id: "123",
    name: "Fulano",
  },
  {
    _id: "456",
    name: "Ciclano",
  },
  {
    _id: "789",
    name: "Beltrano",
  },
]

export default function PatientsList({patients}:{patients: any[]}) {

  return (
    // <View className="p-4">
      <FlatList 
        data={patients}
        keyExtractor={item => item._id}
        renderItem={({item}) => {
          return (
            <Pressable className="flex flex-row mx-2 items-center justify-between border-t border-t-neutral-400">
              <View className="flex-1 flex-row items-center gap-3 my-3">
                <View className="w-10 h-10 p-1 items-center justify-center rounded-full border">
                  <MaterialIcons name="person" size={25} />
                </View>
                <Text className="text-lg truncate">{item.patientDisplayName}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={30} />
            </Pressable>
          )
        }}
      />
    // </View>
  )
}