import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, TextInput, View } from "react-native";
import MaterialIcons, { MaterialIconsIconName } from "@react-native-vector-icons/material-icons";
import { RelativePathString, router } from "expo-router";
import { useState } from "react";


const StyledPressable = (
  {title, icon, link} : {title: string, icon: MaterialIconsIconName, link?: RelativePathString }
) => (
  <Pressable 
    className="flex flex-row gap-3 px-4 py-2 bg-neutral-200 border border-neutral-400 rounded-full"
    onPress={() => link && router.navigate(link)}
  >
    <MaterialIcons name={icon} size={20} color={"#000000"}/>
    <Text className="font-semibold">{title}</Text>
  </Pressable>
);

export default function QuestionsTab () {
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView className="gap-3">
        <View className="flex-row justify-around">
          <StyledPressable title="Deletar" icon="remove" />
          <StyledPressable title="Adicionar" icon="add" link="/Questions/AddQuestion"/>
        </View>

        <View className="p-2 gap-3">
          <View className="flex-row items-center bg-neutral-200 rounded-full">
            <MaterialIcons name="search" color={"#b0afaf"} size={20} 
              style={{padding: 8, paddingRight: 0}}
            />
            <TextInput
              placeholder="Pesquisar questão pelo nome..."
              value={search}
              onChangeText={(val) => setSearch(val)}
              className="flex-1"
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}