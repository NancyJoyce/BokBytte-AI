import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'

export default function BookSubInfoCard({icon, name, value}){
  return (
   <View style={{
           display:'flex',
           flexDirection:'row',
           alignItems:'center',
           backgroundColor:Colors.PRIMARY,
           padding:10,
           margin:5,
           borderRadius:8,
           gap:10,
           flex:1
         }}>
           <Image source={icon}
               style={{
                   width:40,
                   height:40
               }}/>
               <View>
                   <Text style={{
                       fontFamily:'solway',
                       fontSize:16,
                       color:Colors.GRAY
                   }}>{name}</Text>
                   <Text style={{
                       fontFamily:'solway',
                       fontSize:20
                   }}>{value}</Text>
               </View>
               </View>

  )
}
