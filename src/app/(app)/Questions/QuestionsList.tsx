import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Pressable, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Accordion from 'react-native-collapsible/Accordion';
import { useEffect, useState } from "react";

type Questions = {
  _id: string;
  title: string;
  description: string;
  imageKey?: string;
  image: any;
  tips: any;
}


export default function QuestionsList({questions}:{questions: Questions[]}) {
  const [activeSections, setActiveSections] = useState([]);

  console.log('activeSections',activeSections)

  // useEffect(() => {
  //   const getImage = async () => {
  //     // const imagePut = await fetch(currentImage.url, {
  //     //   method: 'PUT',
  //     //   headers: { 'Content-Type': currentImage.contentType }, // must match what the server signed
  //     //   // body: imageBlob,
  //     // });

  //     // console.log(imagePut)
  //   }

  //   getImage();
  // }, [activeSections]);

  const onChange = () => {

  }

  return (
    <SafeAreaView>
      <Accordion
        activeSections={activeSections}
        sections={questions}
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
            <View className="flex flex-row gap-2">
              <Pressable 
                className="flex flex-row gap-1 items-center justify-center p-1 px-2 bg-neutral-200 border rounded-full"
              >
                <MaterialIcons name="play-circle-outline" size={20} />
                <Text>Prévia</Text>
              </Pressable>
            </View>
            <View className="flex flex-row justify-between">
              <View className="flex flex-col w-1/2">
                <Text>{section.description}</Text>
                <Image 
                  // source={{uri: section.image}}
                  style={{width: 40, height: 30}}
                />
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