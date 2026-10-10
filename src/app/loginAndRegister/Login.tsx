import { Link, router, Stack } from "expo-router";
import { Header, HeaderTitle } from "expo-router/build/react-navigation";
import { useState } from "react";
import { View, Text, TextInput, Button, Pressable, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@react-native-vector-icons/material-icons';
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    try {

    } catch (e) {
      console.error(e);
    }
  }

  return (
    // <KeyboardAwareScrollView className="flex-1 flex-auto items-center justify-center">
      <View className="flex-1 items-center justify-evenly p-6 gap-6 bg-white">
        {/* <Stack.Screen options={{ title: "Entrar" }}/> */}
        <View className="flex w-full gap-6">

          <View className="gap-1">
            <Text className="text-xl text-neutral-400">E-mail</Text>
            <TextInput
              placeholder="E-mail"
              className="text-xl shadow-md border-2 border-neutral-400 rounded-[16px] p-1 bg-neutral-200"
              keyboardType="email-address"
              onChangeText={(e) => setEmail(e)}
            />
          </View>
          
          <View className="gap-1">
            <Text className="text-xl text-neutral-400">Senha</Text>
            <View className="relative justify-around">
              <TextInput
                placeholder="Senha"
                className="text-xl shadow-md border-2 border-neutral-400 rounded-[16px] p-1 bg-neutral-200"
                secureTextEntry={!showPassword}
                onChangeText={(e) => setPassword(e)}
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
        
        <View className="gap-3 items-center">
          <Pressable
            className="border-[2px] border-sky-900 rounded-[32px] px-12 py-4 bg-sky-300" 
            onPress={handleSubmit}
          >
            <Text className="text-2xl text-sky-900">Entrar</Text>
          </Pressable>

          <Link href="/loginAndRegister/Register">
            <Text className="text-xl text-sky-900 font-semibold underline">Cadastrar</Text>
          </Link>
        </View>

        {/* <Text>{email} - {password} - {showPassword}</Text> */}

      </View>
    // </KeyboardAwareScrollView>
  );
}

export default Login;