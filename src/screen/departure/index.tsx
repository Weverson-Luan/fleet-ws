/**
 * IMPORTS
 */

import { useRef, useState } from "react";
import {
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { useUser } from "@realm/react";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// components
import { Button } from "../../components/button";
import { Header } from "../../components/header";
import { LicensePlateInput } from "../../components/license-plate-input";
import { TextAreaInput } from "../../components/text-area-input";

// utils
import { licensePlateValidate } from "../../utils/license-plate-validate";

// styles
import { Container, Content } from "./styles";
import { useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";
import { useNavigation } from "@react-navigation/native";

const keyboardAvoidViewBehavior =
  Platform.OS === "android" ? "height" : "position";
export function Departure() {
  const descriptionRef = useRef<TextInput>(null);
  const realm = useRealm();
  const { id } = useUser();
  const { goBack } = useNavigation();

  const licensePLateRef = useRef<TextInput>(null);

  const [description, setDescription] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  const [isRegistring, setIsRegistring] = useState(false);

  /**
   * Função que registar uma saída de um veículo.
   * @returns
   */
  const handleDepartureRegister = async () => {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePLateRef.current?.focus();
        return Alert.alert(
          "Placa inválida",
          "A plava é inválida. Por favor, informe a placa correta do veículo.(XXX0000)"
        );
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus();
        return Alert.alert(
          "Finalidade",
          "Por favor, informe a finalidade de utilização do veículo."
        );
      }
      setIsRegistring(true);

      realm.write(() => {
        realm.create(
          "Historic",
          Historic.generate({
            user_id: id,
            license_plate: licensePlate.toUpperCase(),
            description,
          })
        );
      });

      Alert.alert("Saída", "Saída do veículo registrada com sucesso!");

      goBack();
    } catch (error) {
      setIsRegistring(false);
      return Alert.alert(
        "Error",
        "Não foi possivel registrar a saída do veículo."
      );
    }
  };
  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          <Content>
            <LicensePlateInput
              ref={licensePLateRef}
              label="Placa do veículo"
              placeholder="BRA1234"
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType="next"
              onChangeText={setLicensePlate}
            />

            <TextAreaInput
              ref={descriptionRef}
              label="Finalidade"
              placeholder="Vou utilizar o veículo para..."
              onSubmitEditing={handleDepartureRegister}
              returnKeyType="send"
              blurOnSubmit
              onChangeText={setDescription}
            />

            <Button
              title="Registrar Saída"
              onPress={handleDepartureRegister}
              isLoading={isRegistring}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  );
}
