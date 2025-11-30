import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser, useAuth } from '@clerk/clerk-expo'; // ✅ Import `useAuth` from `@clerk/clerk-expo`
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth(); // ✅ Get the signOut function
  const router = useRouter();

  const Menu = [
    { id: 1, name: 'Add New Book', icon: 'add-circle', path: '/add-new-book' },
    { id: 2, name: 'My Posts', icon: 'bookmark', path: '/../user-post' },
    { id: 3, name: 'Favorites', icon: 'heart', path: '/(tabs)/favorite' },
    { id: 4, name: 'Inbox', icon: 'chatbubble', path: '/(tabs)/inbox' },
    { id: 5, name: 'Logout', icon: 'exit', path: 'logout' },
  ];

  const onPressMenu = async (menu) => {
    if (menu.path === 'logout') {
      await signOut(); // ✅ Properly call `signOut`
      router.replace('/login'); // ✅ Redirect user to the login screen after logout
      return;
    }
    router.push(menu.path);
  };

  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      <Text style={{ fontFamily: 'solway-medium', fontSize: 30 }}>Profile</Text>

      <View style={{ display: 'flex', alignItems: 'center', marginVertical: 25 }}>
        <Image 
          source={{ uri: user?.imageUrl }} 
          style={{ width: 60, height: 60, borderRadius: 99 }} 
        />
        <Text style={{ fontFamily: 'solway-bold', fontSize: 20, marginTop: 6 }}>
          {user?.fullName}
        </Text>
        <Text style={{ fontFamily: 'solway', fontSize: 16, color: Colors.GRAY }}>
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>

      <FlatList
        data={Menu}
        keyExtractor={(item) => item.id.toString()} // ✅ Ensure unique keys
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => onPressMenu(item)} 
            style={{
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: Colors.PRIMARY,
              padding: 5,
              borderRadius: 10
            }}
          >
            <Ionicons 
              name={item?.icon} 
              size={28} 
              color={Colors.VIOLET} 
              style={{
                padding: 10,
                backgroundColor: Colors.PRIMARY,
                borderRadius: 10
              }} 
            />
            <Text style={{ fontFamily: 'solway-medium', fontSize: 18, color: Colors.VIOLET }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}



// import { View, Text, Image, TouchableOpacity} from 'react-native'
// import React from 'react'
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { useUser } from '@clerk/clerk-expo';
// import Colors from '../../constants/Colors';
// import { FlatList } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useAuth } from '@clerk/clerk-react';


// export default function Profile(){

//   const Menu=[
//     {
//       id:1,
//       name:'Add New Book',
//       icon:'add-circle',
//       path:'/add-new-book'
//     },
//     {
//       id:1,
//       name:'My Posts',
//       icon:'bookmark',
//       path:'/../user-post'

//     },
//     {
//       id:2,
//       name:'Favorites',
//       icon:'heart',
//       path:'/(tabs)/favorite'
//     },
//     {
//       id:3,
//       name:'Inbox',
//       icon:'chatbubble',
//       path:'/(tabs)/inbox'
//     },
//     {
  
//         id:4,
//         name:'Logout',
//         icon:'exit',
//         path:'logout'
      
//     }
//   ]
//   const {user}=useUser();
//   const router=useRouter();
//   const {signOut}=useAuth();
//   const onPressMenu=(menu)=>{
//     if (menu=='logout'){
//       signOut();
//       return;
//     }
// router.push(menu.path)

//   }
//   return (
//     <View style={{
//       padding:20,
//       marginTop:20,
//     }}>
//       <Text style={{
//         fontFamily:'solway-medium',
//         fontSize:30
//       }}>Profile</Text>

//       <View style={{
//         display:'flex',
//         alignItem:'center',
//         marginVertical:25

//       }}>
//         <Image source={{uri:user?.imageUrl}} style={{
//           width:60,
//           height:60,
//           borderRadius:99,}}  />

//           <Text style={{
//             fontFamily:"solway-bold",
//             fontSize:20,
//             marginTop:6,
//           }}>{user?.fullName}</Text>
//           <Text style={{
//             fontFamily:'solway',
//             fontSize:16,
//             color:Colors.GRAY
//           }}>{user?.primaryEmailAddress?.emailAddress}</Text>
//       </View>
//       <FlatList
//       data={Menu}
//       renderItem={({item,index})=>(
//         <TouchableOpacity onPress={()=>onPressMenu(item)}
//         key={index.id}
//         style={{
//           marginVertical:10,
//           display:'flex',
//           flexDirection:'row',
//           alignItems:'center',
//           gap:10,
//           backgroundColor:Colors.PRIMARY,
//           padding:5,
//           borderRadius:10
//         }}>
//           <Ionicons name={item?.icon}size={28} color={Colors.VIOLET} 
//           style={{
//             padding:10,
//             backgroundColor:Colors.PRIMARY,
//             borderRadius:10,
//             }}/>
//             <Text style={{
//               fontFamily:'solway-medium',
//               fontSize:18,
//               color:Colors.VIOLET
//             }}>{item.name}</Text>
//           </TouchableOpacity>
//       )}
//       />
//     </View>
//   )
// }
