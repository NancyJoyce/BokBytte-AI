import { View, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './../../config/FirebaseConfig';

const { width } = Dimensions.get('screen');

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);
  const flatListRef = useRef(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    GetSliders();
  }, []);

  useEffect(() => {
    if (sliderList.length === 0) return;

    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % sliderList.length;
      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true,
      });
    }, 6000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval); // Clear on unmount
  }, [sliderList]);

  const GetSliders = async () => {
    const snapshot = await getDocs(collection(db, 'Sliders'));
    const sliders = [];
    snapshot.forEach((doc) => {
      sliders.push(doc.data());
    });
    setSliderList(sliders);
  };

  return (
    <View style={{ marginTop: 15 }}>
      <FlatList
        ref={flatListRef}
        data={sliderList}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item?.imageUrl }} style={styles.sliderImage} />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sliderImage: {
    width: width * 0.9,
    height: 170,
    borderRadius: 15,
    marginRight: 15,
  },
});



// import { View, Text , StyleSheet, Image, FlatList, Dimensions} from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { collection, getDocs } from 'firebase/firestore'
// import {db} from './../../config/FirebaseConfig'


// export default function Slider(){

//     const[sliderList,setSliderList]=useState([]);
//     useEffect(()=>{
//         GetSliders();

//     },[])

//     const GetSliders=async()=>{
//         setSliderList([]);
//         const snapshot= await getDocs(collection(db, 'Sliders'));
//         snapshot.forEach((doc)=>{
//             console.log(doc.data());
//             setSliderList(sliderList=>[...sliderList,doc.data()])
//         })
//     }
//   return (
//     <View style={{
//         marginTop:15
//     }}>
//       <FlatList 
//       data={sliderList}
//       horizontal={true}
//       showsHorizontalScrollIndicator={false}
//       renderItem={({item,index})=>(
//         <View>
//             <Image source={{uri:item?.imageUrl}}
//             style={styles?.sliderImage} />
//             </View>
//       )}
//         />
//     </View>
//   )
// }
// const styles = StyleSheet.create({
//     sliderImage:{
//         width:Dimensions.get('screen').width*0.9,
//         height:170,
//         borderRadius:15,
//         marginRight:15
//     }
    
// })