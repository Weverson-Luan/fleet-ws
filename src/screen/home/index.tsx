/**
 * IMPORTS
 */

import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";

import { useNavigation } from "@react-navigation/native";

import dayjs from "dayjs";
import Toast from "react-native-toast-message";

// realm
import { Realm } from "@realm/react";
import { Historic } from "../../libs/realm/schemas/Historic";
import { useQuery, useRealm } from "../../libs/realm";

// components
import { CarStatus } from "../../components/car-status";
import { HeaderHome } from "../../components/header-home";

// styles
import { Container, Content, Label } from "./styles";
import { HistoricCard, HistoricCardProps } from "../../components/history-card";
import { useUser } from "@realm/react";
import {
  getLastAsyncTimestamp,
  saveLastSyncTimestamp,
} from "../../libs/async-storage";
import { TopMessage } from "../../components/top-message";
import { CloudArrowUp } from "phosphor-react-native";

export function Home() {
  const { navigate } = useNavigation();

  const historic = useQuery(Historic);
  const user = useUser();

  const realm = useRealm();

  const [vehicleInUse, setvehicle] = useState<Historic | null>(null);
  const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>(
    []
  );
  const [percentageToSync, setPercentageToSync] = useState<string | null>(null);

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
  async function fetchHistoric() {
    try {
      const response = historic.filtered(
        "status = 'arrival' SORT(created_at DESC)"
      );

      const lastSync = await getLastAsyncTimestamp();
      const formattedHistoric = response.map((item) => {
        return {
          id: item._id.toString(),
          licensePlate: item.license_plate,
          isSync: lastSync > item.updated_at!.getTime(),
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

  async function progressNotification(
    transferred: number,
    transferable: number
  ) {
    const percentage = (transferred / transferable) * 100;

    if (percentage === 100) {
      await saveLastSyncTimestamp();

      await fetchHistoric();
      setPercentageToSync(null);
      Toast.show({
        type: "info",
        text1: "Todos os dados estão sincronizados",
      });
    }

    if (percentage < 100) {
      setPercentageToSync(`${percentage.toFixed(0)}% sincronizado.`);
    }
  }

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

  useEffect(() => {
    realm.subscriptions.update((mutableSubs, realm) => {
      const historicByUserQuery = realm
        .objects("Historic")
        .filtered(`user_id = '${user.id}'`);

      mutableSubs.add(historicByUserQuery, { name: "hostoric_by_user" });
    });
  }, [realm]);

  useEffect(() => {
    const syncSession = realm.syncSession;

    if (!syncSession) {
      return;
    }

    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      progressNotification
    );

    return () => {
      syncSession.removeProgressNotification(progressNotification);
    };
  }, []);
  return (
    <Container>
      {percentageToSync && (
        <TopMessage title={percentageToSync} icon={CloudArrowUp} />
      )}
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
