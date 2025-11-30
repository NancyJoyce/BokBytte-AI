import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import Entypo from '@expo/vector-icons/Entypo';
import Colors from '../../constants/Colors';

export default function Header({ onToggleSidebar }) {
  const { user } = useUser();

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      
      {/* Left section: menu + name */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Menu Icon */}
        <TouchableOpacity onPress={onToggleSidebar} style={{
          marginRight: 10,
          padding: 6,
          borderRadius: 10,
          backgroundColor: Colors.PATONEU,
          elevation: 3
        }}>
          <Entypo name="menu" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>

        {/* Welcome Text */}
        <View>
          <Text style={{
            fontFamily: 'solway',
            fontSize: 18,
          }}>Welcome,</Text>
          <Text style={{
            fontFamily: 'solway-medium',
            fontSize: 25,
          }}>{user?.fullName}</Text>
        </View>
      </View>

      {/* Right: Profile Image */}
      <Image source={{ uri: user?.imageUrl }} style={{
        width: 40,
        height: 40,
        borderRadius: 99,
      }} />
    </View>
  );
}



// import { View, Text, Image } from 'react-native'
// import React from 'react'
// import { useUser } from '@clerk/clerk-expo';

// export default function Header(){
//   const {user} = useUser();

//   return (


//     <View style={{
//       display:'flex',
//       flexDirection:'row',
//       justifyContent:'space-between',
//       alignItems:'center'
//     }}>
//       <View>
//       <Text style={{
//         fontFamily:'solway',
//         fontSize:18
//       }}>Welcome,</Text>
//       <Text style={{
//         fontFamily:'solway-medium',
//         fontSize:25
//         }}>{user?.fullName}</Text>
//       </View>
//       <Image source={{uri:user?.imageUrl}} style={{
//         width:40,
//         height:40,
//         borderRadius:99
//       }}/>

//     </View>
//   )
// }
