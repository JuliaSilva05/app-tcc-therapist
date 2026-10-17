import { Stack } from "expo-router";
import { AuthProvider } from "./../context/auth";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack 
        screenOptions={{ 
          headerStyle: {
            backgroundColor: "#219EBC"
          },
          headerTintColor: "#FFFFFF"
        }}
      >
        <Stack.Screen name="Index" options={{title: "Login", headerTitleAlign: "center"}}/>
        <Stack.Screen name="Register" options={{title: "Cadastrar", headerTitleAlign: "center"}}/>
        {/* <Stack.Screen name="Home" options={{title: "Menu", headerTitleAlign: "center"}}/> */}
      </Stack>
    </AuthProvider>
  );
}