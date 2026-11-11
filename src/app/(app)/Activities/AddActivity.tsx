import { View, Text, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons, { MaterialIconsIconName } from "@react-native-vector-icons/material-icons";
import { Link, RelativePathString, router } from "expo-router";
import { useEffect, useState } from "react";
import { CircularProgressIndicator, HorizontalDivider, Host, VerticalDivider } from "@expo/ui/jetpack-compose";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axiosInstance from "@/services/apiConfig";
import { useSession } from "@/context/ctx";
import { Checkbox } from 'expo-checkbox';


type Patients = {
  _id: string;
  patient: string;
  patientDisplayName: string;
}
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

export default function AddActivity () {
  const { user } = useSession();
  //@ts-ignore
  const user_id = JSON.parse(user)._id;

  const [screen, setScreen] = useState<"chooseQuestions"|"choosePatients">("chooseQuestions");

  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionsOptions, setQuestionsOptions] = useState<Questions[]>([]);

  const [patients, setPatients] = useState<string[]>([]);
  const [patientsOptions, setPatientsOptions] = useState<Patients[]>([]);

  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const getQuestionsOptions = async () => {
      try {
        setIsLoading(true);
        //@ts-ignore
        // const user_id = JSON.parse(user)._id;

        const { data } = await axiosInstance.get(`/api/get-questions/${user_id}`);
        
        setQuestionsOptions(data?.questions);
      } catch(e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
    }

    getQuestionsOptions();
}, []);

  useEffect(() => {
    const getPatientsOptions = async () => {
      try {
        setIsLoading(true);
        
        const { data } = await axiosInstance.post("/api/get-patients", {
          user_id,
        });

        console.log(data)

        setPatientsOptions(data?.patients);
      } catch(e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    getPatientsOptions();
  }, [search]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const { data } = await axiosInstance.post("api/create-activity-and-assignments", {
        therapist: user_id,
        title,
        questions,
        patients,
      });

      console.log(data)

      router.dismissTo("/(app)/Activities")
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <SafeAreaView>
      <KeyboardAwareScrollView contentContainerClassName="gap-3">
        <View className="flex items-end">
          <Pressable 
            className="px-4 py-2 items-center rounded-full w-1/3 bg-sky-300 border border-sky-900"
            onPress={handleSubmit}
          >
            <Text className="text-sky-900 font-semibold">Criar</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <Host>
            <CircularProgressIndicator />
          </Host>
        ) : (
          <View className="flex flex-col gap-3 p-4">
            <View className="gap-1">
              <Text className="text-base text-neutral-500 font-medium">
                Título da Atividade na sua Lista
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

            <View className=" items-center">
              <Text className="text-lg font-semibold">Escolher Questões<Text className="text-red-500"> *</Text></Text>
            </View>
            <View >
              {questionsOptions?.map(item => {
                const checked = questions?.includes(item._id);
                return (
                  <View 
                    key={item._id}
                    className="flex flex-row gap-3 py-3 items-center border-t border-t-neutral-400"
                  >
                    <Checkbox 
                      value={checked}
                      onValueChange={(e) => {
                        if (checked) {
                          // const filtered = questions?.filter(v => v !== item._id);
                          // setQuestions(filtered);
                          setQuestions([]);
                        } else {
                          setQuestions([item._id]);
                          // setQuestions([...questions || [], item._id]);
                        }
                      }}
                    />
                      <Text className="text-black text-lg">{item.title}</Text>
                  </View>
                )
              })}
            </View>


            <View className=" items-center">
              <Text className="text-lg font-semibold">Escolher Pacientes</Text>
            </View>
            <View >
              {patientsOptions?.map(item => {
                const checked = patients?.includes(item.patient);
                return (
                  <View 
                    key={item.patient}
                    className="flex flex-row gap-3 py-3 items-center border-t border-t-neutral-400"
                  >
                    <Checkbox 
                      value={checked}
                      onValueChange={(e) => {
                        if (checked) {
                          const filtered = patients?.filter(v => v !== item.patient);
                          setPatients(filtered);
                        } else {
                          setPatients([...patients || [], item.patient]);
                        }
                      }}
                    />
                      <Text className="text-black text-lg">{item.patientDisplayName}</Text>
                    
                  </View>
                )
              })}
            </View>
          </View>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}