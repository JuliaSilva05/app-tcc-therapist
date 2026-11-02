import { SafeAreaView } from "react-native-safe-area-context";
import { useLocation } from 'react-router-dom';
import { Pressable, Text, TextInput, useWindowDimensions, View } from "react-native";
import { RelativePathString, router, usePathname } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaterialIcons, { MaterialIconsIconName } from "@react-native-vector-icons/material-icons";
import { useState } from "react";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

// const renderScene = SceneMap({
//   all: FirstRoute,
//   categories: SecondRoute,
// });

const renderScene = ({ route } : { route: { key: string, title: string} }) => {
  switch (route.key) {
    case 'all':
      return (
        <View>
          <Text>aaaaaaaaaaaaaaa</Text>
        </View>
      )
      // return <FirstRoute foo={props.foo} />;
    case 'categories':
      return (
        <View>
          <Text>bbbbbbbbbbbbbbb</Text>
        </View>
      )
      // return <SecondRoute />;
    default:
      return null;
  }
};

const routes = [
  { key: 'all', title: 'Todas' },
  { key: 'categories', title: 'Categorias' },
];

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
  const layout = useWindowDimensions();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "categories">("all");
  const [index, setIndex] = useState(0);
  
  return (
    <KeyboardAwareScrollView contentContainerClassName="gap-3">
      <TabView
        navigationState={{ index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={props => 
          <TabBar {...props} style={{
            backgroundColor: "#219EBC",
            
          }} />
        }
      />
      {/* <SafeAreaView> */}

        <View className="flex-row justify-around">
          <StyledPressable title="Arquivar" icon="person-remove" />
          <StyledPressable title="Adicionar" icon="person-add" link="/Question/AddQuestion"/>
        </View>

        <View className="p-2 gap-3">
          <View className="flex-row items-center bg-neutral-200 rounded-full">
            <MaterialIcons name="search" color={"#b0afaf"} size={20} 
              style={{padding: 8, paddingRight: 0}}
            />
            <TextInput
              placeholder="Pesquisar paciente pelo nome..."
              value={search}
              onChangeText={(val) => setSearch(val)}
              className="flex-1"
            />
          </View>
        </View>

          


      {/* </SafeAreaView> */}
    </KeyboardAwareScrollView>
  )
}