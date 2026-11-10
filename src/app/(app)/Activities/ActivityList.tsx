import MaterialIcons from "@react-native-vector-icons/material-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View, Text } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatientsList({activities}:{activities: any[]}) {
  const [activeSections, setActiveSections] = useState([]);
  
  return (
    <SafeAreaView>
      <Accordion
        activeSections={activeSections}
        sections={activities}
        renderHeader={(section) =>
          <View className="flex flex-row mx-2 py-3 gap-3 items-center border-t border-t-neutral-400">
          <View className="w-10 h-10 p-1 items-center justify-center rounded-full border">
              <MaterialIcons name="task" size={25} />
          </View>
          <Text>{section.title}</Text>
          </View>
        }
        renderContent={(section) =>
          <View className="flex flex-col px-6 py-3 gap-3">
            <View className="flex flex-row justify-between">
            {section.questions && section.questions.length && (
              <View className="flex flex-col w-1/2">
                <Text className="text-md font-medium">Questões: {section.questions.length}</Text>
                {/* {section.questions.map((v) => {
                  return (
                    <View className="flex-row gap-1 items-center">
                      <Text className="text-xl">{'\u2022'}</Text>
                      <Text className="text-sm">{v.text}</Text>
                    </View>
                  )
                })} */}
                  
              </View>
            )}
            </View>
          </View>
        }
        onChange={(e) => setActiveSections(e)}
      />
      
    </SafeAreaView>
  )
}