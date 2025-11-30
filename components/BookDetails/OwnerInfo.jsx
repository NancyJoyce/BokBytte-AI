import { View, Text, Image, StyleSheet} from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function OwnerInfo({book}){
  return (
    <View style={styles.container}>
        <View style={{
            display:'flex',
            flexDirection:'row',
            gap:20
        }}>
      <Image source={{uri:book?.userImage}}
      style={{
        width:50,
        height:50,
        borderRadius:99

      }}/>
      <View>
        <Text style={{
            fontFamily:'solway-medium',
            fontSize:17
        }}>{book?.username}</Text>
        <Text style={{
            fontFamily:'solway',
            color:Colors.GRAY
        }}>Book Owner</Text>
      </View>
      </View>
      <FontAwesome name="send" size={24} color={Colors.VIOLET} />
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        marginHorizontal:20,
        paddingHorizontal:20,
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:20,
        borderWidth:1,
        borderRadius:15,
        padding:20,
        backgroundColor:Colors.PRIMARY,
        justifyContent:'space-between',
        borderColor:Colors.VIOLET,
        

    }
    
})
