import { Link, Stack } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, Button, Pressable } from "react-native";

const Register = () => {
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
    <View className="flex-1 flex-auto items-center justify-center">
      <Stack.Screen options={{ title: "Cadastrar" }}/>
      <Text className="text-3xl">Login</Text>
      <View className="mx-6">
        <Text>E-mail</Text>
        <TextInput
          placeholder="Email"
          className=""
          keyboardType="email-address"
        />
      </View>
      <Link href="../index">
        <Button title="voltar" />
      </Link>
        
      <Pressable className="" onPress={() => {}}>
        <Text className="">Login</Text>
      </Pressable>
    </View>
  );
}

export default Register;