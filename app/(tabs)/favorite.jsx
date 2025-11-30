import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../constants/Colors'
import Shared from './../../Shared/Shared'
import { useUser } from '@clerk/clerk-expo'
import { collection, getDocs, where, query } from 'firebase/firestore'
import { db } from '../../config/FirebaseConfig'
import BookListItem from './../../components/Home/BookListItem'

export default function Favorite(){

  const {user}=useUser();
  const [favIds, setFavIds]=useState([]);
  const [favBookList, setFavBookList] = useState([]);
  const [loader, setLoader]=useState(false);

  useEffect(()=>{
    user && GetFavBookIds();
  },[user])

  useEffect(()=>{
    favIds.length > 0 && GetFavBookList();
  },[favIds]) // ✅ Fix: Ensure it runs only after favIds updates

//Fav IDS
const GetFavBookIds=async()=>{
  setLoader(true);
  const result=await Shared.GetFavList(user);
  setFavIds(result?.favorites || []);
  setLoader(false);
}

//Fetch Related Book List
const GetFavBookList=async()=>{
  setLoader(true);
  const q=query(collection(db, 'Books'), where('id','in', favIds));
  const querySnapshot=await getDocs(q);

  const books = [];
  querySnapshot.forEach((doc)=>{
      console.log(doc.data());
      books.push(doc.data()); // ✅ Fix: Collect data first
  });
  setFavBookList(books); // ✅ Fix: Update state once after loop
  setLoader(false);
}

  return (
    <View style={{
      padding:20,
      marginTop:20
    }}>
      <Text style={{
        fontFamily:'solway-medium',
        fontSize:30,
        color:Colors.VIOLET
      }}>Favorites</Text>

      <FlatList 
      data={favBookList}
      numColumns={2}
      onRefresh={GetFavBookIds}
      refreshing={loader}
      renderItem={({item})=>(
        <View>
          <BookListItem book={item}/>
        </View>
      )}/>
    </View>
  )
}



// import { View, Text, FlatList } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import Colors from '../../constants/Colors'
// import Shared from './../../Shared/Shared'
// import { useUser } from '@clerk/clerk-expo'
// import { collection, getDocs, where, query } from 'firebase/firestore'
// import { db } from '../../config/FirebaseConfig'
// import BookListItem from './../../components/Home/BookListItem'

// export default function Favorite(){

//   const {user}=useUser();
//   const [favIds, setFavIds]=useState([]);
//   const [favBookList, setFavBookList] = useState([]);

//   useEffect(()=>{
//     user && GetFavBookIds();
//   },[user])

// //Fav IDS
// const GetFavBookIds=async()=>{
//   const result=await Shared.GetFavList(user);
//   setFavIds(result?.favorites);
//   GetFavBookList();

// }

// //Fetch Related Book List
// const GetFavBookList=async()=>{
//   const q=query(collection(db, 'Books'), where('id','in', favIds));
//   const querySnapshot=await getDocs(q);
  

//   querySnapshot.forEach((doc)=>{
//       console.log(doc.data());
//       setFavBookList(prev=>[...prev,doc.data()])
//   })
// }

//   return (
//     <View style={{
//       padding:20,
//       marginTop:20
//     }}>
//       <Text style={{
//         fontFamily:'solway-medium',
//         fontSize:30,
//         color:Colors.VIOLET
//       }}>Favorites</Text>

//       <FlatList 
//       data={favBookList}
//       numColumns={2}
//       renderItem={({item, index})=>(
//         <View>
//           <BookListItem book={item}/>
//           </View>
//       )}/>
//     </View>
//   )
// }
