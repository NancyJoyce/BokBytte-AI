// app/book-details/index.jsx
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import BookInfo from '../../components/BookDetails/BookInfo';
import BookSubInfo from '../../components/BookDetails/BookSubInfo';
import AboutBook from '../../components/BookDetails/AboutBook';
import OwnerInfo from '../../components/BookDetails/OwnerInfo';
import Colors from '../../constants/Colors';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { doc, setDoc } from 'firebase/firestore';

export default function BookDetails() {
  const book = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: ''
    });
  }, []);

  const initiateChat = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase();
    const otherEmail = book?.email?.trim().toLowerCase();

    if (!userEmail || !otherEmail) {
      console.error("Missing email information; cannot create chat.");
      return;
    }
    if (userEmail === otherEmail) {
      console.warn("Cannot chat with yourself!");
      return;
    }

    const emails = [userEmail, otherEmail].sort();
    const docId = emails.join("_");
    console.log("Generated chat document ID:", docId);

    const q = query(collection(db, 'Chat'), where('id', '==', docId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      router.push({ pathname: '/chat/[id]', params: { id: existingDoc.id } });
      return;
    }

    try {
      await setDoc(doc(db, 'Chat', docId), {
        id: docId,
        users: [
          { email: userEmail, imageUrl: user?.imageUrl, name: user?.fullName },
          { email: otherEmail, imageUrl: book?.userImage, name: book?.username }
        ],
        userIds: [userEmail, otherEmail],
        latestMessage: "Chat started",
        latestMessageTimestamp: new Date(),
        createdAt: new Date()
      });
      console.log("Chat document created with ID:", docId);
      router.push({ pathname: '/chat/[id]', params: { id: docId } });
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <BookInfo book={book} />
        <BookSubInfo book={book} />
        <AboutBook book={book} />
        <OwnerInfo book={book} />
        <View style={{ height: 70 }} />
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={initiateChat} style={styles.swapBtn}>
          <Text style={styles.textContent}>Swap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  swapBtn: { padding: 15, backgroundColor: Colors.VIOLET },
  bottomContainer: { position: 'absolute', width: '100%', bottom: 0 },
  textContent: { textAlign: 'center', fontFamily: 'solway-medium', fontSize: 20, color: Colors.PRIMARY }
});



// import { View, Text, ScrollView, TouchableOpacity,StyleSheet } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
// import BookInfo from '../../components/BookDetails/BookInfo';
// import BookSubInfo from '../../components/BookDetails/BookSubInfo';
// import AboutBook from '../../components/BookDetails/AboutBook';
// import OwnerInfo from '../../components/BookDetails/OwnerInfo';
// import Colors from '../../constants/Colors';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../../config/FirebaseConfig';
// import { useUser } from '@clerk/clerk-expo';
// import { doc, setDoc} from 'firebase/firestore';


// export default function BookDetails() {
//     const book = useLocalSearchParams();
//     const navigation = useNavigation();
//     const {user}=useUser();
//     const router=useRouter();
//     useEffect(() => {
//         navigation.setOptions({
//             headerTransparent: true,
//             headerTitle: ''
//         })
//     }, [])

//         const InitiateChat=async()=>{
//              const docId1=user?.primaryEmailAddress+'_'+book?.email;
//              const docId2=book?.email+'_'+user?.primaryEmailAddress?.emailAddress;

//              const q=query(collection(db,'Chat'),where('id','in',[docId1,docId2]))
//              const querySnapshot=await getDocs(q)
//              querySnapshot.forEach(doc=>{
//                 console.log(doc.data());
//                 router.push({
//                     pathname:'/chat',
//                     params:{id:doc.id}
//                 })

//              })
//              if (querySnapshot.docs?.length==0)
//              {
//                 await setDoc(doc(db,'Chat',docId1),{
//                     id:docId1,
//                     users:[
//                         {
//                             email:user?.primaryEmailAddress.emailAddress,
//                             imageUrl:user?.imageUrl,
//                             name:user?.fullName
//                         },
//                         {
//                             email:book?.email,
//                             imageUrl:book?.userImage,
//                             name:book?.username
//                         }
//                     ],
//                     userIds:[ user?.primaryEmailAddress.emailAddress, book?.email ]
//                 });
//                 router.push({
//                     pathname:'/chat',
//                     params:{id:docId1}

//                 })

//              }
//         }

//     return (
//         <View> {/* Ensure View takes full screen height */}
//             <ScrollView > {/* Add padding for spacing */}
//                 {/* Book Info */}
//                 <BookInfo book={book} />

//                 {/* Book Properties */}
//                 <BookSubInfo book={book} />

//                 {/* About */}
//                 <AboutBook book={book} />

//                 {/* Owner Details */}
//                 <OwnerInfo book={book} />
            
//             <View style={{ height: 70 }} />
//             { /* Swap Me Button */}
            
//             </ScrollView>
//             <View style={styles.bottomContainer}>
//             <TouchableOpacity 
//             onPress={InitiateChat}
//             style={styles.swapBtn}>
//                 <Text style={styles.TextContent}>
//                     Swap
//                 </Text>
//             </TouchableOpacity>
//             </View>
//         </View>
//     );
// }
// const styles = StyleSheet.create({
//     swapBtn:{
//         padding:15,
//         backgroundColor:Colors.VIOLET,

//     },
//     bottomContainer:{
//         position:'absolute',
//         width:'100%',
        
//         bottom:0
//     },
//     TextContent:{
//         textAlign:'center',
//         fontFamily:'solway-medium',
//         fontSize:20,
//         color:Colors.PRIMARY
//     }

// })





// import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
// import React, { useEffect } from 'react';
// import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
// import BookInfo from '../../components/BookDetails/BookInfo';
// import BookSubInfo from '../../components/BookDetails/BookSubInfo';
// import AboutBook from '../../components/BookDetails/AboutBook';
// import OwnerInfo from '../../components/BookDetails/OwnerInfo';
// import Colors from '../../constants/Colors';
// import { collection, getDocs, query, where, setDoc, doc } from 'firebase/firestore';
// import { db } from '../../config/FirebaseConfig';
// import { useUser } from '@clerk/clerk-expo';

// export default function BookDetails() {
//     const book = useLocalSearchParams();
//     const navigation = useNavigation();
//     const { user } = useUser();
//     const router = useRouter();

//     useEffect(() => {
//         navigation.setOptions({
//             headerTransparent: true,
//             headerTitle: ''
//         });
//     }, []);
//     /**
//      * 
//      * Used to initiate the chat between two users
//      */

//     const InitiateChat = async () => {
//         if (!user || !user.primaryEmailAddress || !book.email) {
//             console.error("User or book details missing!");
//             return;
//         }

//         const userEmail = user.primaryEmailAddress.toString();
//         const docId1 = `${userEmail}_${book.email}`;
//         const docId2 = `${book.email}_${userEmail}`;

//         try {
//             const q = query(collection(db, 'Chat'), where('id', 'in', [docId1, docId2]));
//             const querySnapshot = await getDocs(q);

//             if (!querySnapshot.empty) {
//                 querySnapshot.forEach(doc => console.log("Chat exists:", doc.data()));

//                 // Redirect to existing chat
//                 router.push({
//                     pathname: '/chat',
//                     params: { id: docId1 }
//                 });
//                 return;
//             }

//             // If no existing chat, create new chat entry
//             await setDoc(doc(db, 'Chat', docId1), {
//                 id: docId1,
//                 users: [
//                     {
//                         email: userEmail,
//                         imageUrl: user?.imageUrl,
//                         name: user?.fullName
//                     },
//                     {
//                         email: book.email,
//                         imageUrl: book?.userImage || '',
//                         name: book?.username || 'Unknown'
//                     }
//                 ],
//                 createdAt: new Date().toISOString()
//             });

//             // Redirect to new chat
//             router.push({
//                 pathname: '/chat',
//                 params: { id: docId1 }
//             });

//         } catch (error) {
//             console.error("Error initiating chat:", error);
//         }
//     };

//     return (
//         <View style={{ flex: 1 }}>
//             <ScrollView>
//                 {/* Book Details */}
//                 <BookInfo book={book} />
//                 <BookSubInfo book={book} />
//                 <AboutBook book={book} />
//                 <OwnerInfo book={book} />
//                 <View style={{ height: 70 }} />
//             </ScrollView>

//             {/* Swap Button */}
//             <View style={styles.bottomContainer}>
//                 <TouchableOpacity onPress={InitiateChat} style={styles.swapBtn}>
//                     <Text style={styles.TextContent}>Swap</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     swapBtn: {
//         padding: 15,
//         backgroundColor: Colors.VIOLET,
//         borderRadius: 10,
//         alignItems: 'center'
//     },
//     bottomContainer: {
//         position: 'absolute',
//         width: '100%',
//         bottom: 0,
//         paddingBottom: 20
//     },
//     TextContent: {
//         textAlign: 'center',
//         fontFamily: 'solway-medium',
//         fontSize: 20,
//         color: Colors.PRIMARY
//     }
// });




// import { View, Text } from 'react-native'
// import React, { useEffect } from 'react'
// import { useLocalSearchParams, useNavigation } from 'expo-router'
// import BookInfo from '../../components/BookDetails/BookInfo';
// import BookSubInfo from '../../components/BookDetails/BookSubInfo';
// import AboutBook from '../../components/BookDetails/AboutBook';
// import { ScrollView } from 'react-native';
// import OwnerInfo from '../../components/BookDetails/OwnerInfo';

// export default function BookDetails(){
//     const book=useLocalSearchParams();
//     const navigation=useNavigation();

//     useEffect(()=>{
//         navigation.setOptions({
//             headerTransparent:true,
//             headerTitle:''
//         })
//     })
//   return (
//     <View >
//         <ScrollView>
//      { /* Book Info */}
//      <BookInfo book={book}/>

//      { /* Book Properties */}
//         <BookSubInfo book={book}/>
//      { /*About */}
//      <AboutBook book={book}/>
//      { /* Owner Details */}
     
//      <OwnerInfo book={book}/>
//      { /* Swap Me Button */}
//      </ScrollView>
//      <View style={{height:70}}>

//      </View>


//     </View>
//   )
// }



// import { View, Text } from 'react-native'
// import React, { useEffect } from 'react'
// import { useLocalSearchParams, useNavigation } from 'expo-router'
// import BookInfo from '../../components/BookDetails/BookInfo';
// import BookSubInfo from '../../components/BookDetails/BookSubInfo';
// import AboutBook from '../../components/BookDetails/AboutBook';
// import { ScrollView } from 'react-native';
// import OwnerInfo from '../../components/BookDetails/OwnerInfo';

// export default function BookDetails(){
//     const book=useLocalSearchParams();
//     const navigation=useNavigation();

//     useEffect(()=>{
//         navigation.setOptions({
//             headerTransparent:true,
//             headerTitle:''
//         })
//     })
//   return (
//     <View >
//         <ScrollView>
//      { /* Book Info */}
//      <BookInfo book={book}/>

//      { /* Book Properties */}
//         <BookSubInfo book={book}/>
//      { /*About */}
//      <AboutBook book={book}/>
//      { /* Owner Details */}
     
//      <OwnerInfo book={book}/>
//      { /* Swap Me Button */}
//      </ScrollView>
//      <View style={{height:70}}>

//      </View>


//     </View>
//   )
// }
