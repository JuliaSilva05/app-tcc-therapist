import { SafeAreaView } from "react-native-safe-area-context";
import { useLocation } from 'react-router-dom';
import { Pressable, Text, TextInput, useWindowDimensions, View } from "react-native";
import { RelativePathString, router, usePathname } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaterialIcons, { MaterialIconsIconName } from "@react-native-vector-icons/material-icons";
import { useState } from "react";
import { TabView, SceneMap, TabBar, TabBarIndicator } from 'react-native-tab-view';
import QuestionsTab from "./QuestionsTab";
import FoldersTab from "./FoldersTab";

const renderScene = ({ route } : { route: any }) => {
  switch (route.key) {
    case 'all':
      return <QuestionsTab />;
    case 'categories':
      return <FoldersTab />;
    default:
      return null;
  }
};

const StyledPressable = (
  {title, icon, link} : {title: string, icon: MaterialIconsIconName, link?: RelativePathString }
) => (
  <Pressable 
    className="flex flex-row gap-3 px-4 py-2 bg-neutral-200 border border-neutral-400 rounded-full"
    onPress={() => link && router.navigate(link)}
  >
    <MaterialIcons name={icon} size={20} color={"#000000"}/>
    <Text className="font-semibold">{title}</Text>
  </Pressable>
);

export default function Questions () {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'Todas' },
    { key: 'categories', title: 'Categorias' },
  ]);
  
  return (
    <KeyboardAwareScrollView contentContainerClassName="flex-1 gap-3">
      <TabView
        navigationState={{ index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={props =>
          <TabBar {...props} 
            style={{
              backgroundColor: "#219EBC",             
            }} 
            indicatorStyle={{
              backgroundColor: '#FFFFFF',
            }}
          />
        }
      />

      {/* {index === 0 ? (
        <QuestionsList />
      )
      : index === 1 ?(
        <FoldersList />
      ) : null} */}

      {/* <View className="flex-row justify-around">
        <StyledPressable title="Arquivar" icon="person-remove" />
        <StyledPressable title="Adicionar" icon="person-add" link="/Questions/AddQuestion"/>
      </View>

      <View className="p-2 gap-3">
        <View className="flex-row items-center bg-neutral-200 rounded-full">
          <MaterialIcons name="search" color={"#b0afaf"} size={20} 
            style={{padding: 8, paddingRight: 0}}
          />
          <TextInput
            placeholder={`Pesquisar ${index === 0 ? "paciente" : "categoria" } pelo nome...`}
            value={search}
            onChangeText={(val) => setSearch(val)}
            className="flex-1"
          />
        </View>
      </View> */}

          


    </KeyboardAwareScrollView>
  )
}