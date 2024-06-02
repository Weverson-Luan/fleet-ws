/**
 * IMPORTS
 */

import { useEffect, useRef, useState } from "react";
import {
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useUser } from "@realm/react";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  useForegroundPermissions,
  watchPositionAsync,
  LocationAccuracy,
  LocationSubscription,
  LocationObjectCoords,
  requestBackgroundPermissionsAsync,
} from "expo-location";

import { Car } from "phosphor-react-native";

// components
import { Button } from "../../components/button";
import { Header } from "../../components/header";
import { LicensePlateInput } from "../../components/license-plate-input";
import { TextAreaInput } from "../../components/text-area-input";
import { Loading } from "../../components/loading";
import { LocationInfo } from "../../components/location-info";

// libs
import { useRealm } from "../../libs/realm";
import { Historic } from "../../libs/realm/schemas/Historic";

// utils
import { licensePlateValidate } from "../../utils/license-plate-validate";

// styles
import { Container, Content, Message } from "./styles";
import { getAddressLocation } from "../../utils/get-address-location/get-address-location";
import { Map } from "../../components/maps";

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
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [currentCoords, setCurrentCoords] =
    useState<LocationObjectCoords | null>(null);

  const [locationForegroundPermission, requesLocationForegroundPermission] =
    useForegroundPermissions();
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

      if (!currentCoords?.latitude && !currentCoords?.longitude) {
        return Alert.alert(
          "Localização",
          "Não foi possível obter a localização atual. Tente novamente."
        );
      }

      setIsRegistring(true);

      const backgroundPermissions = await requestBackgroundPermissionsAsync();

      if (!backgroundPermissions.granted) {
        setIsRegistring(false);
        return Alert.alert(
          "Localização",
          'É necessário permitir que o App tenha acesso localização em segundo plano. Acesse as configurações do dispositivo e habilite "Permitir o tempo todo."'
        );
      }

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

  /**
   * Função para recuperar permissão do usuário
   */
  useEffect(() => {
    requesLocationForegroundPermission();
  }, []);

  /**
   * Função para observar as cordernadas em tempo real
   */
  useEffect(() => {
    if (!locationForegroundPermission?.granted) {
      return;
    }

    let subscription: LocationSubscription;

    watchPositionAsync(
      {
        accuracy: LocationAccuracy.High, // nivel de pressisão
        timeInterval: 1000,
      },
      (location) => {
        setCurrentCoords(location.coords);
        console.log("address", location.coords);

        getAddressLocation(location.coords).then((address) => {
          if (address) {
            setCurrentAddress(address);
          }
        });
      }
    )
      .then((response) => (subscription = response))
      .finally(() => {
        setIsLoadingLocation(false);
      });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [locationForegroundPermission]);

  if (!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header title="Saída" />
        <Message>
          Você precisa permitir que o aplicativo tenha acesso a localização para
          acessar essa funcionalidade. Por favor, acesse as configurações do seu
          dispositivo para conceder a permissão ao aplicativo.
        </Message>
      </Container>
    );
  }

  if (isLoadingLocation) {
    return <Loading />;
  }

  return (
    <Container>
      <Header title="Saída" />

      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          {currentCoords && <Map coordinates={[currentCoords]} />}
          <Content>
            {currentAddress && (
              <LocationInfo
                label="Localização atual"
                description={currentAddress}
                icon={Car}
              />
            )}
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
