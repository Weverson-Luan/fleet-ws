/**
 * IMPORTS
 */

import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";

import { useNavigation } from "@react-navigation/native";

import dayjs from "dayjs";

// realm
import { Historic } from "../../libs/realm/schemas/Historic";
import { useQuery, useRealm } from "../../libs/realm";

// components
import { CarStatus } from "../../components/car-status";
import { HeaderHome } from "../../components/header-home";

// styles
import { Container, Content, Label } from "./styles";
import { HistoricCard, HistoricCardProps } from "../../components/history-card";

export function Home() {
  const { navigate } = useNavigation();

  const historic = useQuery(Historic);
  const realm = useRealm();

  const [vehicleInUse, setvehicle] = useState<Historic | null>(null);
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>(
    []
  );

  const handleRegisterMovement = () => {
    if (vehicleInUse?._id) {
      return navigate("arrival", { id: vehicleInUse?._id?.toString() });
    } else {
      navigate("departure");
    }
  };

  /**
   * Buscando veiculo em uso
   */
  const handleFetchVehicleInUse = () => {
    try {
      const vehicle = historic.filtered("status = 'departure'")[0];

      setvehicle(vehicle);
    } catch (error) {
      Alert.alert(
        "Veículo em uso",
        "Não foi possível carregar o veículo em uso."
      );
    }
  };

  /**
   * Buscando historico de uso dos veiuclos
   */
  function fetchHistoric() {
    try {
      const response = historic.filtered(
        "status = 'arrival' SORT(created_at DESC)"
      );

      const formattedHistoric = response.map((item) => {
        return {
          id: item._id.toString(),
          licensePlate: item.license_plate,
          isSync: false,
          created: dayjs(item.created_at).format(
            "[Saída em] DD/MM/YYYY [às] HH:mm"
          ),
        };
      });

      setVehicleHistoric(formattedHistoric);
    } catch (error) {
      console.log(error);
      Alert.alert("Histórico", "Não foi possível carregar o histórico.");
    }
  }

  /**
   * Navegando usuário para tela de detalhes
   * @param id
   */
  const handleHistoricDetails = (id: string) => {
    navigate("arrival", { id: id });
  };

  useEffect(() => {
    fetchHistoric();
  }, [historic]);

  useEffect(() => {
    handleFetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener("change", () => handleFetchVehicleInUse());

    return () => {
      if (realm && !realm.isClosed) {
        realm.removeListener("change", handleFetchVehicleInUse);
      }
    };
  }, []);
  return (
    <Container>
      <HeaderHome />

      <Content>
        <CarStatus
          onPress={handleRegisterMovement}
          licensePlate={vehicleInUse?.license_plate}
        />

        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          data={vehicleHistoric}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <HistoricCard
              data={item}
              onPress={() => handleHistoricDetails(item.id!)}
            />
          )}
          ListEmptyComponent={<Label>Nenhum registro de utilização.</Label>}
        />
      </Content>
    </Container>
  );
}
