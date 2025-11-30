import { View, Image, StatusBar, Text, Pressable } from 'react-native';
import React, { useCallback } from 'react';
import Colors from './../../constants/Colors';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';

WebBrowser.maybeCompleteAuthSession(); // Handle pending sessions

export default function LoginScreen() {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)/home', { scheme: 'myapp' }),
      });

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error('OAuth error:', err);
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#6C5B7B", justifyContent: "center" }}>
      <StatusBar hidden={false} translucent backgroundColor="transparent" barStyle="dark-content" />

      <Image source={require('./../../assets/images/login.png')} style={{ width: "100%", height: 300, resizeMode: "contain" }} />

      <View style={{ padding: 20, alignItems: 'center', marginTop: 20 }}>
        <Text style={{ fontFamily: 'solway-bold', fontSize: 30, color: "#fffdf5", textAlign: "center" }}>
          Ready to Get Closer to Your Next Great Read?
        </Text>

        <Pressable onPress={onPress} style={{
          padding: 14, marginTop: 100, backgroundColor: Colors.PRIMARY, width: '100%', borderRadius: 14
        }}>
          <Text style={{ fontFamily: 'solway-medium', fontSize: 20, textAlign: 'center' }}>Get Started</Text>
        </Pressable>
      </View>
    </View>
  );
}




// import { Image, View, StatusBar, Text, Pressable } from 'react-native';
// import React, {useCallback} from 'react';
// import Colors from './../../constants/Colors';
// import * as WebBrowser from 'expo-web-browser';
// import {useOAuth} from '@clerk/clerk-expo';
// import * as Linking from 'expo-linking';

// export const useWarmUpBrowser = () => {
//     React.useEffect(() => {
//       // Preloads the browser for Android devices to reduce authentication load time
//       // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
//       void WebBrowser.warmUpAsync()
//       return () => {
//         // Cleanup: closes browser when component unmounts
//         void WebBrowser.coolDownAsync()
//       }
//     }, [])
//   }
  
//   // Handle any pending authentication sessions
//   WebBrowser.maybeCompleteAuthSession()

// export default function LoginScreen() {
//     useWarmUpBrowser();
//     const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

//     const onPress = useCallback(async () => {
//         try {
//           // Start the authentication process by calling startSSOFlow()
//           const { createdSessionId, setActive, signIn, signUp } = await startOAuthFlow({
//             redirectUrl: Linking.createURL('/(tabs)/home', { scheme:'myapp' }),
//           })
    
//           // If sign in was successful, set the active session
//           if (createdSessionId) {
//           } else {
//             // If there is no createdSessionId,
//             // there are missing requirements, such as MFA
//             // Use the signIn or signUp returned from startSSOFlow
//             // to handle next steps
//           }
//         } catch (err) {
//           // See https://clerk.com/docs/custom-flows/error-handling
//           // for more info on error handling
//           console.error('OAuth error',err)
//         }
//       }, [])
    
//     return (
//         <View style={{ flex: 1, backgroundColor: "#6C5B7B", justifyContent: "center" }}>
//             <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="dark-content" />

//             <Image 
//                 source={require('./../../assets/images/login.png')} 
//                 style={{ width: "100%", height: 300, resizeMode: "contain", marginTop: 1 }} 
//             /> 
//             <View style={{
//                 padding: 20,
//                 alignItems: 'center',
//                 marginTop: 20, // Moves text slightly lower
//             }}>
//                 <Text style={{
//                     fontFamily: 'solway-bold',
//                     fontSize: 30,
//                     color: "#fffdf5", 
//                     textAlign: "center"
//                 }}>Ready To get Closer To Your Next Great Read?</Text>

//                <Pressable 
//                onPress={onPress}
//                style={{
//                 padding:14,
//                 marginTop:100,
//                 backgroundColor:Colors.PRIMARY,
//                 width:'100%',
//                 borderRadius:14

//                }}>

//                 <Text style={{ 
//                     fontFamily:'solway-medium',
//                     fontSize:20,
//                     textAlign:'center'

//                 }}>Get Started</Text>
//                 </Pressable> 

//             </View>
//         </View>
//     );
// }
// // import { Image, View, StatusBar, Text, Pressable } from 'react-native';
// // import React, {useCallback} from 'react';
// // import Colors from './../../constants/Colors';
// // import * as WebBrowser from 'expo-web-browser';
// // import {useOAuth} from '@clerk/clerk-expo';
// // import * as Linking from 'expo-linking';

// // export const useWarmUpBrowser = () => {
// //     React.useEffect(() => {
// //       // Preloads the browser for Android devices to reduce authentication load time
// //       // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
// //       void WebBrowser.warmUpAsync()
// //       return () => {
// //         // Cleanup: closes browser when component unmounts
// //         void WebBrowser.coolDownAsync()
// //       }
// //     }, [])
// //   }
  
// //   // Handle any pending authentication sessions
// //   WebBrowser.maybeCompleteAuthSession()

// // export default function LoginScreen() {
// //     useWarmUpBrowser();
// //     const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' })

// //     const onPress = useCallback(async () => {
// //         try {
// //           // Start the authentication process by calling startSSOFlow()
// //           const { createdSessionId, setActive, signIn, signUp } = await startOAuthFlow({
// //             redirectUrl: Linking.createURL('/(tabs)/home', { scheme:'myapp' }),
// //           })
    
// //           // If sign in was successful, set the active session
// //           if (createdSessionId) {
// //           } else {
// //             // If there is no createdSessionId,
// //             // there are missing requirements, such as MFA
// //             // Use the signIn or signUp returned from startSSOFlow
// //             // to handle next steps
// //           }
// //         } catch (err) {
// //           // See https://clerk.com/docs/custom-flows/error-handling
// //           // for more info on error handling
// //           console.error('OAuth error',err)
// //         }
// //       }, [])
    
// //     return (
// //         <View style={{ flex: 1, backgroundColor: "#6C5B7B", justifyContent: "center" }}>
// //             <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="dark-content" />

// //             <Image 
// //                 source={require('./../../assets/images/login.png')} 
// //                 style={{ width: "100%", height: 300, resizeMode: "contain", marginTop: 1 }} 
// //             /> 
// //             <View style={{
// //                 padding: 20,
// //                 alignItems: 'center',
// //                 marginTop: 20, // Moves text slightly lower
// //             }}>
// //                 <Text style={{
// //                     fontFamily: 'solway-bold',
// //                     fontSize: 30,
// //                     color: "#fffdf5", 
// //                     textAlign: "center"
// //                 }}>Ready To get Closer To Your Next Great Read?</Text>

// //                <Pressable 
// //                onPress={onPress}
// //                style={{
// //                 padding:14,
// //                 marginTop:100,
// //                 backgroundColor:Colors.PRIMARY,
// //                 width:'100%',
// //                 borderRadius:14

// //                }}>

// //                 <Text style={{ 
// //                     fontFamily:'solway-medium',
// //                     fontSize:20,
// //                     textAlign:'center'

// //                 }}>Get Started</Text>
// //                 </Pressable> 

// //             </View>
// //         </View>
// //     );
// // }
