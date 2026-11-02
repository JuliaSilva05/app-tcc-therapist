import { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  return (
    <SafeAreaView>
      <KeyboardAwareScrollView contentContainerClassName="w-full p-4 gap-6">
        <View className="gap-1">
          <Text className="text-base text-neutral-500 font-medium">
            Título da Atividade na Lista
            <Text className="text-red-500"> *</Text>
          </Text>
          <TextInput 
            placeholder="Ex: Atividade 1..."
            className="text-base bg-neutral-200 shadow-md border-b-2 
                  border-neutral-500 rounded-t-md p-1"
            value={title}
            onChangeText={(e) => setTitle(e)}
          />
        </View>

        <View className="gap-1">
          <Text className="text-base text-neutral-500 font-medium">
            Pergunta/Enunciado
            <Text className="text-red-500"> *</Text>
          </Text>
          <TextInput 
            className="text-base bg-neutral-200 shadow-md border-b-2 
                  border-neutral-500 rounded-t-md p-1"
            value={description}
            onChangeText={(e) => setDescription(e)}
          />
        </View>
        
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}