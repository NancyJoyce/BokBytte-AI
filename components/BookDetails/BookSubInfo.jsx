import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import BookSubInfoCard from './BookSubInfoCard'

export default function BookSubInfo({book}){
  return (
    <View style={{
        paddingHorizontal:20,
        
    }}>
        <View style={{
            display:'flex',
            flexDirection:'row'
        }}>
      
      <BookSubInfoCard 
      icon={require('./../../assets/images/calender.png')} 
      name={'Published'}
      value={book?.published}/>
      <BookSubInfoCard 
      icon={require('./../../assets/images/lang.png')}
      name={'Language'} 
      value={book?.language}/>

      </View>
       <View style={{
            display:'flex',
            flexDirection:'row'
        }}>
      
      <BookSubInfoCard 
      icon={require('./../../assets/images/pages.png')} 
      name={'Pages'}
      value={book?.pages}/>
      <BookSubInfoCard 
      icon={require('./../../assets/images/genre.png')}
      name={'Genre'} 
      value={book?.genre}/>
      

      </View>
    </View>
   
  )
}
