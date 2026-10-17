import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerStyle: {
          backgroundColor: "#219EBC"
        },
        headerTintColor: "#FFFFFF"
      }}
    >
      <Stack.Screen name="Login" options={{title: "Login", headerTitleAlign: "center"}}/>
      <Stack.Screen name="Register" options={{title: "Cadastrar", headerTitleAlign: "center"}}/>
    </Stack>
  );
}
