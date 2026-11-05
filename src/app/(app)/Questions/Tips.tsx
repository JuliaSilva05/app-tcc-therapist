import MaterialIcons from "@react-native-vector-icons/material-icons";
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus, useAudioRecorder, useAudioRecorderState } from "expo-audio";
import { useEffect } from "react";
import { Pressable, TextInput, View, Text, Alert } from "react-native";

type Tip = {
  text: string;
  audio?: string | null;
}

type Props = {
  index: number;
  currentTip: Tip;
  tips: Tip[];
  setTips: (tip: any) => void;
  isRecOrPlaying: boolean;
  setIsRecOrPlaying: (value: boolean) => void;
}

export default function Tips({index, currentTip, tips, setTips, isRecOrPlaying, setIsRecOrPlaying} : Props) {
  console.log(index, 'currentTip',currentTip);

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

  const tipAudioPlayer = useAudioPlayer(currentTip.audio, {
    updateInterval: 1000,
    downloadFirst: true,
  });
  const tipAudioPlayerStatus = useAudioPlayerStatus(tipAudioPlayer);
  console.log(tipAudioPlayerStatus)

  useEffect(() => {
    const test = (audioRecorder: any) => {
      if (audioRecorder.isRecording || tipAudioPlayerStatus.playing) {
        setIsRecOrPlaying(true);
      } else {
        setIsRecOrPlaying(false);
      }
    };

    test(audioRecorder);
  }, [audioRecorder.isRecording, tipAudioPlayerStatus.playing]);

  return (
    <View key={`question-tips-${index}`} className="flex-col gap-3">
      <View className="flex-row gap-1 items-center ">
        <Text className="text-xl">{'\u2022'}</Text>
        <TextInput 
          placeholder={`Dica ${index + 1}`} 
          className="flex-1 text-base bg-neutral-200 shadow-md border-b-2 
            border-neutral-500 rounded-t-md p-1"
          value={currentTip.text}
          onChangeText={(e) => {
            setTips((current: any[]) => 
              current?.map(
                (tip, tipIndex) => 
                  tipIndex === index ? {
                    ...tip,
                    text: e,
                  } : tip
              )
            )
          }}
        />
      </View>

      <View className="flex-row justify-around">
        <View className="flex-row gap-3 items-center">
          {currentTip.audio ? (
            <Pressable
              className="w-8 h-8 border bg-neutral-200 rounded-full items-center justify-center"
              onPress={() => {
                if (tipAudioPlayerStatus.playing) {
                  console.log("sjfsdnfsf")
                  tipAudioPlayer.pause();
                } else {
                  tipAudioPlayer.seekTo(0);
                  tipAudioPlayer.play();
                  console.log("loplololpllpo")
                }
              }}
              disabled={recorderState.isRecording}
            >
              <MaterialIcons name={tipAudioPlayerStatus.playing ? "pause-circle" : "play-circle"} size={18} />
            </Pressable>
          ) : null}

          <Pressable
            className="w-8 h-8 border bg-neutral-200 rounded-full items-center justify-center"
            onPress={() => {
              if (recorderState.isRecording) {
                stopRecording();
                // setTitleAudio(recorderState.url);
                setTips((current: any[]) => 
                  current?.map(
                    (tip, tipIndex) => 
                      tipIndex === index ? {
                        ...tip,
                        audio: recorderState.url,
                      } : tip
                  )
                )
              } else {
                record();
              }
            }}
            disabled={
              // isRecOrPlaying || 
              currentTip.audio !== null && tipAudioPlayerStatus?.playing
            }
          >
            <MaterialIcons name={recorderState.isRecording ? "stop-circle" : "mic"} 
              size={20} color={recorderState.isRecording ? "red" : "black"} />
          </Pressable>

          <Text className="text-neutral-500 text-sm">
            {recorderState.isRecording ? (
              `${(recorderState.durationMillis/1000).toFixed(0)} s`
            ) : currentTip.audio && !tipAudioPlayerStatus.playing ? (
              `${tipAudioPlayerStatus.duration.toFixed(0)}s`
            ) : currentTip.audio && tipAudioPlayerStatus.playing ? (
              `${tipAudioPlayerStatus.currentTime.toFixed(0)}s/${tipAudioPlayerStatus.duration.toFixed(0)}s`
            ) : null}
          </Text>
        </View>

        <View className="flex-row gap-3 items-center">
          {currentTip.audio ? (
            <Pressable
              className="w-8 h-8 border bg-neutral-200 rounded-full items-center justify-center"
              onPress={() => 
                setTips((current: any[]) => 
                  current?.map(
                    (tip, tipIndex) => 
                      tipIndex === index ? {
                        ...tip,
                        audio: null,
                      } : tip
                  )
                )}
                
              disabled={isRecOrPlaying}
            >
              <MaterialIcons name="close" size={18} />
            </Pressable>
          ) : null}

          <Pressable
            className="w-8 h-8 border bg-neutral-200 rounded-full items-center justify-center"
            onPress={() => 
              setTips(
                tips.filter(
                  (_, tipIndex) =>
                    tipIndex !== index,
                ),
              )}
            disabled={isRecOrPlaying}
          >
            <MaterialIcons name="delete" size={18} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}