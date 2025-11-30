
import { View, Text, FlatList, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import Category from './Category'
import { getDocs, query, where, collection } from 'firebase/firestore'
import { db } from '../../config/FirebaseConfig'
import BookListItem from './BookListItem'


export default function BookListByCategory(){

  const [bookList, setBookList]=useState([]);
  const [loader,setLoader]=useState(false);
  useEffect(()=>{
    GetBookList('Children')
  },[])
  /**
   * Used to get Book List on Category Selection
   * @param {*} category 
   */
  const GetBookList=async(category)=>{
    setLoader(false);
    setBookList([]);
    const q=query(collection(db,'Books'), where('category','==',category));
    const querySnapshot=await getDocs(q)

    querySnapshot.forEach(doc=>{
      console.log(doc.data());
      setBookList(bookList=>[...bookList,doc.data()])
    })
    setLoader(false);
  }
  return (
    <View>
      <Category category={(value)=>GetBookList(value)}/>
        <FlatList
        data={bookList}
        horizontal={true}
        style={{marginTop:10}}
        showsHorizontalScrollIndicator={false}
        refreshing={loader}
        onRefresh={()=>GetBookList('Children')}
        renderItem={({item, index})=>(
          <BookListItem book={item} />
        )}
        />
      </View>
  )
}
