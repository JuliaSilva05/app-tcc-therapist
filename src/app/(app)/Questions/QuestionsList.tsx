import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Pressable, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Questions = {
  _id: string;
  title: string;
}
export default function QuestionsList({questions}:{questions: Questions[]}) {
  return (
    <SafeAreaView>
      {questions?.map(item => {  
        return (
          <Pressable 
            key={item._id}
            className="flex flex-row mx-2 items-center justify-between border-t border-t-neutral-400"
            onPress={() => {
              // router.navigate({
              //   pathname: "/Patients/PatientProfile",
              //   params: {
              //     linkId: item._id,
              //     patientId: item.patient,
              //   }
              // });
            }}
          >
              <View className="flex-1 flex-row items-center gap-3 my-3">
                <View className="w-10 h-10 p-1 items-center justify-center rounded-full border">
                  <MaterialIcons name="folder" size={25} />
                </View>
                
                <Text>{item.title}</Text>
              </View>
            
              <MaterialIcons name="chevron-right" size={30} /> 
          </Pressable>
        )
      })}
    </SafeAreaView>
  )
}