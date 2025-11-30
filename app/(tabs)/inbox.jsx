// app/inbox.jsx
import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import UserItem from '../../components/Inbox/UserItem';
import Colors from '../../constants/Colors';

export default function Inbox() {
  const { user } = useUser();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userEmail = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase();
    if (!userEmail) return;
    setLoading(true);
    const q = query(collection(db, 'Chat'), where('userIds', 'array-contains', userEmail));
    const unsubscribe = onSnapshot(q, snapshot => {
      const chatList = snapshot.docs.map(docSnap => ({
        ...docSnap.data(),
        docid: docSnap.id
      }));
      setChats(chatList);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const userEmail = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase();
  const mappedChats = chats
    .map(chat => {
      const otherUser = chat.users.find(u => u.email !== userEmail);
      return otherUser ? { ...chat, otherUser } : null;
    })
    .filter(chat => chat !== null);

  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      <Text style={{ fontFamily: 'solway-medium', fontSize: 25, color: Colors.VIOLET }}>Inbox</Text>
      <FlatList
        data={mappedChats}
        keyExtractor={item => item.docid}
        refreshing={loading}
        onRefresh={() => {}}
        renderItem={({ item }) => (
          <UserItem
            userInfo={item.otherUser}
            latestMessage={item.latestMessage}
            chatId={item.docid}
          />
        )}
      />
    </View>
  );
}


// import { View, Text, FlatList } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
// import { db } from '../../config/FirebaseConfig';
// import { useUser } from '@clerk/clerk-expo';
// import UserItem from '../../components/Inbox/UserItem';
// import Colors from '../../constants/Colors';

// export default function Inbox() {
//     const { user } = useUser();
//     const [userList, setUserList] = useState([]);
//     const [loader, setLoader] = useState(false);

//     useEffect(() => {
//         if (user?.primaryEmailAddress?.emailAddress) {
//             GetUserList();
//         }
//     }, [user]);

//     /** 🔹 Fetch Chats & Listen for New Messages **/
//     const GetUserList = async () => {
//         setLoader(true);
//         const userEmail = user?.primaryEmailAddress?.emailAddress;
//         if (!userEmail) {
//             console.error("User email not available:", user);
//             return;
//         }

//         const q = query(collection(db, 'Chat'), where('userIds', 'array-contains', userEmail));

//         // Use onSnapshot to listen for real-time updates
//         const unsubscribe = onSnapshot(q, (querySnapshot) => {
//             const chatUsers = [];

//             querySnapshot.forEach((doc) => {
//                 const chatData = doc.data();

//                 // Fetch latest message in real-time
//                 const messagesRef = collection(db, 'Chat', doc.id, 'Messages');
//                 const latestMessageQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));

//                 onSnapshot(latestMessageQuery, (messageSnapshot) => {
//                     const latestMessage = messageSnapshot.docs.length > 0
//                         ? messageSnapshot.docs[0].data()
//                         : { text: 'No messages yet.', timestamp: null };

//                     chatUsers.push({
//                         docid: doc.id,
//                         latestMessage: latestMessage.text, // Store latest message
//                         latestTimestamp: latestMessage.timestamp,
//                         users: chatData.users,
//                     });

//                     // Update state after collecting all messages
//                     setUserList([...chatUsers]);
//                 });
//             });
//         });

//         setLoader(false);
//         return unsubscribe;
//     };

//     /** 🔹 Map Other Users with Latest Message **/
//     const MapOtherUserList = () => {
//         return userList
//             .map((record) => {
//                 if (!record.users) return null;

//                 const otherUser = record.users.find(u => u.email !== user?.primaryEmailAddress?.emailAddress);
//                 return otherUser
//                     ? { docid: record.docid, latestMessage: record.latestMessage, ...otherUser }
//                     : null;
//             })
//             .filter(item => item !== null);
//     };

//     return (
//         <View style={{ padding: 20, marginTop: 20 }}>
//             <Text style={{ fontFamily: 'solway-medium', fontSize: 25, color: Colors.VIOLET }}>Inbox</Text>
//             <FlatList
//                 data={MapOtherUserList()} // Ensure correct mapping
//                 refreshing={loader}
//                 onRefresh={() => GetUserList()}
//                 style={{ marginTop: 20 }}
//                 keyExtractor={(item) => item.docid}
//                 renderItem={({ item }) => <UserItem userInfo={item} />}
//             />
//         </View>
//     );
// }

// import { View, Text, FlatList } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../../config/FirebaseConfig';
// import { useUser } from '@clerk/clerk-expo';
// import UserItem from '../../components/Inbox/UserItem';
// import { Color } from '@cloudinary/url-gen/qualifiers';
// import Colors from '../../constants/Colors';

// export default function Inbox() {
//     const { user } = useUser();
//     const [userList, setUserList] = useState([]);
//     const [loader, setLoader]=useState(false);

//     useEffect(() => {
//         if (user?.primaryEmailAddress?.emailAddress) {
//             GetUserList();
//         }
//     }, [user]);

//     /** 🔹 Fetch User List (Only if user is authenticated) **/
//     const GetUserList = async () => {
//       setLoader(true)
//         const userEmail = user?.primaryEmailAddress?.emailAddress;
//         if (!userEmail) {
//             console.error("User email not available:", user);
//             return;
//         }

//         try {
//             const q = query(collection(db, 'Chat'), where('userIds', 'array-contains', userEmail));
//             const querySnapshot = await getDocs(q);

//             const chatUsers = querySnapshot.docs.map(doc => doc.data());
//             setUserList(chatUsers);
//         } catch (error) {
//             console.error("Error fetching chat users:", error);
//         }
//         setLoader(false)
//     };

//     /** 🔹 Map Other Users (Exclude Current User) **/
//     const MapOtherUserList = () => {
//         return userList.map((record) => {
//             const otherUser = record.users?.find(u => u.email !== user?.primaryEmailAddress?.emailAddress);
//             return otherUser ? { docid: record.id, ...otherUser } : null;
//         }).filter(item => item !== null);
//     };

//     return (
//         <View style={{ padding: 20, marginTop: 20 }}>
//             <Text style={{ fontFamily: 'solway-medium', fontSize: 25, color: Colors.VIOLET}}>Inbox</Text>
//             <FlatList
//                 data={MapOtherUserList()}
                
//                 refreshing={loader}
//                 onRefresh={()=>GetUserList()}
                
//                 style={{
//                   marginTop:20,
                  

//                 }}
//                 keyExtractor={(item) => item.docid}
//                 renderItem={({ item }) => (
//                 <UserItem userInfo={item} />
//                 )}
//             />
//         </View>
//     );
// }



// import { View, Text } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { collection, getDocs, query, where } from 'firebase/firestore'
// import { db } from '../../config/FirebaseConfig'
// import { useUser } from '@clerk/clerk-expo'
// import { FlatList } from 'react-native'
// import UserItem from '../../components/Inbox/UserItem'

// export default function Inbox(){

//   const {user}=useUser();
//   const [userList, setUserList]=useState([]);

//   useEffect(()=>{
//     user && GetUserList();
//   },[user])

//   //Get user List depends on the current user
//   const GetUserList= async()=>{
//     const q=query(collection(db,'Chat'),where('userIds','array-contains',user?.primaryEmailAddress.emailAddress));

//     const querySnapshot=await getDocs(q);

//     querySnapshot.forEach(doc=>{

//       setUserList(prevList=>[...prevList, doc.data()])
//     })
//   }
// //Filter
//   const MapOtherUserList=()=>{
//     const list=[];
//     userList.forEach((record)=>{
//       const otherUser=record.users?.filter(user=>user?.email!=user?.primaryEmailAddress.emailAddress);
//       const result={
//         docid:record.id,
//         ...otherUser[0]
//       }
//       list.push(result)
//     })
//     return list;
//   }

//   return (
//     <View style={{
//       padding:20,
//       marginTop:20
//     }}>
//       <Text style={{
//         fontFamily:'solway-medium',
//         fontSize:25
//       }}>Inbox</Text>
//       <FlatList
//       data={MapOtherUserList()}
//       renderItem={({item, index})=>(
//         <UserItem userInfo={item} key={index}/>

//       )}
//       />
//     </View>
//   )
// }
