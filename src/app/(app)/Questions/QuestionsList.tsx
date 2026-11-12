import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Pressable, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Accordion from 'react-native-collapsible/Accordion';
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { Avatar } from "react-native-elements";
import { router } from "expo-router";
import { CircularProgressIndicator, Host } from "@expo/ui/jetpack-compose";

type Questions = {
  _id: string;
  title: string;
  description: string;
  imageKey?: string;
  image: any;
  tips: any[];
}


export default function QuestionsList({questions}:{questions: Questions[]}) {
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [isLoadingImg, setIsLoadingImg] = useState(true);

  console.log('activeSections',activeSections)

  return (
    <SafeAreaView>
      <Accordion
        activeSections={activeSections}
        sections={questions}
        keyExtractor={(section) => section._id}
        renderHeader={(section) =>
          <View className="flex flex-row mx-2 py-3 gap-3 items-center border-t border-t-neutral-400">
            <View className="w-10 h-10 p-1 items-center justify-center rounded-full border">
              {section?.image ? (
                <Avatar
                  rounded
                  source={{
                    uri:
                      section?.image.url,
                  }}
                  
                />
              ) : (
                <MaterialIcons name="task" size={25} />
              )}
            </View>
            <Text>{section.title}</Text>
          </View>
        }
        renderContent={(section) =>
          <View className="flex flex-col px-6 py-3 gap-3">
            <View className="flex flex-row gap-2">
              <Pressable 
                className="flex flex-row gap-1 items-center justify-center p-1 px-2 bg-neutral-200 border rounded-full"
                onPress={() => router.navigate({
                  pathname: "/(app)/Questions/QuestionPreview", 
                  params: {questionId: section._id},
                })}
              >
                <MaterialIcons name="play-circle-outline" size={20} />
                <Text>Prévia</Text>
              </Pressable>
            </View>
            <View className="flex flex-row justify-between gap-3">
              <View className="flex flex-col w-1/2 gap-2">
                <Text><Text className="font-medium">Pergunta: </Text>{section.description}</Text>
                {section?.image && (
                  <>
                    <Image
                      source={{ uri: section?.image.url }}
                      style={{ width: "auto", aspectRatio: 4 / 3 }}
                      contentFit="contain"
                      cachePolicy="none"
                      onLoad={() => console.log("Image loaded!")}
                      onError={(e) => console.log("Image error:", e.error)}
                      onLoadStart={() => setIsLoadingImg(true)}
                      onLoadEnd={() => setIsLoadingImg(false)}
                    />
                    {isLoadingImg && ( 
                      <View className="items-center justify-center w-auto aspect-4/3">
                        <Host matchContents>
                          <CircularProgressIndicator />
                        </Host>
                      </View>
                    )}
                  </>
                )}
              </View>
              {section.tips && section.tips.length && (
                <View className="flex flex-col w-1/2">
                  <Text className="text-md font-medium">Dicas:</Text>
                  {section.tips.map((v) => {
                    return (
                      <View className="flex-row gap-1 items-center">
                        <Text className="text-xl">{'\u2022'}</Text>
                        <Text className="text-sm">{v.text}</Text>
                      </View>
                    )
                  })}
                  
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