import { View, Text, Pressable, TextInput } from "react-native";
import PatientsList from "./PatientsList";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons, { MaterialIconsIconName } from "@react-native-vector-icons/material-icons";
import { Link, RelativePathString, router } from "expo-router";
import { useState } from "react";

const StyledPressable = (
  {title, icon, link} : {title: string, icon: MaterialIconsIconName, link?: RelativePathString }
) => (
  <Pressable 
    className="flex flex-row gap-3 px-4 py-2 bg-neutral-200 border border-neutral-400 rounded-xl"
    onPress={() => link && router.navigate(link)}
  >
    <MaterialIcons name={icon} size={20} color={"#000000"}/>
    <Text className="font-semibold">{title}</Text>
  </Pressable>
)

export default function Patients () {
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView className="gap-6">
      <View className="flex-row justify-around">
        <StyledPressable title="Arquivar" icon="person-remove" />
        <StyledPressable title="Adicionar" icon="person-add" link="/Patients/AddPatient"/>
      </View>

      <View className="flex-row mx-2 items-center bg-neutral-200 border border-neutral-400 rounded-xl">
        <MaterialIcons name="search" color={"#b0afaf"} size={20} 
          style={{padding: 5, paddingRight: 0}}
        />
        <TextInput
          placeholder="Pesquisar paciente pelo nome..."
          value={search}
          onChangeText={(val) => setSearch(val)}
          className="flex-1"
        />
      </View>

      <PatientsList />
    </SafeAreaView>
  )
}