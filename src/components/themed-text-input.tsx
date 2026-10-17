import { View, Text, TextInput, type ViewProps } from 'react-native';

type Props = ViewProps & {
  title: string;
  placeholder: string;
  onChangeText: any;
  inputType: string;
  keyboardType?: string;
}

const textInputClassName = "text-base bg-neutral-200 shadow-md border-2 border-neutral-400 rounded-[16px] p-1";

export function ThemedTextInput({
  title, placeholder, onChangeText, inputType
} : Props) {
  return (
    <View className="gap-1">
      <Text className="text-base text-neutral-400">{title}</Text>
      <TextInput
        className={textInputClassName}
        placeholder={placeholder}
        onChangeText={
          onChangeText
        }
        keyboardType={
          inputType === "email' ? "email-adress" : "default"
        }
      />
    </View>
  );
}