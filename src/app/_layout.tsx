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
      <Stack.Screen name="loginAndRegister/Login" options={{title: "Login"}}/>
    </Stack>
  );
}
