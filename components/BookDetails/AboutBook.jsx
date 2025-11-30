import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../constants/Colors'

export default function AboutBook({book}){
    const [readMore, setReadMore]=useState(true);
  return (
    <View style={{
        padding:20
    }}>
      <Text style={{
        fontFamily:'solway-medium',
        fontSize:20
      }
      }>About {book?.title}</Text>
      <Text numberOfLines={readMore?1:10} style={{
        fontFamily:'solway',
        fontSize:16,
        color:Colors.GRAY
      }}>{book?.about}</Text>
       {readMore&&
       <Pressable onPress={()=>setReadMore(false)}><Text style={{
        fontFamily:'solway-medium',
        fontSize:14,
        color:Colors.PINK
       }}>Read More</Text>
       </Pressable>}
    </View>
  )
}
