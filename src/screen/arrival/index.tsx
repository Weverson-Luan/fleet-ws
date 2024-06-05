import React, { useEffect, useState } from "react";

import { useNavigation, useRoute } from "@react-navigation/native";

import { Header } from "../../components/header";
import { Button } from "../../components/button";

import {
  AsyncMessage,
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
import { getLastAsyncTimestamp } from "../../libs/async-storage";
import { stopLocationTask } from "../../tasks/backgroundLocationTask";
import { getStorageLocation } from "../../libs/async-storage/location-storage";
import { LatLng } from "react-native-maps";
import { Map } from "../../components/maps";
import { Locations } from "../../components/location";
import { getAddressLocation } from "../../utils/get-address-location/get-address-location";
import { LocationInfoProps } from "../../components/location-info";
import dayjs from "dayjs";
import { LoadIndicator } from "../../components/loading/styles";
import { Loading } from "../../components/loading";

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

  const [dataNotSynced, setDataNotSynced] = useState(false);
  const [coordinates, setCoordinates] = useState<LatLng[]>([]);
  const [departure, setDeparture] = useState<LocationInfoProps>(
    {} as LocationInfoProps
  );
  const [arrival, setArrival] = useState<LocationInfoProps | null>(null);
  const [isLoading, setIsloading] = useState(true);

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

  const handleRemoveVehicleUsage = async () => {
    realm.write(() => {
      realm.delete(historic);
    });

    await stopLocationTask();

    goBack();
  };

  /**
   * Função que faz o resgistro de uma cgeado do veiculo
   */
  const handleArrivalRegister = async () => {
    try {
      if (!historic) {
        return Alert.alert(
          "Error",
          "Não foi possivel obter os dados para registrar a chegada do veículo."
        );
      }

      const locations = await getStorageLocation();

      realm.write(() => {
        historic.status = "arrival";
        historic.updated_at = new Date();
        historic.coords.push(...locations);
      });

      await stopLocationTask();

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

  async function getLocationsInfo() {
    if (!historic) {
      return;
    }

    const lastSync = await getLastAsyncTimestamp();
    const updatedAt = historic!.updated_at.getTime();

    setDataNotSynced(updatedAt > lastSync);

    if (historic.status === "departure") {
      const locationStorage = await getStorageLocation();

      setCoordinates(locationStorage);
    } else {
      const last = historic?.coords.map((item) => {
        return {
          latitude: item.latitude,
          longitude: item.longitude,
        };
      });

      setCoordinates(last);
    }

    if (historic.coords[0]) {
      const departureStreeName = await getAddressLocation(historic.coords[0]);

      setDeparture({
        description: dayjs(new Date(historic?.coords[0]?.timestamp!)).format(
          "DD/MM/YYYY [ás] HH:mm"
        ),
        label: `Saindo em ${departureStreeName}`,
      });
    }

    if (historic.status === "arrival") {
      const lastLocation = historic.coords[historic.coords.length - 1];

      const arrivalStreeName = await getAddressLocation(lastLocation);
      setArrival({
        description: dayjs(new Date(lastLocation?.timestamp!)).format(
          "DD/MM/YYYY [ás] HH:mm"
        ),
        label: `Chegando em ${arrivalStreeName ?? ""}`,
      });
    }

    setIsloading(false);
  }

  useEffect(() => {
    getLocationsInfo();
  }, [historic]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Container>
      <Header title={title} />

      {coordinates?.length > 0 && <Map coordinates={coordinates} />}

      <Content>
        <Locations
          departure={{
            label: departure.label,
            description: departure.description,
          }}
          arrival={arrival}
        />

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

      {dataNotSynced && (
        <AsyncMessage>
          Sincronização da{" "}
          {historic?.status === "departure" ? "partida" : "chegada"} pendente
        </AsyncMessage>
      )}
    </Container>
  );
};

export { Arrival };
