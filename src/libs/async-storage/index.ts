/**
 * IMPORTS
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_ASSYNC_KEY = "@ignitefleet:last_sync";

/**
 * função para salvar a última data.
 * @returns
 */
export async function saveLastSyncTimestamp() {
  const timestamp = new Date().getTime();

  await AsyncStorage.setItem(STORAGE_ASSYNC_KEY, timestamp.toString());

  return timestamp;
}

/**
 * função para buscar a última data.
 * @returns
 */
export async function getLastAsyncTimestamp() {
  const timestamp = await AsyncStorage.getItem(STORAGE_ASSYNC_KEY);

  return Number(timestamp);
}
