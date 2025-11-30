import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  FlatList,
} from 'react-native';
import { Link } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import { Platform, StatusBar as RNStatusBar } from 'react-native';

import Header from '../../components/Home/Header';
import Slider from '../../components/Home/Slider';
import BookListByCategory from '../../components/Home/BookListByCategory';
import QuoteMessage from '../../components/Home/QuoteMessage';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

export default function Home() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const sidebarTranslate = useState(new Animated.Value(-width * 0.6))[0];

  const toggleSidebar = () => {
    const toValue = isSidebarVisible ? -width * 0.6 : 0;
    Animated.timing(sidebarTranslate, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSidebarVisible(!isSidebarVisible);
    });
  };

  const closeSidebar = () => {
    Animated.timing(sidebarTranslate, {
      toValue: -width * 0.6,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSidebarVisible(false);
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        hidden={false}
        translucent={true}
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          { transform: [{ translateX: sidebarTranslate }] },
        ]}
      >
        <Text style={styles.sidebarTitle}>Menu</Text>
        <Link href={'/add-new-book'} style={styles.sidebarButton}>
          <Entypo name="book" size={20} color="gray" />
          <Text style={styles.sidebarButtonText}>Add New Book</Text>
        </Link>

        <Link href={'/match-books'} style={styles.sidebarButton}>
          <Entypo name="heart" size={20} color="gray" />
          <Text style={styles.sidebarButtonText}>Match</Text>
        </Link>
      </Animated.View>

      {/* Overlay */}
      {isSidebarVisible && <Pressable onPress={closeSidebar} style={styles.overlay} />}

      {/* Scrollable Content */}
      <FlatList
        data={[{}]}
        renderItem={() => (
          <View style={styles.scrollContent}>
            <Header onToggleSidebar={toggleSidebar} />
            <Slider />
            <BookListByCategory />
            <QuoteMessage />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 20,
    marginTop: 20,
    gap: 20,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.6,
    backgroundColor: '#fff',
    zIndex: 2,
    paddingTop:
      Platform.OS === 'android' ? RNStatusBar.currentHeight + 20 : 60,
    paddingHorizontal: 16,
    elevation: 5,
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  sidebarTitle: {
    fontSize: 20,
    fontFamily: 'solway-medium',
    marginBottom: 20,
    color: 'gray',
  },
  sidebarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginBottom: 15,
  },
  sidebarButtonText: {
    fontFamily: 'solway-medium',
    fontSize: 16,
    color: 'gray',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#000',
    opacity: 0.1,
    zIndex: 1,
  },
});



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StatusBar,
//   StyleSheet,
//   TouchableOpacity,
//   Animated,
//   Dimensions,
//   Pressable,
//   FlatList,
//   Platform,
//   StatusBar as RNStatusBar,
// } from 'react-native';
// import { Link } from 'expo-router';
// import Entypo from '@expo/vector-icons/Entypo';

// import Header from '../../components/Home/Header';
// import Slider from '../../components/Home/Slider';
// import BookListByCategory from '../../components/Home/BookListByCategory';
// import Colors from '../../constants/Colors';

// const { width } = Dimensions.get('window');

// export default function Home() {
//   const [isSidebarVisible, setSidebarVisible] = useState(false);
//   const sidebarTranslate = useState(new Animated.Value(-width * 0.6))[0];

//   const toggleSidebar = () => {
//     const toValue = isSidebarVisible ? -width * 0.6 : 0;
//     Animated.timing(sidebarTranslate, {
//       toValue,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setSidebarVisible(!isSidebarVisible);
//     });
//   };

//   const closeSidebar = () => {
//     Animated.timing(sidebarTranslate, {
//       toValue: -width * 0.6,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setSidebarVisible(false);
//     });
//   };

//   // Dummy data for FlatList to satisfy the render
//   const dummyData = [{ key: 'dummy' }];

//   return (
//     <View style={{ flex: 1 }}>
//       <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="dark-content" />

//       {/* Sidebar */}
//       <Animated.View
//         style={[
//           styles.sidebar,
//           { transform: [{ translateX: sidebarTranslate }] }
//         ]}
//       >
//         <Text style={styles.sidebarTitle}>Menu</Text>

//         <Link href={'/add-new-book'} style={styles.sidebarButton}>
//           <Entypo name="book" size={20} color="gray" />
//           <Text style={styles.sidebarButtonText}>Add New Book</Text>
//         </Link>

//         <Link href={'/match-books'} style={styles.sidebarButton}>
//           <Entypo name="heart" size={20} color="gray" />
//           <Text style={styles.sidebarButtonText}>Match</Text>
//         </Link>
//       </Animated.View>

//       {/* Overlay */}
//       {isSidebarVisible && (
//         <Pressable onPress={closeSidebar} style={styles.overlay} />
//       )}

//       {/* Replace ScrollView with FlatList */}
//       <FlatList
//         data={dummyData}
//         keyExtractor={(item) => item.key}
//         renderItem={null}
//         ListHeaderComponent={
//           <View style={styles.scrollContent}>
//             <Header onToggleSidebar={toggleSidebar} />
//             <Slider />
//             <BookListByCategory />
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContent: {
//     padding: 20,
//     paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 20,
//     marginTop: 20,
//   },
//   sidebar: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     width: width * 0.6,
//     backgroundColor: '#fff',
//     zIndex: 2,
//     paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight + 20 : 60,
//     paddingHorizontal: 16,
//     elevation: 5,
//     borderRightWidth: 1,
//     borderColor: '#ddd',
//   },
//   sidebarTitle: {
//     fontSize: 20,
//     fontFamily: 'solway-medium',
//     marginBottom: 20,
//     color: 'gray',
//   },
//   sidebarButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 5,
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   sidebarButtonText: {
//     fontFamily: 'solway-medium',
//     fontSize: 16,
//     color: 'gray',
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     height: '100%',
//     width: '100%',
//     backgroundColor: '#000',
//     opacity: 0.1,
//     zIndex: 1,
//   },
// });




// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StatusBar,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Animated,
//   Dimensions,
//   Pressable
// } from 'react-native';
// import { Link } from 'expo-router';
// import Entypo from '@expo/vector-icons/Entypo';
// import { Platform, StatusBar as RNStatusBar } from 'react-native';

// import Header from '../../components/Home/Header';
// import Slider from '../../components/Home/Slider';
// import BookListByCategory from '../../components/Home/BookListByCategory';
// import Colors from '../../constants/Colors';

// const { width } = Dimensions.get('window');

// export default function Home() {
//   const [isSidebarVisible, setSidebarVisible] = useState(false);
//   const sidebarTranslate = useState(new Animated.Value(-width * 0.6))[0];

//   const toggleSidebar = () => {
//     const toValue = isSidebarVisible ? -width * 0.6 : 0;
//     Animated.timing(sidebarTranslate, {
//       toValue,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setSidebarVisible(!isSidebarVisible);
//     });
//   };

//   const closeSidebar = () => {
//     Animated.timing(sidebarTranslate, {
//       toValue: -width * 0.6,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setSidebarVisible(false);
//     });
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="dark-content" />

//       {/* Sidebar */}
//       <Animated.View
//         style={[
//           styles.sidebar,
//           { transform: [{ translateX: sidebarTranslate }] }
//         ]}
//       >
//         <Text style={styles.sidebarTitle}>Menu</Text>

//         <Link href={'/add-new-book'} style={styles.sidebarButton}>
//           <Entypo name="book" size={20} color="gray" />
//           <Text style={styles.sidebarButtonText}>Add New Book</Text>
//         </Link>

//         <Link href={'/match-books'} style={styles.sidebarButton}>
//           <Entypo name="heart" size={20} color="gray" />
//           <Text style={styles.sidebarButtonText}>Match</Text>
//         </Link>
//       </Animated.View>

//       {/* Overlay */}
//       {isSidebarVisible && (
//         <Pressable onPress={closeSidebar} style={styles.overlay} />
//       )}

//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <Header onToggleSidebar={toggleSidebar} />
//         <Slider />
//         <BookListByCategory />
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContent: {
//     padding: 20,
//     paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 20,
//     marginTop: 20,
//   },
//   sidebar: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     width: width * 0.6,
//     backgroundColor: '#fff',
//     zIndex: 2,
//     paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight + 20 : 60,
//     paddingHorizontal: 16,
//     elevation: 5,
//     borderRightWidth: 1,
//     borderColor: '#ddd',
//   },
//   sidebarTitle: {
//     fontSize: 20,
//     fontFamily: 'solway-medium',
//     marginBottom: 20,
//     color: 'gray',
//   },
//   sidebarButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 5,
//     borderRadius: 8,
//     marginBottom: 15,
//   },
//   sidebarButtonText: {
//     fontFamily: 'solway-medium',
//     fontSize: 16,
//     color: 'gray',
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     height: '100%',
//     width: '100%',
//     backgroundColor: '#000',
//     opacity: 0.1,
//     zIndex: 1,
//   },
// });




// import { View, Text, StatusBar, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// import React from 'react';
// import Header from '../../components/Home/Header';
// import Slider from '../../components/Home/Slider';
// import BookListByCategory from '../../components/Home/BookListByCategory';
// import Entypo from '@expo/vector-icons/Entypo';
// import Colors from '../../constants/Colors'; // ✅ Ensure Colors is imported
// import { Platform, StatusBar as RNStatusBar } from 'react-native';
// import { Link } from 'expo-router';

// export default function Home() {
//   return (
//     <View style={{ flex: 1 }}>
//       <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="dark-content" />
      
//       {/* Scrollable Content */}
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Header */}
//         <Header />
        
//         {/* Slider */}
//         <Slider />

//         {/* Book List + Category */}
//         <BookListByCategory />

//         {/* Add New Book */}
//         <Link href={'/add-new-book'} style={styles.addNewBookContainer}>
//           <Entypo name="book" size={24} color='#fffdf5' />
//           <Text style={{
//             fontFamily:'solway-medium',
//             color:Colors.PRIMARY,
//           }}>Add New Book</Text>
//         </Link>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   scrollContent: {
//     padding: 20,
//     paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 20, // ✅ Avoids StatusBar overlap
//     marginTop: 20,
//   },
//   addNewBookContainer: {
//     flexDirection: 'row', // ✅ No need for `display: 'flex'`, it's default in React Native
//     gap: 10,
//     alignItems: 'center',
//     marginTop: 20,
//     padding: 20,
//     backgroundColor: Colors.PATONEU, // ✅ Ensure this value exists in Colors
//     borderWidth: 3,
//     borderColor: Colors.PRIMARY,
//     borderRadius: 15,
//     textAlign: 'center',
//     borderStyle: "",
//     justifyContent: 'center'
//   }
// });



// import { View, Text,StatusBar } from 'react-native'
// import React from 'react'
// import Header from '../../components/Home/Header';
// import Slider from '../../components/Home/Slider'
// import BookListByCategory from '../../components/Home/BookListByCategory';
// import Entypo from '@expo/vector-icons/Entypo';
// import Colors from '../../constants/Colors';


// export default function Home(){
  
//   return (
//     <View style={{
//       padding:20, marginTop:20
//     }}>
//       <StatusBar hidden={false} translucent={true} backgroundColor="transparent" barStyle="dark-content" />
      
//       {/*Header*/}
//       <Header/>
//       {/*Slider*/}
//       <Slider/>

//       {/*PetList + Category*/}
//       <BookListByCategory/>

//       {/*List Of Pets*/}

//       {/*Add New Book*/}
//       <View style={{
//         display:'flex',
//         flexDirection:'row',
//         gap:10,
//         alignItems:'center',
//         marginTop:20,
//         padding:20,
//         backgroundColor:Colors.VIOLET
//       }}>
//       <Entypo name="book" size={24} color="black" />
//         <Text>Add New Book</Text>
//       </View>

//     </View>
//   )
// }
