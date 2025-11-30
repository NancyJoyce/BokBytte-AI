import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import MarkFav from '../MarkFav'


export default function BookInfo({book}){
  return (
    <View>
      <Image source={{uri:book.imageUrl}}
      style={{
        width:'100%',
        height:400,
        objectFit:'cover'
      }}/>
      <View style={{
        padding:20,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'

      }}>
        <View>
            <Text style={{
                fontFamily:'solway-bold',
                fontSize:27,
                color:Colors.VIOLET
            }}>{book?.title}</Text>

            <Text style={{
                fontFamily:'solway',
                fontSize:16,
                color:Colors.GRAY
            }}>{book?.address}</Text>
        </View>
        <MarkFav book={book}/>
      </View>
    </View>
  )
}
