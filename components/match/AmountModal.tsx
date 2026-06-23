import { KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { M } from "./matchStyles";

interface AmountModalProps {
  visible: boolean; title: string; placeholder: string;
  value: string; onChange: (v: string) => void;
  onSubmit: () => void; onCancel: () => void;
}

export function AmountModal({ visible, title, placeholder, value, onChange, onSubmit, onCancel }: AmountModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={M.modalWrap}>
        <View style={M.modal}>
          <Text style={M.modalTitle}>{title}</Text>
          <Text style={M.modalSub}>Numbers only</Text>
          <View style={M.divider} />
          <TextInput
            style={[M.modalInput, { fontSize: 32, letterSpacing: -0.5 }]}
            placeholder={placeholder}
            placeholderTextColor="#333"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            maxLength={6}
            autoFocus
          />
          <View style={M.divider} />
          <TouchableOpacity style={M.amberBtn} onPress={onSubmit} activeOpacity={0.75}>
            <Text style={M.amberBtnText}>SUBMIT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={M.cancelBtn} onPress={onCancel}>
            <Text style={M.cancelText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
