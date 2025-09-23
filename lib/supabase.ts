// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createClient, processLock } from "@supabase/supabase-js";
// import * as aesjs from "aes-js";
// import * as SecureStore from "expo-secure-store";
// import { AppState, Platform } from "react-native";
// import "react-native-get-random-values";
// import "react-native-url-polyfill/auto";

// // As Expo's SecureStore does not support values larger than 2048
// // bytes, an AES-256 key is generated and stored in SecureStore, while
// // it is used to encrypt/decrypt values stored in AsyncStorage.
// class LargeSecureStore {
//   private async _encrypt(key: string, value: string) {
//     const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));
//     const cipher = new aesjs.ModeOfOperation.ctr(
//       encryptionKey,
//       new aesjs.Counter(1)
//     );
//     const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));
//     await SecureStore.setItemAsync(
//       key,
//       aesjs.utils.hex.fromBytes(encryptionKey)
//     );
//     return aesjs.utils.hex.fromBytes(encryptedBytes);
//   }
//   private async _decrypt(key: string, value: string) {
//     const encryptionKeyHex = await SecureStore.getItemAsync(key);
//     if (!encryptionKeyHex) {
//       return encryptionKeyHex;
//     }
//     const cipher = new aesjs.ModeOfOperation.ctr(
//       aesjs.utils.hex.toBytes(encryptionKeyHex),
//       new aesjs.Counter(1)
//     );
//     const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));
//     return aesjs.utils.utf8.fromBytes(decryptedBytes);
//   }
//   async getItem(key: string) {
//     const encrypted = await AsyncStorage.getItem(key);
//     if (!encrypted) {
//       return encrypted;
//     }
//     return await this._decrypt(key, encrypted);
//   }
//   async removeItem(key: string) {
//     await AsyncStorage.removeItem(key);
//     await SecureStore.deleteItemAsync(key);
//   }
//   async setItem(key: string, value: string) {
//     const encrypted = await this._encrypt(key, value);
//     await AsyncStorage.setItem(key, encrypted);
//   }
// }

// export const supabase = createClient(
//   process.env.EXPO_PUBLIC_SUPABASE_URL || "",
//   process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
//   {
//     auth: {
//       ...(Platform.OS !== "web"
//         ? { storage: AsyncStorage }
//         : {
//             storage: new LargeSecureStore(),
//             autoRefreshToken: true,
//             persistSession: true,
//             detectSessionInUrl: false,
//           }),
//       autoRefreshToken: true,
//       persistSession: true,
//       detectSessionInUrl: false,
//       lock: processLock,
//     },
//   }
// );
// // Tells Supabase Auth to continuously refresh the session automatically
// // if the app is in the foreground. When this is added, you will continue
// // to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// // `SIGNED_OUT` event if the user's session is terminated. This should
// // only be registered once.
// if (Platform.OS !== "web") {
//   AppState.addEventListener("change", (state) => {
//     if (state === "active") {
//       supabase.auth.startAutoRefresh();
//     } else {
//       supabase.auth.stopAutoRefresh();
//     }
//   });
// }
