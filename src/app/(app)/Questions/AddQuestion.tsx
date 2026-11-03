import MaterialIcons from "@react-native-vector-icons/material-icons";
import { TransitionSpecs } from "expo-router/build/layouts/TabsClient.js";
import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

type Questions = {
  title: string;
  titleAudio?: any;
  description: string;
}

type Tips = {
  text: string;
  audio?: any;
}

const mock = [
  { text: "aaaa" },
  { text: "bbbb" },
  { text: "cccc" },
]

export default function AddQuestion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tips, setTips] = useState<Tips[]>([]);
  
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

        <View className="gap-1">
          <Text className="text-base text-neutral-500 font-medium">
            Imagem
            <Text className="text-red-500"> *</Text>
          </Text>
          
          {/* <TextInput 
            className="text-base bg-neutral-200 shadow-md border-b-2 
                  border-neutral-500 rounded-t-md p-1"
            value={description}
            onChangeText={(e) => setDescription(e)}
          /> */}
        </View>

        <View className="gap-1">
          <Text className="text-base text-neutral-500 font-medium">
            Dicas
          </Text>
          <View className="flex-col gap-5">
            {tips?.map((tip, index) => {
              return (
                <View key={`question-tips-${index}`} className="flex-row gap-1 items-center ">
                  <Text>{'\u2022'}</Text>
                  <TextInput 
                    placeholder={`Dica ${index + 1}`} 
                    className="flex-1 text-base bg-neutral-200 shadow-md border-b-2 
                      border-neutral-500 rounded-t-md p-1"
                    value={tip.text}
                    onChangeText={(e) => {
                      setTips((current) => 
                        current?.map(
                          (currentTip, tipIndex) => 
                            tipIndex === index ? {
                              ...currentTip,
                              text: e,
                            } : currentTip
                        )
                      )
                    }}
                  />
                  <Pressable
                    onPress={() => 
                      setTips(
                        tips.filter(
                          (_, tipIndex) =>
                            tipIndex !== index,
                        ),
                      )}
                  >
                    <MaterialIcons name="delete" size={18} />
                  </Pressable>
                </View>
              )
            })}

            <View className="items-center">
              <Pressable className="w-10 h-10 border bg-neutral-200 rounded-full items-center justify-center"
                onPress={() => 
                  setTips([
                    ...tips,
                    {
                      text: "",
                    },])
                }
              >
                <MaterialIcons name="add" size={30} />
              </Pressable>
            </View>
          </View>
        </View>
        
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}