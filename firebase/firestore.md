// import {
//   addDoc,
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   serverTimestamp,
//   setDoc,
// } from "firebase/firestore";
// import { BotInfo, UserInfo } from "../interfaces";
// import { db } from "./firebaseClient";

// export const uploadUserInfo = (userInfo: UserInfo) => {
//   const docRef = doc(db, "users", userInfo.user_id); // using the authentication uid as the document id
//   const todoUpdated = {
//     email: userInfo.email,
//     lastupdated: serverTimestamp(),
//   };
//   setDoc(docRef, todoUpdated, { merge: true });
// };

// // updload bot info
// export const uploadBotInfo = async (user_id, botInfo: BotInfo) => {
//   // botInfo = {
//   //     name: botInfo.name,
//   //     description: botInfo.description,
//   //     lastupdated: serverTimestamp(),
//   //     language: botInfo.language,
//   //   };
//   //  upload new doc to firestore users/user_id/bots
//   // Add a new document in collection "cities"
//   try {
//     const docRef = await addDoc(
//       collection(db, `users/${user_id}/bots`),
//       botInfo
//     );
//     return { success: true, bot_id: docRef.id };
//   } catch (error) {
//     console.log(error);
//     return { success: false, bot_id: "", error: `Error adding bot ${error}` };
//   }
// };

// export const getMyBotsInfo = async (user_id) => {
//   const botsInfo = [];
//   const querySnapshot = await getDocs(collection(db, `users/${user_id}/bots`));
//   querySnapshot.forEach((doc) => {
//     botsInfo.push({ ...doc.data(), id: doc.id });
//     console.log(doc.id, " => ", doc.data());
//   });
//   return botsInfo;
// };

// export const getBotInfo = async (user_id, bot_id) => {
//   const docRef = doc(db, `users/${user_id}/bots`, bot_id);
//   const docSnap = await getDoc(docRef);
//   if (docSnap.exists()) {
//     return { ...docSnap.data(), id: docSnap.id };
//   }
//   return null;
// };
