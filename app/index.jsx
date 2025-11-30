

import { Redirect } from "expo-router";
import { useUser } from '@clerk/clerk-expo';
import { View, StatusBar } from "react-native";

export default function Index() {
  const { isSignedIn } = useUser(); // Check authentication status

  if (isSignedIn === undefined) return <View />; // Avoid flickering

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden={false} translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {isSignedIn ? <Redirect href={'/(tabs)/home'} /> : <Redirect href={'/login'} />}
    </View>
  );
}


// import { Link , Redirect} from "expo-router";
// import { useUser } from '@clerk/clerk-expo';
// import { View, StatusBar , Pressable, Text} from "react-native";

// export default function Index() {
//   const { user } = useUser();

 
//   return (
//     <View style={{ flex: 1 }}>
//       {/* {user ? <Redirect href={'/(tabs)/home'} /> : <Redirect href={'/login/index'} />} */}
//       {user ? <Redirect href={'/(tabs)/home'} /> : <Redirect href={'/login'} />}


//       <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="dark-content" />
      
//     </View>
//   );
// }






// import { useUser } from '@clerk/clerk-expo';
// import { Redirect, useRootNavigationState } from "expo-router";
// import { useEffect } from 'react';
// import { View, StatusBar } from "react-native";

// export default function Index() {
//   const { user } = useUser();
//   const rootNavigationState = useRootNavigationState();

//   useEffect(() => {
//     if (!rootNavigationState.key) return;
//   }, [rootNavigationState.key]);

//   if (!rootNavigationState.key) return null; // Ensures navigation is loaded

//   return (
//     <View style={{ flex: 1 }}>
//       <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="dark-content" />
//       {user ? <Redirect href={'/(tabs)/home'} /> : <Redirect href={'/login/index'} />}
//     </View>
//   );
// }
