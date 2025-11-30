
import React, { useEffect } from 'react';
import { 
  View, TextInput, TouchableOpacity, FlatList, StyleSheet, Text, Image, ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { doc, getDoc, collection, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { format } from 'date-fns';
import Colors from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useUser();
  const [messages, setMessages] = React.useState([]);
  const [inputText, setInputText] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (!id) {
      console.error("Chat ID missing");
      return;
    }
    getChatHeaderTitle();
    const unsubscribe = listenForMessages();
    return unsubscribe;
  }, [id]);

  const getChatHeaderTitle = async () => {
    try {
      const chatDocRef = doc(db, 'Chat', id);
      const chatDocSnap = await getDoc(chatDocRef);
      if (chatDocSnap.exists()) {
        const data = chatDocSnap.data();
        const otherUser = data.users.find(u => u.email !== user?.primaryEmailAddress?.emailAddress);
        navigation.setOptions({ headerTitle: otherUser?.name || "Chat" });
      }
    } catch (error) {
      console.error("Error fetching chat header:", error);
    }
  };

  const listenForMessages = () => {
    const messagesRef = collection(db, 'Chat', id, 'Messages');
    const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(messagesQuery, snapshot => {
      const loadedMessages = snapshot.docs.map(docSnap => ({
        _id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt ? docSnap.data().createdAt.toDate() : new Date()
      }));
      setMessages(loadedMessages);
    });
    return unsubscribe;
  };

  const sendMessage = async () => {
    if (inputText.trim() === "") return;
    const newMessage = {
      text: inputText,
      createdAt: serverTimestamp(),
      user: {
        _id: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName,
        avatar: user?.imageUrl
      }
    };
    try {
      await addDoc(collection(db, 'Chat', id, 'Messages'), newMessage);
      await updateDoc(doc(db, 'Chat', id), {
        latestMessage: newMessage.text,
        latestMessageTimestamp: serverTimestamp()
      });
      setInputText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Meetup button handler: navigates to the Meetup screen
  const handleMeetup = () => {
    router.push('/meetup');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item._id}
        inverted
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble,
            item.user._id === user?.primaryEmailAddress?.emailAddress ? styles.myMessage : styles.otherMessage
          ]}>
            {item.user.avatar && (
              <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            )}
            <View>
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.messageSender}>{item.user.name}</Text>
              <Text style={styles.messageTime}>{format(item.createdAt, "MMM d, h:mm a")}</Text>
            </View>
          </View>
        )}
      />
      {/* Input & Send Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      {/* Small Meetup Icon at top right */}
      <TouchableOpacity style={styles.meetupIcon} onPress={handleMeetup}>
        <Ionicons name="location-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.PRIMARY 
  },
  messageBubble: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: "75%"
  },
  myMessage: {
    backgroundColor: Colors.PATONEU,
    alignSelf: "flex-end"
  },
  otherMessage: {
    backgroundColor: "#ddd",
    alignSelf: "flex-start"
  },
  messageText: {
    color: "black",
    fontFamily: "solway-bold"
  },
  messageSender: {
    fontSize: 12,
    color: Colors.GRAY,
    marginTop: 4,
    fontFamily: "solway-medium"
  },
  messageTime: {
    fontSize: 10,
    color: Colors.GRAY,
    marginTop: 2,
    fontFamily: "solway"
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: Colors.PRIMARY
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 20,
    marginRight: 10,
    fontFamily: "solway-medium"
  },
  sendButton: {
    backgroundColor: Colors.VIOLET,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center"
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  // Small meetup icon style positioned at top right corner
  meetupIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.VIOLET,
    padding: 5,
    borderRadius: 15,
    zIndex: 999,
  },
});


// // app/chat/[id].jsx
// import React, { useEffect, useState } from 'react';
// import { View, TextInput, TouchableOpacity, FlatList, StyleSheet, Text, Image, ActivityIndicator } from 'react-native';
// import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
// import { doc, getDoc, collection, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
// import { db } from '../../config/FirebaseConfig';
// import { useUser } from '@clerk/clerk-expo';
// import { format } from 'date-fns';
// import Colors from '../../constants/Colors';

// export default function ChatScreen() {
//   const { id } = useLocalSearchParams();
//   const navigation = useNavigation();
//   const router = useRouter();
//   const { user } = useUser();
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!id) {
//       console.error("Chat ID missing");
//       return;
//     }
//     getChatHeaderTitle();
//     const unsubscribe = listenForMessages();
//     return unsubscribe;
//   }, [id]);

//   const getChatHeaderTitle = async () => {
//     try {
//       const chatDocRef = doc(db, 'Chat', id);
//       const chatDocSnap = await getDoc(chatDocRef);
//       if (chatDocSnap.exists()) {
//         const data = chatDocSnap.data();
//         const otherUser = data.users.find(u => u.email !== user?.primaryEmailAddress?.emailAddress);
//         navigation.setOptions({ headerTitle: otherUser?.name || "Chat" });
//       }
//     } catch (error) {
//       console.error("Error fetching chat header:", error);
//     }
//   };

//   const listenForMessages = () => {
//     const messagesRef = collection(db, 'Chat', id, 'Messages');
//     const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));
//     const unsubscribe = onSnapshot(messagesQuery, snapshot => {
//       const loadedMessages = snapshot.docs.map(docSnap => ({
//         _id: docSnap.id,
//         ...docSnap.data(),
//         createdAt: docSnap.data().createdAt ? docSnap.data().createdAt.toDate() : new Date()
//       }));
//       setMessages(loadedMessages);
//     });
//     return unsubscribe;
//   };

//   const sendMessage = async () => {
//     if (inputText.trim() === "") return;
//     const newMessage = {
//       text: inputText,
//       createdAt: serverTimestamp(),
//       user: {
//         _id: user?.primaryEmailAddress?.emailAddress,
//         name: user?.fullName,
//         avatar: user?.imageUrl
//       }
//     };
//     try {
//       await addDoc(collection(db, 'Chat', id, 'Messages'), newMessage);
//       await updateDoc(doc(db, 'Chat', id), {
//         latestMessage: newMessage.text,
//         latestMessageTimestamp: serverTimestamp()
//       });
//       setInputText("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   // Meetup button handler:
//   const handleMeetup = () => {
//     // If you have addresses in your user profile or chat data, pass them here:
//     // e.g., router.push({ pathname: '/meetup', params: { address1: user.address, address2: otherUser.address } })
//     router.push('/meetup');
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         keyExtractor={item => item._id}
//         inverted
//         renderItem={({ item }) => (
//           <View style={[
//             styles.messageBubble,
//             item.user._id === user?.primaryEmailAddress?.emailAddress ? styles.myMessage : styles.otherMessage
//           ]}>
//             {item.user.avatar && (
//               <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
//             )}
//             <View>
//               <Text style={styles.messageText}>{item.text}</Text>
//               <Text style={styles.messageSender}>{item.user.name}</Text>
//               <Text style={styles.messageTime}>{format(item.createdAt, "MMM d, h:mm a")}</Text>
//             </View>
//           </View>
//         )}
//       />
//       {/* Input & Send Section */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type a message..."
//           value={inputText}
//           onChangeText={setInputText}
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//           <Text style={styles.sendButtonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//       {/* Meetup Button */}
//       <TouchableOpacity style={styles.meetupButton} onPress={handleMeetup}>
//         <Text style={styles.meetupButtonText}>Find a Meetup Spot</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.PRIMARY },
//   messageBubble: { flexDirection: "row", alignItems: "center", padding: 10, marginVertical: 5, marginHorizontal: 10, borderRadius: 10, maxWidth: "75%" },
//   myMessage: { backgroundColor: Colors.PATONEU, alignSelf: "flex-end" },
//   otherMessage: { backgroundColor: "#ddd", alignSelf: "flex-start" },
//   messageText: { color: "black", fontFamily: "solway-bold" },
//   messageSender: { fontSize: 12, color: Colors.GRAY, marginTop: 4, fontFamily: "solway-medium" },
//   messageTime: { fontSize: 10, color: Colors.GRAY, marginTop: 2, fontFamily: "solway" },
//   avatar: { width: 30, height: 30, borderRadius: 15, marginRight: 10 },
//   inputContainer: { flexDirection: "row", alignItems: "center", padding: 10, borderTopWidth: 1, borderColor: "#ccc", backgroundColor: Colors.PRIMARY },
//   input: { flex: 1, padding: 10, borderWidth: 2, borderColor: "#ccc", borderRadius: 20, marginRight: 10, fontFamily: "solway-medium" },
//   sendButton: { backgroundColor: Colors.VIOLET, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, alignItems: "center", justifyContent: "center" },
//   sendButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
//   meetupButton: { backgroundColor: '#4CAF50', padding: 15, alignItems: 'center', justifyContent: 'center', borderRadius: 10, margin: 10 },
//   meetupButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
// });

// // app/chat/[id].jsx
// import { View, TextInput, Button, FlatList, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { useLocalSearchParams, useNavigation } from 'expo-router';
// import { db } from '../../config/FirebaseConfig';
// import { doc, getDoc, collection, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
// import { useUser } from '@clerk/clerk-expo';
// import { format } from 'date-fns';
// import Colors from '../../constants/Colors';

// export default function ChatScreen() {
//   const { id } = useLocalSearchParams();
//   const navigation = useNavigation();
//   const { user } = useUser();
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState("");

//   useEffect(() => {
//     if (!id) {
//       console.error("Chat ID missing");
//       return;
//     }
//     console.log("Chat route param (id):", id);
//     getChatHeaderTitle();
//     const unsubscribe = listenForMessages();
//     return unsubscribe;
//   }, [id]);

//   const getChatHeaderTitle = async () => {
//     try {
//       const chatDocRef = doc(db, 'Chat', id);
//       const chatDocSnap = await getDoc(chatDocRef);
//       if (chatDocSnap.exists()) {
//         const data = chatDocSnap.data();
//         const otherUser = data.users.find(u => u.email !== user?.primaryEmailAddress?.emailAddress);
//         navigation.setOptions({ headerTitle: otherUser?.name || "Chat" });
//       }
//     } catch (error) {
//       console.error("Error fetching chat header:", error);
//     }
//   };

//   const listenForMessages = () => {
//     const messagesRef = collection(db, 'Chat', id, 'Messages');
//     const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));
//     const unsubscribe = onSnapshot(messagesQuery, snapshot => {
//       const loadedMessages = snapshot.docs.map(docSnap => ({
//         _id: docSnap.id,
//         ...docSnap.data(),
//         createdAt: docSnap.data().createdAt ? docSnap.data().createdAt.toDate() : new Date()
//       }));
//       setMessages(loadedMessages);
//     });
//     return unsubscribe;
//   };

//   const sendMessage = async () => {
//     if (inputText.trim() === "") return;
//     const newMessage = {
//       text: inputText,
//       createdAt: serverTimestamp(),
//       user: {
//         _id: user?.primaryEmailAddress?.emailAddress,
//         name: user?.fullName,
//         avatar: user?.imageUrl
//       }
//     };
//     try {
//       await addDoc(collection(db, 'Chat', id, 'Messages'), newMessage);
//       await updateDoc(doc(db, 'Chat', id), {
//         latestMessage: newMessage.text,
//         latestMessageTimestamp: serverTimestamp()
//       });
//       console.log("Message sent:", newMessage.text);
//       setInputText("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={messages}
//         keyExtractor={item => item._id}
//         inverted
//         renderItem={({ item }) => (
//           <View style={[
//             styles.messageBubble,
//             item.user._id === user?.primaryEmailAddress?.emailAddress ? styles.myMessage : styles.otherMessage
//           ]}>
//             {item.user.avatar && (
//               <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
//             )}
//             <View>
//               <Text style={styles.messageText}>{item.text}</Text>
//               <Text style={styles.messageSender}>{item.user.name}</Text>
//               <Text style={styles.messageTime}>{format(item.createdAt, "MMM d, h:mm a")}</Text>
//             </View>
//           </View>
//         )}
//       />
//       {/* <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type a message..."
//           value={inputText}
//           onChangeText={setInputText}
//         />
//         <Button title="Send" onPress={sendMessage} />
//       </View> */}
//       <View style={styles.inputContainer}>
//   <TextInput
//     style={styles.input}
//     placeholder="Type a message..."
//     value={inputText}
//     onChangeText={setInputText}
//   />
//   <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//     <Text style={styles.sendButtonText}>Send</Text>
//   </TouchableOpacity>
// </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.PRIMARY },
//   messageBubble: { flexDirection: "row", alignItems: "center", padding: 10, marginVertical: 5, marginHorizontal: 10, borderRadius: 10, maxWidth: "75%" },
//   myMessage: { backgroundColor: Colors.PATONEU, alignSelf: "flex-end" },
//   otherMessage: { backgroundColor: "#ddd", alignSelf: "flex-start" },
//   messageText: { color: "black", fontFamily: "solway-bold" },
//   messageSender: { fontSize: 12, color: Colors.GRAY, marginTop: 4, fontFamily: "solway-medium" },
//   messageTime: { fontSize: 10, color: Colors.GRAY, marginTop: 2, fontFamily: "solway" },
//   avatar: { width: 30, height: 30, borderRadius: 15, marginRight: 10 },
//   inputContainer: { flexDirection: "row", alignItems: "center", padding: 10, borderTopWidth: 1, borderColor: "#ccc", backgroundColor: Colors.PRIMARY },
//   input: { flex: 1, padding: 10, borderWidth: 2, borderColor: "#ccc", borderRadius: 20, marginRight: 10, fontFamily: "solway-medium" },
//   sendButton: {
//     backgroundColor: Colors.VIOLET, // your violet color
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   sendButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });


// import { View, TextInput, Button, FlatList, StyleSheet, Text, Image } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { useLocalSearchParams, useNavigation } from 'expo-router';
// import { db } from '../../config/FirebaseConfig';
// import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
// import { useUser } from '@clerk/clerk-expo';
// import { format } from 'date-fns';
// import Colors from '../../constants/Colors';

// export default function ChatScreen() {
//     const params = useLocalSearchParams();
//     const navigation = useNavigation();
//     const { user } = useUser();
//     const [messages, setMessages] = useState([]);
//     const [inputText, setInputText] = useState("");

//     useEffect(() => {
//         if (!params?.id) {
//             console.error("Chat ID missing");
//             return;
//         }

//         GetUserDetails();
//         listenForMessages(); // Start real-time listener
//     }, [params.id]);

//     /** 🔹 Get Other User Details **/
//     const GetUserDetails = async () => {
//         const docRef = doc(db, 'Chat', params?.id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//             const result = docSnap.data();
//             const otherUser = result?.users.find(item => item.email !== user?.primaryEmailAddress?.emailAddress);
//             navigation.setOptions({ headerTitle: otherUser?.name || "Chat" });
//         } else {
//             console.log("No such chat exists");
//         }
//     };

//     /** 🔹 Listen for New Messages in Firestore **/
//     const listenForMessages = () => {
//         const chatRef = collection(db, 'Chat', params.id, 'Messages');
//         const q = query(chatRef, orderBy("createdAt", "desc"));

//         return onSnapshot(q, (snapshot) => {
//             const loadedMessages = snapshot.docs.map(doc => ({
//                 _id: doc.id, // Assign Firestore ID to messages
//                 ...doc.data(),
//                 createdAt: doc.data().createdAt?.toDate() || new Date() // Convert Firestore timestamp
//             }));
//             setMessages(loadedMessages);
//         });
//     };

//     /** 🔹 Send Message & Save in Firestore **/
//     const sendMessage = async () => {
//         if (inputText.trim() === "") return; // Don't send empty messages

//         const newMessage = {
//             _id: Math.random().toString(36).substring(7), // Generate unique ID
//             text: inputText,
//             createdAt: serverTimestamp(), // Firestore timestamp
//             user: {
//                 _id: user?.primaryEmailAddress?.emailAddress,
//                 name: user?.fullName,
//                 avatar: user?.imageUrl
//             }
//         };

//         try {
//             await addDoc(collection(db, 'Chat', params.id, 'Messages'), newMessage);
//             setInputText(""); // Clear input field after sending
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             {/* 🔹 Messages List */}
//             <FlatList
//                 data={messages}
//                 keyExtractor={item => item._id}
//                 inverted // Newest messages at the bottom
//                 renderItem={({ item }) => (
//                     <View style={[
//                         styles.messageBubble,
//                         item.user._id === user?.primaryEmailAddress?.emailAddress ? styles.myMessage : styles.otherMessage
//                     ]}>
//                         {item.user.avatar && (
//                             <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
//                         )}
//                         <View>
//                             <Text style={styles.messageText}>{item.text}</Text>
//                             <Text style={styles.messageSender}>{item.user.name}</Text>
//                             <Text style={styles.messageTime}>
//                                 {format(item.createdAt, "MMM d, h:mm a")}
//                             </Text>
//                         </View>
//                     </View>
//                 )}
//             />

//             {/* 🔹 Input Field & Send Button */}
//             <View style={styles.inputContainer}>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Type a message..."
//                     value={inputText}
//                     onChangeText={setInputText}
//                 />
//                 <Button 
//                     title="Send" onPress={sendMessage} />
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: Colors.PRIMARY
//     },
//     messageBubble: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10,
//         marginVertical: 5,
//         marginHorizontal: 10,
//         borderRadius: 10,
//         maxWidth: "75%"
//     },
//     myMessage: {
//         backgroundColor: Colors.PATONEU,
//         alignSelf: "flex-end"
//     },
//     otherMessage: {
//         backgroundColor: "#ddd",
//         alignSelf: "flex-start"
//     },
//     messageText: {
//         color: "black",
//         fontFamily:'solway-bold'
//     },
//     messageSender: {
//         fontSize: 12,
//         color: Colors.GRAY,
//         marginTop: 4,
//         fontFamily:'solway-medium'
//     },
//     messageTime: {
//         fontSize: 10,
//         color: Colors.GRAY,
//         marginTop: 2,
//         fontFamily:'solway'
//     },
//     avatar: {
//         width: 30,
//         height: 30,
//         borderRadius: 15,
//         marginRight: 10
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10,
//         borderTopWidth: 1,
//         borderColor: '#ccc',
//         backgroundColor: Colors.PRIMARY,
//     },
//     input: {
//         flex: 1,
//         padding: 10,
//         borderWidth: 2,
//         borderColor: '#ccc',
//         borderRadius: 20,
//         marginRight: 10,
//         fontFamily:'solway-medium'
//     }
// });



// import { View, TextInput, Button, FlatList, StyleSheet, Text, Image } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { useLocalSearchParams, useNavigation } from 'expo-router';
// import { db } from '../../config/FirebaseConfig';
// import { doc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
// import { useUser } from '@clerk/clerk-expo';

// export default function ChatScreen() {
//     const params = useLocalSearchParams();
//     const navigation = useNavigation();
//     const { user } = useUser();
//     const [messages, setMessages] = useState([]);
//     const [inputText, setInputText] = useState("");

//     useEffect(() => {
//         if (!params?.id) {
//             console.error("Chat ID missing");
//             return;
//         }

//         GetUserDetails();
//         listenForMessages(); // Start real-time listener

//     }, [params.id]);

//     /** 🔹 Get Other User Details **/
//     const GetUserDetails = async () => {
//         const docRef = doc(db, 'Chat', params?.id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//             const result = docSnap.data();
//             const otherUser = result?.users.find(item => item.email !== user?.primaryEmailAddress?.emailAddress);
//             navigation.setOptions({ headerTitle: otherUser?.name || "Chat" });
//         } else {
//             console.log("No such chat exists");
//         }
//     };

//     /** 🔹 Listen for New Messages in Firestore **/
//     const listenForMessages = () => {
//         const chatRef = collection(db, 'Chat', params.id, 'Messages');
//         const q = query(chatRef, orderBy("createdAt", "desc"));

//         return onSnapshot(q, (snapshot) => {
//             const loadedMessages = snapshot.docs.map(doc => ({
//                 _id: doc.id,
//                 ...doc.data()
//             }));
//             setMessages(loadedMessages);
//         });
//     };

//     /** 🔹 Send Message & Save in Firestore **/
//     const sendMessage = async () => {
//         if (inputText.trim() === "") return; // Don't send empty messages

//         const newMessage = {
//             text: inputText,
//             createdAt: serverTimestamp(), // Correct timestamp for Firestore
//             user: {
//                 _id: user?.primaryEmailAddress?.emailAddress,
//                 name: user?.fullName,
//                 avatar: user?.imageUrl
//             }
//         };

//         try {
//             await addDoc(collection(db, 'Chat', params.id, 'Messages'), newMessage);
//             setInputText(""); // Clear input field after sending
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             {/* 🔹 Messages List */}
//             <FlatList
//                 data={messages}
//                 keyExtractor={item => item._id}
//                 inverted // Newest messages at the bottom
//                 renderItem={({ item }) => (
//                     <View style={[
//                         styles.messageBubble,
//                         item.user._id === user?.primaryEmailAddress?.emailAddress ? styles.myMessage : styles.otherMessage
//                     ]}>
//                         {item.user.avatar && (
//                             <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
//                         )}
//                         <View>
//                             <Text style={styles.messageText}>{item.text}</Text>
//                             <Text style={styles.messageSender}>{item.user.name}</Text>
//                         </View>
//                     </View>
//                 )}
//             />

//             {/* 🔹 Input Field & Send Button */}
//             <View style={styles.inputContainer}>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Type a message..."
//                     value={inputText}
//                     onChangeText={setInputText}
//                 />
//                 <Button title="Send" onPress={sendMessage} />
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5'
//     },
//     messageBubble: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10,
//         marginVertical: 5,
//         marginHorizontal: 10,
//         borderRadius: 10,
//         maxWidth: "75%"
//     },
//     myMessage: {
//         backgroundColor: "#4CAF50",
//         alignSelf: "flex-end"
//     },
//     otherMessage: {
//         backgroundColor: "#ddd",
//         alignSelf: "flex-start"
//     },
//     messageText: {
//         color: "#000"
//     },
//     messageSender: {
//         fontSize: 12,
//         color: "#555",
//         marginTop: 4
//     },
//     avatar: {
//         width: 30,
//         height: 30,
//         borderRadius: 15,
//         marginRight: 10
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 10,
//         borderTopWidth: 1,
//         borderColor: '#ccc',
//         backgroundColor: 'white'
//     },
//     input: {
//         flex: 1,
//         padding: 10,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 20,
//         marginRight: 10
//     }
// });


// import { View, Text} from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { useLocalSearchParams, useNavigation } from 'expo-router'
// import { db } from '../../config/FirebaseConfig';
// import {doc, getDoc } from 'firebase/firestore';
// import { useUser } from '@clerk/clerk-expo';
// import { GiftedChat } from 'react-native-gifted-chat'

// export default function ChatScreen(){
//     const params=useLocalSearchParams();
//     // console.log(params);
//     const navigation=useNavigation();
//     const {user}=useUser();
//     const [messages, setMessages] = useState([])

//     useEffect(()=>{
//         GetUserDetails();

//     },[])



//     const GetUserDetails=async()=>{
//         const docRef=doc(db,'Chat',params?.id);
//         const docSnap=await getDoc(docRef);

//         const result=docSnap.data();
//         console.log(result);
//         const otherUser=result?.users.filter(item=> item.email!=user?.primaryEmailAddress.emailAddress);
//         console.log(otherUser);
//         navigation.setOptions({
//             headerTitle:otherUser[0].name
//         })

//     }
//     const onSend=(newMessage)=>{
    // setMessages((previousMessage)=>getPositionOfLineAndCharacter.append(previousMessage,newMessage));
    // await addDoc(collection(db,'Chat',params.id,'Messages'),newMessage[0])

//     }
//   return (
//     <GiftedChat
//     messages={messages}
//     onSend={messages => onSend(messages)}
//      showUserAvatar={true}
//     user={{
//       _id: user?.primaryEmailAddress?.emailAddress,
//       name:user?.fullName,
//      avatar:user?.imageUrl
//     }}
//   />
//   )
// }
