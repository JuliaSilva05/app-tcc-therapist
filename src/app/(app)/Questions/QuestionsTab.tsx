import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, TextInput, View } from "react-native";
import MaterialIcons, { MaterialIconsIconName } from "@react-native-vector-icons/material-icons";
import { Link, RelativePathString, router } from "expo-router";
import { useEffect, useState } from "react";
import { CircularProgressIndicator, Host } from "@expo/ui/jetpack-compose";
import QuestionsList from "./QuestionsList";
import axiosInstance from "@/services/apiConfig";
import { useSession } from "@/context/ctx";

type Questions = {
  _id: string;
  title: string;
}

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
  const { user } = useSession();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>();

  useEffect(() => {
    const getQuestions = async () => {
      try {
        setIsLoading(true);
        //@ts-ignore
        const user_id = JSON.parse(user)._id;

        const { data } = await axiosInstance.get(`/api/get-questions/${user_id}`);
        
        setQuestions(data?.questions);
      } catch(e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    getQuestions();
  }, []);
  
  return (
    <SafeAreaView>
      <KeyboardAwareScrollView className="gap-3">
        <View className="flex-row justify-around">
          <StyledPressable title="Deletar" icon="remove" />
          {/* @ts-ignore */}
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

        {isLoading ? (
          <Host>
            <CircularProgressIndicator />
          </Host>
        ) : questions && questions.length ? (
          <QuestionsList questions={questions} />
        ) : (
          <View className="flex flex-col items-center justify-center gap-3">
            <MaterialIcons 
              name="search-off"
              color={"#b0afaf"} size={60}
            />
            <Text className="text-lg text-neutral-400">Nenhuma questão encontrada.</Text>
            <Link href="/Questions/AddQuestion">
              <Text className="text-lg text-neutral-500 font-medium underline">
                Comece adicionando uma.
              </Text>
            </Link>
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}