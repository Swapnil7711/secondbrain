// import { User as FirebaseUser } from "firebase/auth";
// import { signInWithPopup, signInWithEmailAndPassword } from "@firebase/auth";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   sendPasswordResetEmail,
// } from "firebase/auth";
// import { getUsernameFromEmail, randomString, showSnackbar } from "../utils";
// import { UserInfo } from "../interfaces";
// import { provider } from "./firebaseClient";

// const auth = getAuth();
// var user: FirebaseUser;

// export const SignInWithEmailAndPass = async (
//   email: string,
//   password: string
// ): Promise<{ user: any; status: string; message?: string }> => {
//   var result = { user: null, status: "error" } as {
//     user: any;
//     status: string;
//     message?: string;
//   };
//   await signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user;
//       console.log(`user: ${JSON.stringify(user)}`);
//       result = {
//         user: user,
//         status: "success",
//       };
//       // ...
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;

//       result = {
//         user: user,
//         status: errorCode,
//         message: `${error.message}`,
//       };
//     });

//   return result;
// };

// export async function SignUpWithEmailAndPass(
//   email: string,
//   password: string
// ): Promise<{ user: any; status: string; message?: string }> {
//   var result = { user: null, status: "error" } as {
//     user: any;
//     status: string;
//     message?: string;
//   };
//   const auth = getAuth();
//   await createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       // Signed in
//       const user = userCredential.user;
//       console.log(userCredential.user);
//       var userInfo: UserInfo;
//       userInfo = {
//         email: email,
//         user_id: user.uid,
//         plan: "free",
//         profile_pic: "",
//         username: getUsernameFromEmail(email),
//       };
//       uploadUserInfo(userInfo);
//       result = {
//         user: user,
//         status: "success",
//       };
//       // ...
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.log(`Eroor ${errorCode}, ${errorMessage}`);
//       if (errorCode === "auth/email-already-in-use") {
//         showSnackbar("Email already in use, Login instead");
//       } else {
//         showSnackbar("Opps! Not able to create account, Try Again!");
//       }
//       result = {
//         user: user,
//         status: errorCode,
//         message: `${error.message}`,
//       };
//     });
//   return result;
// }

// export const SignInWithGoogle = async () => {
//   let user;
//   await signInWithPopup(auth, provider)
//     .then((res) => {
//       console.log(res.user);
//       user = res.user;
//       var userInfo: UserInfo;
//       userInfo = {
//         username:
//           user.displayName ||
//           getUsernameFromEmail(user.email || randomString(10)),
//         email: user.email || "",
//         user_id: user.uid,
//         plan: "free",
//         profile_pic: user.photoURL || "",
//       };
//       //userId, name, email, avatarUrl
//       uploadUserInfo(userInfo);
//     })
//     .catch((error) => {
//       console.log(error.message);
//     });

//   return user;
// };

// export const SignUpWithGoogle = async () => {
//   let user;
//   await signInWithPopup(auth, provider)
//     .then((res) => {
//       console.log(res.user);
//       user = res.user;

//       var userInfo: UserInfo;
//       userInfo = {
//         username:
//           user.displayName ||
//           getUsernameFromEmail(user.email || randomString(10)),
//         email: user.email || "",
//         user_id: user.uid,
//         plan: "free",
//         profile_pic: user.photoURL || "",
//       };
//       uploadUserInfo(userInfo);
//     })
//     .catch((error) => {
//       console.log(error.message);
//     });

//   return user;
// };

// export const logOut = async () => {
//   let logout_sucess;
//   await auth
//     .signOut()
//     .then(() => {
//       logout_sucess = true;
//       localStorage.removeItem("user");
//     })
//     .catch((error) => {
//       console.log(error.message);
//     });

//   return logout_sucess;
// };

// export const ResetPassEmail = async (email: string) => {
//   const auth = getAuth();
//   sendPasswordResetEmail(auth, email)
//     .then(() => {
//       // Password reset email sent!
//       // ..
//     })
//     .catch((error) => {
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // ..
//     });
// };
