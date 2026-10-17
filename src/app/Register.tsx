import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Link, Stack, useNavigation } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, Pressable } from "react-native";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      if (!name.length || !email.length || !password.length) {
        console.log("AAAAAAAAAAAA")
        return;
      };
      
      const body = { name, email, password, role: "Therapist" };

      const { data } = await axios.post("http://localhost:8000/api/register", body);

      console.log(data);

      // if (data.error) {
      //   console.log("NNNNNNNNNNNNNNNN")
      // } else {
      //   await AsyncStorage.setItem("auth-rn", JSON.stringify(data));
      //   useNavigation("/Login");
      // }
      


    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAwareScrollView className="flex-1 items-center justify-evenly p-6 gap-6 bg-white">

    {/* <View className="flex-1 items-center justify-evenly p-6 gap-6 bg-white"> */}
      <View className="flex w-full gap-6">

        <View className="gap-1">
          <Text className="text-base text-neutral-400 font-medium">NOME</Text>
          <TextInput
            placeholder="Escreva seu nome..."
            className="text-base bg-neutral-200 shadow-md border-b-2 border-neutral-400 
              rounded-t-md p-1"
            autoCapitalize="words"
            onChangeText={(e) => setName(e)}
            editable={!isLoading}
          />
        </View>

        <View className="gap-1">
          <Text className="text-base text-neutral-400 font-medium">E-MAIL</Text>
          <TextInput
            placeholder="Escreva seu e-mail..."
            className="text-base bg-neutral-200 shadow-md border-b-2 border-neutral-400 
              rounded-t-md p-1"
              keyboardType="email-address"
            onChangeText={(e) => setEmail(e)}
            editable={!isLoading}
          />
        </View>
        
        <View className="gap-1">
          <Text className="text-base text-neutral-400 font-medium">SENHA</Text>
          <View className="relative justify-around">
            <TextInput
              placeholder="Escreva sua senha..."
              className="text-base bg-neutral-200 shadow-md border-b-2 border-neutral-400 
                rounded-t-md p-1"
              secureTextEntry={!showPassword}
              onChangeText={(e) => setPassword(e)}
              editable={!isLoading}
            />
            <Pressable className="absolute right-2" onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons 
                name={showPassword ? "visibility" : "visibility-off"} 
                color={"#b0afaf"} size={20} 
              />
            </Pressable>
          </View>
        </View>
      </View>
      
      <Pressable
        className="border-[2px] border-sky-900 rounded-[32px] px-12 py-4 bg-sky-300" 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text className="text-xl text-sky-900 font-medium">CADASTRAR</Text>
      </Pressable>

      {/* </View> */}
    </KeyboardAwareScrollView>
  );
}

export default Register;