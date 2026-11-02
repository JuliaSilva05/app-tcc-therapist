import { View, Text, Pressable, TextInput } from "react-native";
import PatientsList from "./PatientsList";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons, { MaterialIconsIconName } from "@react-native-vector-icons/material-icons";
import { Link, RelativePathString, router } from "expo-router";
import { useEffect, useState } from "react";
import { CircularProgressIndicator, HorizontalDivider, Host, VerticalDivider } from "@expo/ui/jetpack-compose";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axiosInstance from "@/services/apiConfig";
import { useSession } from "@/context/ctx";


type Patients = {
  _id: string;
  patient: string;
  patientDisplayName: string;
  status: string;
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

export default function Patients () {
  const { user } = useSession();
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patients[]>([]);

  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const getPatients = async () => {
      try {
        setIsLoading(true);
        //@ts-ignore
        const user_id = JSON.parse(user)._id;

        const { data } = await axiosInstance.post("/api/get-patients", {
          user_id,
          search,
        });

        console.log(data)
        
        setPatients(data?.patients);
      } catch(e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    getPatients();
  }, [search]);

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView contentContainerClassName="gap-3">
        <View className="flex-row justify-around">
          <StyledPressable title="Arquivar" icon="person-remove" />
          <StyledPressable title="Adicionar" icon="person-add" link="/Patients/AddPatient"/>
        </View>

        <View className="p-2 gap-3">
          <View className="flex-row items-center bg-neutral-200 rounded-full">
            <MaterialIcons name="search" color={"#b0afaf"} size={20} 
              style={{padding: 8, paddingRight: 0}}
            />
            <TextInput
              placeholder="Pesquisar paciente pelo nome..."
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
        ) : (
          <>
            {patients && patients?.length ? (
              <PatientsList patients={patients} />
            ) : (
              <View className="flex flex-col items-center justify-center gap-3">
                <MaterialIcons 
                  name="search-off"
                  color={"#b0afaf"} size={60}
                />
                <Text className="text-lg text-neutral-400">Nenhum paciente encontrado.</Text>
                <Link href="/Patients/AddPatient">
                  <Text className="text-lg text-neutral-500 font-medium underline">
                    Comece adicionando um.
                  </Text>
                </Link>
              </View>
            )}
          </>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}