import { Host, CircularProgressIndicator } from "@expo/ui/jetpack-compose";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import * as Speech from 'expo-speech';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axiosInstance from "@/services/apiConfig";


type Tips = {
  _id: string;
  text: string;
  audio?: Audio | null;
  visible: boolean;
}

type Question = {
  _id: string;
  description: string;
  descriptionAudio: Audio | null;
  imageKey: string;
  imageUrl: string;
  tips: Tips[];
}

type Audio = {
  url: string | null;
  mimeType: string | null | undefined;
  durationSec: number;
  sizeBytes: number;
}

export default function QuestionPreview () {
  const { questionId } = useLocalSearchParams();
  const [question, setQuestion] = useState<Question>();
  const [currentTips, setCurrentTips] = useState<Tips[]>();
  const visibleTip = currentTips?.find(v => v.visible);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingImg, setIsLoadingImg] = useState(true);

  useEffect(() => {
      const getCurrentQuestion = async () => {
        try {
          setIsLoading(true);
          const { data } = await axiosInstance.get(`api/get-question-preview/${questionId}`);
  
          if (data) {
            console.log(data)
            setQuestion(data.data);
            setCurrentTips(data.data.tips);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
  
      getCurrentQuestion();
  
    }, []);

  return (
    <SafeAreaView className="px-4 gap-6">
      {isLoading ? (
        <View className="items-center">
          <Host matchContents>
            <CircularProgressIndicator />
          </Host>
        </View>
      ) : (
        <>
          <View className="flex gap-2">
            <View className="flex items-end">
              <Text>x/y</Text>
            </View>
            <View className="flex flex-row justify-between items-center">
              <View
                className="flex flex-row gap-3 px-4 py-2 items-center rounded-full w-1/3 bg-sky-300 border border-sky-900"
              >
                <MaterialIcons 
                  name={"arrow-back"}
                  size={20} 
                />
                <Text className="text-sky-900 font-semibold">Anterior</Text>
              </View>
              <View
                className="flex flex-row gap-3 px-4 py-2 items-center rounded-full w-1/3 bg-sky-300 border border-sky-900"
              >
                <Text className="text-sky-900 font-semibold">Próximo</Text>
                <MaterialIcons 
                  name={"arrow-forward"}
                  size={20} 
                />
              </View>
            </View>
          </View>

          <View className="flex flex-col gap-6">
            <View className="flex flex-row gap-2 items-center">
              <MaterialIcons 
                name={"record-voice-over"}
                size={20} 
              />
              <Text className="text-lg">Duração: XXs</Text>
            </View>
            <View className="flex flex-row items-center gap-3">
              <Pressable
                className="w-10 h-10 border bg-neutral-200 rounded-full items-center justify-center"
                onPress={() => {
                  Speech.speak(question?.description || '', {language: "pt-BR"});
                }}
              >
                <MaterialIcons 
                  name={
                    "play-circle"
                  } 
                  size={25} 
                />
              </Pressable>
              <Text className="text-xl font-medium">{question?.description}</Text>
            </View>
            
            <View className="border" >
              {question?.imageUrl ? (
                <>
                  <Image
                    source={{ uri: question.imageUrl }}
                    style={{ width: "100%", aspectRatio: 4 / 3 }}
                    contentFit="contain"
                    cachePolicy="none"
                    onLoad={() => console.log("Image loaded!")}
                    onError={(e) => console.log("Image error:", e.error)}
                    onLoadStart={() => setIsLoadingImg(true)}
                    onLoadEnd={() => setIsLoadingImg(false)}
                  />

                  {isLoadingImg && ( 
                    <View className="items-center justify-center w-full aspect-4/3">
                      <Host matchContents>
                        <CircularProgressIndicator />
                      </Host>
                    </View>
                  )}
                </>
              ) : (
                <View className="items-center">
                  <MaterialIcons 
                    name={"image-not-supported"}
                    color={"#b0afaf"}
                    size={60} 
                  />
                  <Text className="text-medium text-lg text-neutral-500">Imagem não encontrada</Text>
                </View>
              )}
            </View>

              
            <View className="flex flex-row justify-evenly">
              <Pressable
                className="w-10 h-10 border bg-neutral-200 rounded-full items-center justify-center"
                onPress={() => {
                  const invisibleTip = currentTips?.find(v => !v.visible);
                  if (invisibleTip) {
                    const newCurrentTips = currentTips?.map(v => {
                      if (v._id === invisibleTip._id) {
                        return {...v, visible: true };
                      }
                      return v;
                    });
                    setCurrentTips(newCurrentTips);
                    Speech.speak(invisibleTip.text);
                  }
                }}
              >
                <MaterialIcons name={"lightbulb"} 
                  size={20} color={visibleTip ? "#FFB703" : "black"} 
                />
              </Pressable>


            </View>

            <View className="flex flex-col gap-3">
                {currentTips?.map((tip, index) => {
                  if (tip.visible) {
                    return (
                      <View key={`question-tips-${index}`} className="flex-row gap-2 ">
                        <Pressable
                          className="w-10 h-10 border bg-neutral-200 rounded-full items-center justify-center"
                          onPress={() => {
                            Speech.speak(tip.text || '', {language: "pt-BR"});
                          }}
                        >
                          <MaterialIcons 
                            name={
                              // descriptionAudioPlayerStatus.playing ? "pause-circle" : 
                              "play-circle"
                            } 
                            size={25} 
                          />
                        </Pressable>
                        <View className="flex-row gap-1 items-center ">
                          <Text className="text-xl text-start">{tip.text}</Text>
                        </View>
                    
                      </View>
                    );
                  }
                })}
              </View>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}