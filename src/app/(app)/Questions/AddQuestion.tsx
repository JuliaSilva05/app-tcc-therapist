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
import { useSession } from "@/context/ctx";
import { Blob } from 'expo-blob';
import { CircularProgressIndicator, Host } from "@expo/ui/jetpack-compose";
import { router } from "expo-router";

import { File } from "expo-file-system";
import { fetch } from "expo/fetch";

type Questions = {
  title: string;
  descriptionAudio?: any;
  description: string;
}

type Audio = {
  url: string | null;
  mimeType: string | null | undefined;
  durationSec: number;
  sizeBytes: number;
}

type Tips = {
  id: number;
  text: string;
  audio?: Audio | null;
}

export default function AddQuestion() {
  const { user } = useSession();

  const [title, setTitle] = useState("");
  const [descriptionAudio, setDescriptionAudio] = useState<Audio | null>(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [tips, setTips] = useState<Tips[]>([]);

  const [isRecOrPlaying, setIsRecOrPlaying] = useState(false);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const [isLoading, setIsLoading] = useState(false);

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

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (title.length && description.length && image !== null) {
        //@ts-ignore
        const user_id = JSON.parse(user)._id;
        const body = {
          therapist: user_id,
          title,
          descriptionAudio,
          description,
          image,
          tips,
        };
  
        const { data } = await axiosInstance.post("/api/create-question", body);
  
        console.log('data', data)
        if (data.ok) {
          Alert.alert("data ok");

          const { imageUpload, descriptionAudioUpload, tipsUploads } = data.uploads;
          
          const imageFile = new File(image);
          // const imageBlob = new Blob([image], { type: `image/${image.split(".").pop()}` });
          const imagePut = await fetch(imageUpload.putUrl, {
            method: 'PUT',
            headers: { 'Content-Type': imageUpload.contentType }, // must match what the server signed
            body: imageFile,
          });
          if (!imagePut.ok) throw new Error(`Upload failed ${imagePut.status}`);


          if (descriptionAudio && descriptionAudio.url !== null && descriptionAudio.mimeType !== null && descriptionAudioUpload !== null) {
            const descriptionAudioBlob = new Blob([descriptionAudio.url], { type: descriptionAudio.mimeType });

            const descriptionAudioPut = await fetch(descriptionAudioUpload.putUrl, {
              method: 'PUT',
              headers: { 'Content-Type': descriptionAudioUpload.contentType }, // must match what the server signed
              body: descriptionAudioBlob,
            });
            console.log(imagePut)
            if (!descriptionAudioPut.ok) throw new Error(`Upload failed ${descriptionAudioPut.status}`);
          }

          for (const tipUpload of tipsUploads) {
            const originalTip = tips.find(v => v.id === tipUpload.id);
            if (originalTip && originalTip.audio?.url) {
              const tipBlob = new Blob([originalTip?.audio?.url], { type: tipUpload.upload.contentType });
              const tipPut = await fetch(tipUpload.putUrl, {
                method: 'PUT',
                headers: { 'Content-Type': tipUpload.contentType }, // must match what the server signed
                body: tipBlob,
              })
              if (!tipPut.ok) throw new Error(`Upload failed ${tipPut.status}`);
            }
          }

          router.dismissTo("/(app)/Questions");
        }        
      } else {
        Alert.alert("É necessário no mínimo título, pergunta e imagem!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    };
  };
  
  const descriptionAudioPlayer = useAudioPlayer(descriptionAudio?.url, {
    updateInterval: 1000,
    downloadFirst: true,
  });
  const descriptionAudioPlayerStatus = useAudioPlayerStatus(descriptionAudioPlayer);
  
  useEffect(() => {
    const test = (audioRecorder: any) => {
      if (audioRecorder.isRecording || descriptionAudioPlayerStatus.playing) {
        setIsRecOrPlaying(true);
      } else {
        setIsRecOrPlaying(false);
      }
    };

    test(audioRecorder);
  }, [audioRecorder.isRecording, descriptionAudioPlayerStatus.playing]);

  console.log('recorderState', recorderState)
  
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

      {isLoading ? (
        <Host>
          <CircularProgressIndicator />
        </Host>
      ) : (
        <>
          <View className="gap-1">
            <Text className="text-base text-neutral-500 font-medium">
              Título da Questão na sua Lista
              <Text className="text-red-500"> *</Text>
            </Text>
            <TextInput 
              placeholder="Ex: Questão 1..."
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
                {descriptionAudio && (
                  <Pressable
                    className="w-8 h-8 border bg-neutral-200 rounded-full items-center justify-center"
                    onPress={() => {
                      if (descriptionAudioPlayerStatus.playing) {
                        console.log("sjfsdnfsf")
                        descriptionAudioPlayer.pause();
                      } else {
                        descriptionAudioPlayer.seekTo(0);
                        descriptionAudioPlayer.play();
                        console.log("loplololpllpo")
                      }
                    }}
                    disabled={recorderState.isRecording || isRecOrPlaying}
                  >
                    <MaterialIcons name={descriptionAudioPlayerStatus.playing ? "pause-circle" : "play-circle"} size={18} />
                  </Pressable>
                )}

                <Pressable
                  className="w-8 h-8 border bg-neutral-200 rounded-full items-center justify-center"
                  onPress={() => {
                    if (recorderState.isRecording) {
                      setDescriptionAudio({
                        url: recorderState.url ,
                        mimeType: recorderState.url  ? `audio/${recorderState.url?.split(".").pop()}` : null,
                        durationSec: Number((recorderState.durationMillis/1000).toFixed(0)),
                        sizeBytes: recorderState.fileSize,
                      });
                      stopRecording();
                    } else {
                      record();
                    }
                  }}
                  disabled={
                    // isRecOrPlaying
                    descriptionAudio !== null && descriptionAudioPlayerStatus?.playing
                  }
                >
                  <MaterialIcons name={recorderState.isRecording ? "stop-circle" : "mic"} 
                    size={20} color={recorderState.isRecording ? "red" : "black"} />
                </Pressable>

                <Text className="text-neutral-500 text-sm">
                  {recorderState.isRecording ? (
                    `${(recorderState.durationMillis/1000).toFixed(0)} s`
                  ) : descriptionAudio && !descriptionAudioPlayerStatus.playing ? (
                    `${descriptionAudioPlayerStatus.duration.toFixed(0)}s`
                  ) : descriptionAudio && descriptionAudioPlayerStatus.playing ? (
                    `${descriptionAudioPlayerStatus.currentTime.toFixed(0)}s/${descriptionAudioPlayerStatus.duration.toFixed(0)}s`
                  ) : null}
                </Text>
              </View>

              {descriptionAudio && (
                <Pressable
                  className="w-8 h-8 border bg-neutral-200 rounded-full items-center justify-center"
                  onPress={() => {
                    setDescriptionAudio(null);
                  }}
                  disabled={isRecOrPlaying}
                >
                  <MaterialIcons name="delete" size={18} />
                </Pressable>
              )}
            </View> 

          </View>

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

              })}

              <View className="items-center">
                <Pressable className="w-10 h-10 border bg-neutral-200 rounded-full items-center justify-center"
                  onPress={() => 
                    setTips([
                      ...tips,
                      {
                        id: tips.length ? tips[tips.length - 1].id + 1 : 1,
                        text: "",
                      },])
                  }
                >
                  <MaterialIcons name="add" size={30} />
                </Pressable>
              </View>
            </View>
          </View>
        </>
      ) }
        
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}