
// app/components/Inbox/UserItem.jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function UserItem({ userInfo, latestMessage, chatId }) {
  const router = useRouter();

  const openChat = () => {
    router.push({ pathname: '/chat/[id]', params: { id: chatId } });
  };

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={openChat}>
      {userInfo?.imageUrl && (
        <Image source={{ uri: userInfo.imageUrl }} style={styles.avatar} />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.userName}>{userInfo.name}</Text>
        <Text style={styles.latestMessage} numberOfLines={1}>
          {latestMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 10,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Elevation for Android
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  latestMessage: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
  },
});


// // app/components/Inbox/UserItem.jsx
// import React from 'react';
// import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
// import { useRouter } from 'expo-router';

// export default function UserItem({ userInfo, latestMessage, chatId }) {
//   const router = useRouter();

//   const openChat = () => {
//     router.push({ pathname: '/chat/[id]', params: { id: chatId } });
//   };

//   return (
//     <TouchableOpacity style={styles.itemContainer} onPress={openChat}>
//       <View>
//         <Text style={styles.userName}>{userInfo.name}</Text>
//         <Text style={styles.latestMessage}>{latestMessage}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   itemContainer: { padding: 15, borderBottomWidth: 1, borderColor: '#ccc' },
//   userName: { fontSize: 16, fontWeight: 'bold' },
//   latestMessage: { fontSize: 14, color: '#555' }
// });

// import { View, Text, Image } from 'react-native'
// import React from 'react'
// import Colors from '../../constants/Colors'
// import { Link } from 'expo-router'

// export default function UserItem({userInfo}) {
//   return (
//     <Link href={'/chat?id='+userInfo.docId}>
//     <View style={{
//         marginVertical:7,
//         display:'flex',
//         flexDirection:'row',
//         gap:10,
//         paddingBottom:15,
//         alignItems:'center'
//     }}>
//       <Image source={{uri:userInfo?.imageUrl}}
//       style={{
//         width:40,
//         height:40,
//         borderRadius:99 }}/>
//         <Text style={{
//             fontFamily:'solway-medium',
//             fontSize:18,


//         }}>{userInfo?.name}</Text>
        
//     </View>
//     <View style={{borderWidth:0.2,
//         marginVertical:7,
//         borderColor:Colors.GRAY
//     }}></View>
//     </Link>
//   )
// }

