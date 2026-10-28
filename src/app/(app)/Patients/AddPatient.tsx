import { useSession } from "@/context/ctx";
import axiosInstance from "../../../services/apiConfig";
import { CircularProgressIndicator, Host } from "@expo/ui/jetpack-compose";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

const GREEN = "#34C759";
const RED = "#FF383C";

interface SearchResponse {
  title: string;
  message: string;
  patient?: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function AddPatient() {
  const { user } = useSession();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [searchResponse, setSearchResponse] = useState<SearchResponse | null>(null);
  
  const handleSearch = async () => {
    try {
      setIsLoading(true);

      const { data } = await axiosInstance.post("/api/search-new-patient", {
        email,
      });
      
      console.log(data)
      setSearchResponse(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // #34C759 green #FF383C red

  const handleSubmit = async () => {
    try {
      
      setIsSendingInvite(true);

      const { data } = await axiosInstance.post("/api/invite-patient", {
        patient: searchResponse?.patient,
        therapist: JSON.parse(user),
      });

      if (data.ok === true) {
        Alert.alert("Convite enviado")
        setEmail("");
        setSearchResponse(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingInvite(false);
    }
  }
  
  return (
    <SafeAreaView>
      <KeyboardAwareScrollView contentContainerClassName="gap-6">
        <View className="gap-1 p-2">
          <Text className="text-base text-neutral-500 font-medium">
            E-MAIL
          </Text>
          <View className="flex-row items-center bg-neutral-200 rounded-full">
            <MaterialIcons name="search" color={"#737373"} size={20} //#737373
              style={{padding: 5, paddingRight: 0}}
            />
            <TextInput
              placeholder="Procurar paciente pelo e-mail..."
              value={email}
              onChangeText={(val) => setEmail(val)}
              className="flex-1"
              keyboardType="email-address"
              editable={!isLoading || !isSendingInvite}
            />
          </View>
        </View>

        <View className="items-center">
          <Pressable className="flex px-4 py-2 rounded-full bg-cyan-600" onPress={handleSearch}>
            <Text className="text-lg font-semibold text-white">Buscar</Text>
          </Pressable>
        </View>

        {isLoading || isSendingInvite ? (
          <Host matchContents >
            <CircularProgressIndicator />
          </Host>
        ) : (
          searchResponse ? (
            <View className="flex py-4 mx-4">        
              <View className="flex-row items-center">
                <MaterialIcons 
                  name={searchResponse.patient ? "check-circle" : "cancel"} 
                  size={36} color={searchResponse.patient ? "#34C759" : "#FF383C"}
                />
                <Text className="ml-2 text-2xl font-medium">
                  {searchResponse.title}
                </Text>
              </View>

              <View className={`ml-[18px] border-b border-l 
                ${searchResponse.patient ? "border-[#34C759]" : "border-[#FF383C]"}
                rounded-bl-3xl pb-4 pl-4`
              }>
                <Text className="text-lg text-neutral-500">{searchResponse.message}</Text>

                {searchResponse.patient ? (
                  <View>
                    <Text className="text-lg">
                      <Text className="font-medium">
                        Nome:{" "}
                      </Text>
                      {searchResponse.patient?.name}
                    </Text>
                    <Text className="text-lg">
                      <Text className="font-medium">
                        E-mail:{" "}
                      </Text>
                      {searchResponse.patient?.email}
                    </Text>
                  </View>
                ) : null}

                <View className="flex flex-row items-center justify-between mt-4 gap-3">
                  <Pressable className="p-3 bg-neutral-200 border rounded-full">
                    <Text className="font-medium">Convidar por e-mail</Text>
                  </Pressable>

                  {searchResponse.patient ? (
                    <Pressable onPress={handleSubmit} className="p-3 bg-neutral-200 border rounded-full">
                      <Text className="font-medium">Convidar pelo app</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>             
            
            </View>
          ) : null
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}