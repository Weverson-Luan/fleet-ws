import React from "react";

import { useNavigation, useRoute } from "@react-navigation/native";

import { Header } from "../../components/header";
import { Button } from "../../components/button";

import {
  Container,
  Content,
  Description,
  Footer,
  Label,
  LicensePlate,
} from "./styles";
import { ButtonIcon } from "../../components/button-icon";
import { X } from "phosphor-react-native";
import { useObject, useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";
import { BSON } from "realm";
import { Alert } from "react-native";

type IRouteParasmProps = {
  params: {
    id: string;
  };
};
const Arrival = () => {
  const { params } = useRoute() as IRouteParasmProps;

  const realm = useRealm();

  const historic = useObject(
    Historic,
    new BSON.UUID(params.id) as string | any
  );

  const title = historic?.status === "departure" ? "Chegada" : "Detalhes";

  const { goBack } = useNavigation();

  /**
   * Cancelar utilização do veículo
   */
  const handleAlertToRemoveVehicleUsage = async () => {
    Alert.alert("Cancelar", "Cancelar utilização do veículo?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => handleRemoveVehicleUsage() },
    ]);
  };

  const handleRemoveVehicleUsage = () => {
    realm.write(() => {
      realm.delete(historic);
    });

    goBack();
  };

  /**
   * Função que faz o resgistro de uma cgeado do veiculo
   */
  const handleArrivalRegister = () => {
    try {
      if (!historic) {
        return Alert.alert(
          "Error",
          "Não foi possivel obter os dados para registrar a chegada do veículo."
        );
      }

      realm.write(() => {
        historic.status = "arrival";
        historic.updated_at = new Date();
      });

      Alert.alert("Chegada", "Chega registrada com sucesso!");

      goBack();
    } catch (error) {
      console.log("Failed to register", error);
      return Alert.alert(
        "Error",
        "Não foi possivel registrar a chegada do veículo."
      );
    }
  };

  return (
    <Container>
      <Header title={title} />

      <Content>
        <Label>Placa do veículo</Label>

        <LicensePlate>{historic?.license_plate}</LicensePlate>

        <Label>Finalidade</Label>

        <Description>{historic?.description}</Description>
      </Content>
      {historic?.status === "departure" && (
        <Footer>
          <ButtonIcon icon={X} onPress={handleAlertToRemoveVehicleUsage} />
          <Button title="Registrar chegada" onPress={handleArrivalRegister} />
        </Footer>
      )}
    </Container>
  );
};

export { Arrival };
