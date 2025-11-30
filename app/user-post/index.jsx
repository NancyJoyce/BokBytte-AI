import { View, Text, Pressable, StyleSheet, Alert, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import BookListItem from '../../components/Home/BookListItem';
import Colors from '../../constants/Colors';

export default function UserPost() {
    const navigation = useNavigation();
    const { user } = useUser();
    const [userPostList, setUserPostList] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        navigation.setOptions({ headerTitle: 'User Post' });
        user && GetUserPost();
    }, [user]);

    const GetUserPost = async () => {
        if (!user) return;

        setLoader(true);
        const q = query(collection(db, 'Books'), where('email', '==', user.primaryEmailAddress.emailAddress));
        const querySnapshot = await getDocs(q);

        // Clear previous list to prevent duplicates
        const posts = [];
        querySnapshot.forEach((docSnap) => {
            posts.push({ ...docSnap.data(), docId: docSnap.id }); // Store Firestore docId
        });

        setUserPostList(posts);
        setLoader(false);
    };

    const OnDeletePost = (docId) => {
        Alert.alert(
            'Delete Post',
            'Do you really want to delete this post?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: async () => {
                        await deleteDoc(doc(db, 'Books', docId));
                        GetUserPost(); // Refresh list after deletion
                    }
                }
            ]
        );
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={styles.title}>User Post</Text>
            <FlatList
                style={styles.list}
                data={userPostList}
                numColumns={2}
                refreshing={loader}
                onRefresh={GetUserPost}
                renderItem={({ item }) => (
                    <View>
                        <BookListItem book={item} />
                        <Pressable onPress={() => OnDeletePost(item.docId)} style={styles.deleteButton}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </Pressable>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'solway-medium',
        fontSize: 26,
        marginTop: 5,
        marginLeft: 5,
        fontFamily:'solway-medium',
        color: Colors.VIOLET
    },
    list: {
        marginTop: 3,
        marginLeft: 3
    },
    deleteButton: {
        backgroundColor: Colors.PATONE,
        padding: 10,
        borderRadius: 7,
        marginTop: 5,
        marginRight: 3
    },
    deleteText: {
        color: Colors.PRIMARY,
        fontFamily: 'solway-medium',
        textAlign: 'center'
    }
});



// import { View, Text, Pressable, StyleSheet, Alert } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { useNavigation } from 'expo-router'
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../../config/FirebaseConfig';
// import { useUser } from '@clerk/clerk-expo';
// import { FlatList } from 'react-native';
// import BookListItem from '../../components/Home/BookListItem';
// import Colors from '../../constants/Colors';

// export default function UserPost() {
//     const navigation=useNavigation();
//     const {user}=useUser();
//     const [userPostList, setUserPostList]=useState([]);
//     const [loader, setLoader]=useState(false);
//     useEffect(()=>{
//         navigation.setOptions({
//             headerTitle:'User Post'
//         })
//         user && GetUserPost();
//     },[user])
// const GetUserPost=async()=>{
//     setLoader(true)
//     const q=query(collection(db,'Books'),where('email' ,'==',user?.primaryEmailAddress?.emailAddress));
//     const querySnapshot=await getDocs(q);
// /**
//  * to get user ppost
//  */
//     querySnapshot.forEach((doc)=>
//     {
//         console.log(doc.data())
//         setUserPostList(prev=>[...prev,doc.data()])
//     })
//     setLoader(false)
// }
//     const OnDeletePost=(docId)=>{
//         Alert.alert('Do you want to delete, Do you really want to delete this post',[
//         {
//             text:'Cancel',
//             onPress:()=>console.log("Cancel Click"),
//             style:'cancel'
//         },
//         {
//             text:'Delete',
//             onPress:()=>console.log("Delete")

//         }
//     ])

//     }
//   return (
//     <View stype={{
//         padding:20
//     }}>
//       <Text style={{
//         fontFamily:'solway-medium',
//         fontSize:26,
//         marginTop:20,
//         marginLeft:10
//       }}>UserPost</Text>
//       <FlatList 
//       style={{
//         marginTop:10,
//         marginLeft:15,
//       }}
//       data={userPostList}
//       numColumns={2}
//       refreshing={loader}
//       onRefresh={GetUserPost}
//       renderItem={({item,index})=>(
//         <View>
//         <BookListItem book={item} key={index}/>
//         <Pressable onPress={()=>OnDeletePost(item?.id)} style={styles.deleteButton}>
//             <Text style={{
//                 color: Colors.PRIMARY,
//                 fontFamily:'solway-medium',
//                 textAlign:'center'

//             }}>Delete</Text>
//             </Pressable>
//         </View>
//       )}
//       />
//     </View>
//   )
// }
// const styles = StyleSheet.create({
//     deleteButton:{
//         backgroundColor:Colors.PATONE,
//         padding:10,
//         borderRadius:7,
//         marginTop:5,
//         marginRight:10
//     }
// })

