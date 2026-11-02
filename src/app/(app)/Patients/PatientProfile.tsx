import { SafeAreaView } from "react-native-safe-area-context";
import { useLocation } from 'react-router-dom';
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, usePathname } from "expo-router";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useEffect, useState } from "react";
import axiosInstance from "@/services/apiConfig";
import { CircularProgressIndicator, Host } from "@expo/ui/jetpack-compose";

type PatientInfo = {
  name: string;
  email: string;
  patientDisplayName: string;
}

export default function PatientProfile () {
  const { linkId, patientId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>();

  const [editing, setEditing] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');

  useEffect(() => {
    const getInfo = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/get-patient-info/${linkId}`);
        console.log(data)
        setPatientInfo(data?.info);
      } catch (e) {
        console.error(e);
      }
    };

    getInfo();
  }, []);

  const handleChangeDisplayName = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.patch("/api/edit-patient-display-name", {
        newDisplayName,
        linkId,
      });

      if (data.ok) {
        Alert.alert("Nome de contato mudado com sucesso");
        setEditing(false);
      } else {
        Alert.alert("Não foi possível alterar o nome de contato");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 gap-3">
      <View className="flex-row gap-3 items-center">
        <View className="w-20 h-20 p-1 items-center justify-center rounded-full border">
          <MaterialIcons name="person" size={45} />
        </View>

        <View className="gap-3">
          <View className="flex-row">
            <Text className="font-md">Nome: {" "}</Text>
            <Text className="text-neutral-500">{patientInfo?.name}</Text>
          </View>

          <View className="flex-row">
            <Text className="font-md">E-mail: {" "}</Text>
            <Text className="text-neutral-500">{patientInfo?.email}</Text>
          </View>
        </View>

      </View>
      {isLoading ? (
        <Host>
          <CircularProgressIndicator/>
        </Host>
      ) : (
        <View className="flex-col gap-1">
            <Text className="font-md">Salvar na lista como:</Text>
            {editing ? (
              <View className="gap-3">
                <TextInput placeholder="Nome para salvar" value={newDisplayName} onChangeText={(e) => setNewDisplayName(e)} className="bg-neutral-200 p-3" />
                <View className="flex-row justify-around">
                  <Pressable onPress={() => { setEditing(false)}} className="w-1/3 p-1 items-center bg-neutral-200 border rounded-md">
                    <Text>Cancelar</Text>
                  </Pressable>
                  <Pressable onPress={handleChangeDisplayName} className="w-1/3 p-1 items-center bg-neutral-200 border rounded-md">
                    <Text>Salvar</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View className="flex-row justify-between bg-neutral-200 p-3">
                <Text>{patientInfo?.patientDisplayName}</Text>
                <Pressable onPress={() => { setEditing(true), setNewDisplayName(patientInfo?.patientDisplayName)}}>
                  <MaterialIcons name="edit" size={20}/>
                </Pressable>
              </View>
            )}
        </View>
      )}
    </SafeAreaView>
  )
}