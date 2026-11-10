import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import MaterialIcons, { MaterialIconsIconName } from "@react-native-vector-icons/material-icons";
import { RelativePathString, router } from "expo-router";
import { useEffect, useState } from "react";
import { Divider } from "react-native-elements";
import axiosInstance from "@/services/apiConfig";
import { useSession } from "@/context/ctx";
import { CircularProgressIndicator, Host } from "@expo/ui/jetpack-compose";
import FoldersList from "./FoldersList";

type Folders = {
  _id: string;
  name: string;
  itemsCount: string
}

export default function FoldersTabs () {
  const { user } = useSession();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [categories, setCategories] = useState<Folders[]>();

  useEffect(() => {
    const getCategories = async () => {
      try {
        setIsLoading(true);
        //@ts-ignore
        const user_id = JSON.parse(user)._id;

        const { data } = await axiosInstance.post("/api/get-categories", {
          therapist: user_id,
          search,
          kind: "question",
          itemModel: "Question",
        });
        
        setCategories(data?.folders);
      } catch(e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }

    getCategories();
  }, [search]);

  const handleCreate = async () => {
    try {
      setIsLoading(true);

      //@ts-ignore
      const user_id = JSON.parse(user)._id;
      const { data } = await axiosInstance.post("/api/create-category", {
        therapist: user_id,
        name: newCategory,
        kind: "question",
        itemModel: "Question",
      });

      setIsOpen(false);
      setNewCategory("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView>
      <KeyboardAwareScrollView className="gap-3">
        <View className="flex-row justify-around">
          <Pressable 
            className="flex flex-row gap-3 px-4 py-2 bg-neutral-200 border border-neutral-400 rounded-full"
          >
            <MaterialIcons name="playlist-remove" size={20} color={"#000000"}/>
            <Text className="font-semibold">Deletar</Text>
          </Pressable>
          <Pressable 
            className="flex flex-row gap-3 px-4 py-2 bg-neutral-200 border border-neutral-400 rounded-full"
            onPress={() => { setIsOpen(true), setNewCategory("");}}
          >
            <MaterialIcons name="playlist-add" size={20} color={"#000000"}/>
            <Text className="font-semibold">Adicionar</Text>
          </Pressable>
        </View>

        <View className="p-2 gap-3">
          <View className="flex-row items-center bg-neutral-200 rounded-full">
            <MaterialIcons name="search" color={"#b0afaf"} size={20} 
              style={{padding: 8, paddingRight: 0}}
            />
            <TextInput
              placeholder="Pesquisar categoria pelo nome..."
              value={search}
              onChangeText={(val) => setSearch(val)}
              className="flex-1"
            />
          </View>
        </View>

        {isLoading ? (
          <Host>
            <CircularProgressIndicator />
          </Host>
        ) : categories && categories.length ? (
          <FoldersList categories={categories} />
        ) : (
          <View className="flex flex-col items-center justify-center gap-3">
            <MaterialIcons 
              name="search-off"
              color={"#b0afaf"} size={60}
            />
            <Text className="text-lg text-neutral-400">Nenhuma categoria encontrada.</Text>
            <Pressable onPress={() => setIsOpen(true)}>
              <Text className="text-lg text-neutral-500 font-medium underline">
                Comece adicionando uma.
              </Text>
              </Pressable>
          </View>
        )}

        <Modal
          animationType="slide"
          transparent
          visible={isOpen}
          onRequestClose={() => {setIsOpen(false), setNewCategory("");}}
        >
          <Pressable onPress={() => setIsOpen(false)}
            className="flex-1 justify-center items-center p-6 bg-[rgba(0,0,0,0.5)]"  
          >
            <Pressable className="w-full bg-white p-5 gap-3 rounded-lg">
              <Pressable className="absolute top-3 right-3 z-1" onPress={() => {setIsOpen(false), setNewCategory("");}}>
                <MaterialIcons name="close" size={24} />
              </Pressable>
              <Text className="text-xl font-medium ">Nova Categoria</Text>

              <Divider />

              <TextInput
                placeholder="Nova categoria..."
                value={newCategory}
                onChangeText={(e) => setNewCategory(e)}
                editable={!isLoading}
                className="border rounded-md border-neutral-200"
              />

              <View className="flex flex-row">
                <Pressable
                  className="w-1/2 items-center p-3 border rounded-lg"
                  onPress={() => {setIsOpen(false), setNewCategory("");}}
                >
                  <Text className="font-medium">Cancelar</Text>
                </Pressable>
                <Pressable
                  className="w-1/2 items-center p-3 border rounded-lg"
                  onPress={handleCreate}
                >
                  <Text className="font-medium">Aceitar</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}