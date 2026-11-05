import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { Image } from "expo-image";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import Tips from "./Tips";
import axiosInstance from "@/services/apiConfig";

type Questions = {
  title: string;
  titleAudio?: any;
  description: string;
}

type Tips = {
  text: string;
  audio?: string | null;
}

export default function AddQuestion() {
  const [title, setTitle] = useState("");
  const [titleAudio, setTitleAudio] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [tips, setTips] = useState<Tips[]>([]);

  const [isRecOrPlaying, setIsRecOrPlaying] = useState(false);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
        // To record in the background, also set allowsBackgroundRecording: true
        // and enable the enableBackgroundRecording config plugin option.
      });
    })();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the camera is required.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const handleSubmit = async () => {
    try {
      if (title.length && description.length && image !== null) {
        const body = {
          title,
          titleAudio,
          description,
          image,
          tips,
        };
  
        const { data } = await axiosInstance.post("/api/create-question", body);
  
        console.log(data)
        if (data.ok) {
          Alert.alert("data ok");
        }
        
      } else {
        Alert.alert("É necessário no mínimo título, pergunta e imagem!");
      }
    } catch (e) {
      console.error(e);
    } finally {

    };
  };
  
  const titleAudioPlayer = useAudioPlayer(titleAudio, {
    updateInterval: 1000,
    downloadFirst: true,
  });
  const titleAudioPlayerStatus = useAudioPlayerStatus(titleAudioPlayer);
  console.log(titleAudioPlayerStatus)
  
  useEffect(() => {
    const test = (audioRecorder: any) => {
      if (audioRecorder.isRecording || titleAudioPlayerStatus.playing) {
        setIsRecOrPlaying(true);
      } else {
        setIsRecOrPlaying(false);
      }
    };

    test(audioRecorder);
  }, [audioRecorder.isRecording, titleAudioPlayerStatus.playing]);
  
  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView 
        contentContainerClassName="w-full p-4 gap-6 pb-32"
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex items-end">
          <Pressable 
            className="px-4 py-2 items-center rounded-full w-1/3 bg-sky-300 border border-sky-900"
            onPress={handleSubmit}
          >
            <Text className="text-sky-900 font-semibold">Criar</Text>
          </Pressable>
        </View>

        <View className="gap-1">
          <Text className="text-base text-neutral-500 font-medium">
            Título da Atividade na Lista
            <Text className="text-red-500"> *</Text>
          </Text>
          <TextInput 
            placeholder="Ex: Atividade 1..."
            className="text-base bg-neutral-200 shadow-md border-b-2 
                  border-neutral-500 rounded-t-md p-1"
            value={title}
            onChangeText={(e) => setTitle(e)}
          />
        </View>

        <View className="gap-1">
          <Text className="text-base text-neutral-500 font-medium">
            Pergunta/Enunciado
            <Text className="text-red-500"> *</Text>
          </Text>
          <TextInput 
            className="text-base bg-neutral-200 shadow-md border-b-2 
                  border-neutral-500 rounded-t-md p-1"
            value={description}
            onChangeText={(e) => setDescription(e)}
          />

          <View className="flex-row justify-around">
            <View className="flex-row gap-3 items-center">
              {titleAudio && (
                <Pressable
                  className="w-8 h-8 border bg-neutral-200 rounded-full items-center justify-center"
                  onPress={() => {
                    if (titleAudioPlayerStatus.playing) {
                      console.log("sjfsdnfsf")
                      titleAudioPlayer.pause();
                    } else {
                      titleAudioPlayer.seekTo(0);
                      titleAudioPlayer.play();
                      console.log("loplololpllpo")
                    }
                  }}
                  disabled={recorderState.isRecording || isRecOrPlaying}
                >
                  <MaterialIcons name={titleAudioPlayerStatus.playing ? "pause-circle" : "play-circle"} size={18} />
                </Pressable>
              )}

              <Pressable
                className="w-8 h-8 border bg-neutral-200 rounded-full items-center justify-center"
                onPress={() => {
                  if (recorderState.isRecording) {
                    stopRecording();
                    setTitleAudio(recorderState.url);
                  } else {
                    record();
                  }
                }}
                disabled={
                  // isRecOrPlaying
                  titleAudio !== null && titleAudioPlayerStatus?.playing
                }
              >
                <MaterialIcons name={recorderState.isRecording ? "stop-circle" : "mic"} 
                  size={20} color={recorderState.isRecording ? "red" : "black"} />
              </Pressable>

              <Text className="text-neutral-500 text-sm">
                {recorderState.isRecording ? (
                  `${(recorderState.durationMillis/1000).toFixed(0)} s`
                ) : titleAudio && !titleAudioPlayerStatus.playing ? (
                  `${titleAudioPlayerStatus.duration.toFixed(0)}s`
                ) : titleAudio && titleAudioPlayerStatus.playing ? (
                  `${titleAudioPlayerStatus.currentTime.toFixed(0)}s/${titleAudioPlayerStatus.duration.toFixed(0)}s`
                ) : null}
              </Text>
            </View>

            {titleAudio && (
              <Pressable
                className="w-8 h-8 border bg-neutral-200 rounded-full items-center justify-center"
                onPress={() => {
                  setTitleAudio(null);
                }}
                disabled={isRecOrPlaying}
              >
                <MaterialIcons name="delete" size={18} />
              </Pressable>
            )}
          </View> 

        </View>
        {/* <Text>Current Time: {titleAudioPlayerStatus.currentTime.toFixed(0)}s</Text>
        <Text>Duration: {titleAudioPlayerStatus.duration.toFixed(0)}s</Text> */}
        <View className="gap-1">
          <Text className="text-base text-neutral-500 font-medium">
            Imagem
            <Text className="text-red-500"> *</Text>
          </Text>

          <View className="flex-row gap-1">
            <Pressable
              className="w-1/2 flex-row p-2 gap-3 border bg-neutral-200 rounded-full items-center justify-center"
              onPress={takePhoto}
            >
              <MaterialIcons name="camera-alt" size={18} />
              <Text>Tirar foto</Text>
            </Pressable>
            <Pressable
              className="w-1/2 flex-row p-2 border gap-3 bg-neutral-200 rounded-full items-center justify-center"
              onPress={pickImage}
            >
              <MaterialIcons name="image" size={20} />
              <Text>Pegar da galeria</Text>
            </Pressable>
          </View>

          {image && <Image source={{ uri: image }} style={{ width: 200, height: 150}} />}
        </View>
          <Text>{isRecOrPlaying ? 'rec or playing' : 'not rec or plaaying'}</Text>
        <View className="gap-1">
          <Text className="text-base text-neutral-500 font-medium">
            Dicas
          </Text>
          <View className="flex-col gap-5">
            {tips?.map((tip, index) => {
              return (
                <Tips 
                  key={`${index}-tip-component`} 
                  index={index} 
                  currentTip={tip} 
                  tips={tips} 
                  setTips={setTips}
                  isRecOrPlaying={isRecOrPlaying}
                  setIsRecOrPlaying={setIsRecOrPlaying}
                />
              );
              // console.log(index, 'currentTip',tip);

              // const tipAudioPlayer = useAudioPlayer(tip.audio, {
              //   updateInterval: 1000,
              //   downloadFirst: true,
              // });
              // const tipAudioPlayerStatus = useAudioPlayerStatus(tipAudioPlayer);
              // console.log(tipAudioPlayerStatus)

              // return (
              //   <View key={`question-tips-${index}`} className="flex-col gap-3">
              //     <View className="flex-row gap-1 items-center ">
              //       <Text className="text-xl">{'\u2022'}</Text>
              //       <TextInput 
              //         placeholder={`Dica ${index + 1}`} 
              //         className="flex-1 text-base bg-neutral-200 shadow-md border-b-2 
              //           border-neutral-500 rounded-t-md p-1"
              //         value={tip.text}
              //         onChangeText={(e) => {
              //           setTips((current) => 
              //             current?.map(
              //               (currentTip, tipIndex) => 
              //                 tipIndex === index ? {
              //                   ...currentTip,
              //                   text: e,
              //                 } : currentTip
              //             )
              //           )
              //         }}
              //       />
              //     </View>

              //     <View className="flex-row justify-around">
              //       <View className="flex-row gap-1">
              //         {currentTip.audio ? (
              //           <Pressable
              //             className="w-8 h-8 border bg-neutral-200 rounded-full items-center justify-center"
              //             onPress={() => {}
                            
              //             }
              //           >
              //             <MaterialIcons name="play-circle" size={18} />
              //           </Pressable>
              //         ) : null}

              //         <Pressable
              //           className="w-8 h-8 border bg-neutral-200 rounded-full items-center justify-center"
              //           onPress={() => {}
              //           }
              //         >
              //           <MaterialIcons name="mic" size={20} />
              //         </Pressable>
              //       </View>

              //       <Pressable
              //         className="w-8 h-8 border bg-neutral-200 rounded-full items-center justify-center"
              //         onPress={() => 
              //           setTips(
              //             tips.filter(
              //               (_, tipIndex) =>
              //                 tipIndex !== index,
              //             ),
              //           )}
              //       >
              //         <MaterialIcons name="delete" size={18} />
              //       </Pressable>
              //     </View>
              //   </View>
              // )
            })}

            <View className="items-center">
              <Pressable className="w-10 h-10 border bg-neutral-200 rounded-full items-center justify-center"
                onPress={() => 
                  setTips([
                    ...tips,
                    {
                      text: "",
                    },])
                }
              >
                <MaterialIcons name="add" size={30} />
              </Pressable>
            </View>
          </View>
        </View>
        
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}