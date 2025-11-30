// import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from './../../config/FirebaseConfig';
// import Colors from './../../constants/Colors';

// export default function Category({ category }) {
//   const [categoryList, setCategoryList] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('Children');

//   useEffect(() => {
//     GetCategories();
//   }, []);

//   /**
//    *  Used to get category List from database
//    */
//   const GetCategories = async () => {
//     setCategoryList([]);
//     const snapshot = await getDocs(collection(db, 'Category'));
//     snapshot.forEach((doc) => {
//       console.log(doc.data());
//       setCategoryList((categoryList) => [...categoryList, doc.data()]);
//     });
//   };

//   return (
//     <View style={{ marginTop: 20 }}>
//       <Text style={styles.categoryTitle}>Category</Text>

//       <FlatList
//         data={categoryList}
//         horizontal // Enable horizontal scrolling
//         showsHorizontalScrollIndicator={false}
//         renderItem={({ item, index }) => (
//           <TouchableOpacity
//             onPress={() => {
//               setSelectedCategory(item.name);
//               category(item.name);
//             }}
//             style={{ flex: 1 }}
//           >
//             <View
//               style={[
//                 styles.container,
//                 selectedCategory == item.name && styles.selectedCategoryContainer,
//               ]}
//             >
//               <Image
//                 source={{ uri: item?.imageUrl }} // Using the image URL from the database
//                 style={styles.image}
//               />
//             </View>

//           </TouchableOpacity>
//         )}
//         keyExtractor={(item, index) => index.toString()}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: Colors.VIOLET,
//     padding: 5, // Smaller padding to make the container more compact
//     alignItems: 'center',
//     borderRadius: 8, // Reduced the border radius for smaller look
//     borderWidth: 3,
//     borderColor: Colors.VIOLET,
//     margin: 10,
//     justifyContent: 'center',
//     width: 200, // Approximately 0.7 cm width
//     height: 60, // Approximately 0.7 cm height
//   },
//   selectedCategoryContainer: {
//     backgroundColor: Colors.VIOLET,
//     borderColor: "black"
//   },
//   image: {
//     width: 112, // Adjusted image size to fit inside the smaller container
//     height: 60, // Adjusted image height
//     resizeMode: 'contain',
//   },
//   categoryTitle: {
//     fontFamily: 'solway-medium',
//     fontSize: 20,
//     marginLeft: 10,
//   },
//   categoryName: {
//     textAlign: 'center',
//     fontFamily: 'solway-bold',
//     marginTop: 5,
//     fontSize: 16,
//   },
// });




import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import {db} from './../../config/FirebaseConfig'
import Colors from './../../constants/Colors'


export default function Category({category}){

    const [categoryList, setCategoryList]=useState([]);
    const [selectedCategory, setSelectedCategory]=useState('Children');
    useEffect(()=>{
        GetCategories()
    },[])
    /**
     *  Used to get category List from database
     */

    const GetCategories=async()=>{
        setCategoryList([]);
        const snapshot= await getDocs(collection(db,'Category'));
        snapshot.forEach((doc)=>{
          console.log(doc.data());
          setCategoryList(categoryList=>[...categoryList, doc.data()])

    })
}
  return (
    <View style={{
        marginTop:20
    }}>
      <Text style={{
        fontFamily:'solway-medium',
        fontSize:20
      }}>Category</Text>

      <FlatList
      data={categoryList}
      numColumns={4}
      renderItem={({item,index})=>(
        <TouchableOpacity 
        onPress={()=>{setSelectedCategory(item.name)
        category(item.name)
    }}
        style={{
          flex:1
        }}>
            <View style={[styles.container,
              selectedCategory==item.name&&styles.selectedCategoryContainer]
            }>
                <Image source={{uri:item?.imageUrl}}
                style={{
                    width:60,
                    height:40,
                    resizeMode: 'contain' 
                }}/>
                </View>
                <Text style={{
                  textAlign:'center',
                  fontFamily:'solway'
                }}>{item?.name}</Text>
            </TouchableOpacity>

              )
    }/>

    </View>
  )
}

const styles=StyleSheet.create({
  container:{
    backgroundColor:Colors.THISTLE,
    padding:10,
    alignItems:'center',
    borderRadius:15,
    borderWidth:1,
    borderColor:Colors.VIOLET,
    margin:5
  },
  selectedCategoryContainer:{
    backgroundColor:Colors.VIOLET,
    borderColor:Colors.PRIMARY
  }
})
