import MaterialIcons from "@react-native-vector-icons/material-icons";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mock = [
  {
    _id: "1",
    patientDisplayName: "asdfasfsa",
    status:"active",
  },
  {
    _id: "2",
    patientDisplayName: "lolopkllihl",
    status:"archived",
  },
  {
    _id: "3",
    patientDisplayName: "wwwwwwww",
    status:"pending",
  },
  {
    _id: "4",
    patientDisplayName: "ccccccc",
    status:"rejected",
  },
  {
    _id: "5",
    patientDisplayName: "bbbbbbbbbbbbb",
    status:"active",
  },
]

type Patients = {
  _id: string;
  patient: string;
  patientDisplayName: string;
  status: string;
}

interface Statuses {
  [key: string]: {
    label: string;
    color: string;
  }
}

const STATUSES: Statuses = {
  pending: {
    label: "Pendente",
    color: "#FF8D28",
  },
  active: {
    label: "Ativo",
    color: "#34C759",
  },
  archived: {
    label: "Arquivado",
    color: "#000000",
  },
  rejected: {
    label: "Rejeitado",
    color: "#FF383C",
  },
};

export default function PatientsList({patients}:{patients: Patients[]}) {
  
  return (
    <SafeAreaView>
      {patients.map(item => {
        const statusInfo = STATUSES[`${item.status}`];

        return (
          <Pressable 
            key={item._id}
            className="flex flex-row mx-2 items-center justify-between border-t border-t-neutral-400"
            onPress={() => {
              if (item.status === "active" || item.status === "archived") {
                router.navigate({
                  pathname: "/Patients/PatientProfile",
                  params: {
                    linkId: item._id,
                    patientId: item.patient,
                  }
                });
              }
            }}
          >
              <View className="flex-1 flex-row items-center gap-3 my-3">
                <View className="w-10 h-10 p-1 items-center justify-center rounded-full border">
                  <MaterialIcons name="person" size={25} />
                </View>
                
                <View className="gap-0">
                  <Text className="text-lg truncate">{item.patientDisplayName}</Text>
                  <Text className={`text-sm`} style={{color: statusInfo.color}}>
                    {statusInfo.label}
                  </Text>
                </View>
              </View>
            
            {item.status === "active" || item.status === "archived" ? 
              <MaterialIcons name="chevron-right" size={30} /> 
            : null}
          </Pressable>
        )
      })}
    </SafeAreaView>
  )
}