import { Link, router, Stack } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, Pressable, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      if (!email.length || !password.length) {
        alert("Preencha os campos necessários!")
      }

      const body = { email, password };

      const response = await axios.post("http://localhost:8000/api/login", body);

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAwareScrollView className="flex-1 items-center justify-evenly p-6 gap-6 bg-white">
      {/* <View className="flex-1 items-center justify-evenly p-6 gap-6 bg-white"> */}
      <SafeAreaView>

        <View className="flex w-full gap-6">

          <View className="gap-1">
            <Text className="text-base text-neutral-400 font-medium">E-MAIL</Text>
            <TextInput
              placeholder="Escreva seu e-mail..."
              className="text-base bg-neutral-200 shadow-md border-b-2 
                border-neutral-400 rounded-t-md p-1"
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
                className="text-base bg-neutral-200 shadow-md border-b-2 
                  border-neutral-400 rounded-t-md p-1"
                secureTextEntry={!showPassword}
                onChangeText={(e) => setPassword(e)}
                editable={!isLoading}
              />
              <Pressable className="absolute right-1 p-1" onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  color={"#b0afaf"} size={20} 
                />
              </Pressable>
            </View>
          </View>
        </View>
        
        <View className="gap-3 items-center">
          <Pressable
            className="border-[2px] border-sky-900 rounded-[32px] px-12 py-4 bg-sky-300" 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text className="text-xl text-sky-900 font-medium">ENTRAR</Text>
          </Pressable>

          <Link href="/Register" disabled={isLoading}>
            <Text className="text-lg text-sky-900 font-semibold underline">
              Ainda não tem conta? Cadastrar
            </Text>
          </Link>

          <Link href="/" disabled={isLoading}>
            <Text className="text-base text-sky-900 font-sm">Esqueci minha senha</Text>
          </Link>
        </View>

      </SafeAreaView>
      {/* </View> */}
    </KeyboardAwareScrollView>
  );
}

export default Login;