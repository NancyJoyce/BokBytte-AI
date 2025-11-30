
import { ClerkProvider } from '@clerk/clerk-expo';
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SecureStore from 'expo-secure-store';

const tokenCache = {
  async getToken(key) {
    try {
      const item = await SecureStore.getItemAsync(key);
      return item || null;
    } catch (error) {
      console.error('Secure store error:', error);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Secure store save error:', error);
    }
  },
};

export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  useFonts({
    'solway': require('./../assets/fonts/Solway-Regular.ttf'),
    'solway-medium': require('./../assets/fonts/Solway-Medium.ttf'),
    'solway-bold': require('./../assets/fonts/Solway-Bold.ttf'),
  });

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login/index" options={{ headerShown: false }} />
      </Stack>
    </ClerkProvider>
  );
}


// import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import * as SecureStore from 'expo-secure-store';


// const tokenCache = {
//     async getToken(key) {
//       try {
//         const item = await SecureStore.getItemAsync(key)
//         if (item) {
//           console.log(`${key} was used 🔐 \n`)
//         } else {
//           console.log('No values stored under key: ' + key)
//         }
//         return item
//       } catch (error) {
//         console.error('secure store get item error: ', error)
//         await SecureStore.deleteItemAsync(key)
//         return null
//       }
//     },
//     async saveToken(key, value )  {
//       try{
//       return SecureStore.setItemAsync(key, value)
//     }catch(err){
//       return
//     }
//   },
// }

// export default function RootLayout() {

//   const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

//   useFonts({
//     'solway':require('./../assets/fonts/Solway-Regular.ttf'),
//     'solway-medium':require('./../assets/fonts/Solway-Medium.ttf'),
//     'solway-bold':require('./../assets/fonts/Solway-Bold.ttf'),
//   })
//   return (
//     <ClerkProvider 
//     tokenCache={tokenCache}
//     publishableKey={publishableKey}>
//   <Stack>
//     <Stack.Screen name="index" />
//     <Stack.Screen name="(tabs)"  options={{headerShown:false}}/>
//     <Stack.Screen name="login/index" 
//     options={{
//       headerShown:false
//     }}
//       />
//   </Stack>
//   </ClerkProvider>
//   );
// }

