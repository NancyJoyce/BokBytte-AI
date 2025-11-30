import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router';
import MarkFav from './../../components/MarkFav'


export default function BookListItem({book}){
    const router=useRouter();
  return (
    <TouchableOpacity
    onPress={()=>router.push({
        pathname:'/book-details',
        params:book
    })}
    style={{
        padding:10,
        marginRight:15,
        backgroundColor: Colors.PRIMARY,
        borderRadius:10
    }}>
      <View style={{
        position:'absolute',
        zIndex:10,
        right:10,
        top:10

      }}>
        <MarkFav book={book} color="black"/>
      </View>
      <Image source={{uri:book?.imageUrl}}
      style={{
        width:135,
        height:135,
        objectFit:'cover',
        borderRadius:10
      }}/>
      <Text style={{
        fontFamily:'solway-medium',
        fontSize: 18
      }}>{book?.title}
      </Text>
      <View style={{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
      }}>
        <Text style={{
            color:Colors.GRAY,
            fontFamily:'solway'
        }}>{book?.author}</Text>
        <Text style={{
            fontFamily:'solway',
            color:Colors.VIOLET,
            paddingHorizontal:7,
            borderRadius:10,
            fontSize:11,
            backgroundColor:Colors.THISTLE
        }}>
            {book?.condition} YRS
        </Text>
      </View>
    </TouchableOpacity>
  )
}
