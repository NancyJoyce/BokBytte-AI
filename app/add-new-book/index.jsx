import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    ToastAndroid,
    ActivityIndicator,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import { useNavigation } from 'expo-router';
  import Colors from '../../constants/Colors';
  import { Picker } from '@react-native-picker/picker';
  import { getDocs, collection, addDoc } from 'firebase/firestore';
  import { db } from '../../config/FirebaseConfig';
  import * as ImagePicker from 'expo-image-picker';
  import { useUser } from '@clerk/clerk-expo';
  import FontAwesome from '@expo/vector-icons/FontAwesome';
  
  export default function AddNewBook() {
    const navigation = useNavigation();
    const { user } = useUser();
  
    const [formData, setFormData] = useState({
      title: '',
      author: '',
      category: 'Children',
      genre: '',
      condition: '',
      address: '',
      about: '',
      imageUrl: '',
      userId: user ? user.id : '',
      username: user ? user.fullName : '',
      userImage: user ? user.imageUrl : '',
      email: user ? user.primaryEmailAddress.emailAddress : '',
    });
  
    const [categoryList, setCategoryList] = useState([]);
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
  
    useEffect(() => {
      navigation.setOptions({ headerTitle: 'Add New Book' });
      GetCategories();
    }, []);
  
    const GetCategories = async () => {
      setCategoryList([]);
      const snapshot = await getDocs(collection(db, 'Category'));
      const categories = snapshot.docs.map(doc => doc.data().name);
      setCategoryList(categories);
    };
  
    const imagePicker = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        uploadImageToCloudinary(result.assets[0].uri);
      }
    };
  
    const uploadImageToCloudinary = async (imageUri) => {
      setIsUploading(true);
      let data = new FormData();
      data.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'book_image.jpg',
      });
      data.append('upload_preset', 'book_uploads');
  
      try {
        let response = await fetch('https://api.cloudinary.com/v1_1/dolkb9pjb/image/upload', {
          method: 'POST',
          body: data,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        });
  
        let result = await response.json();
  
        if (result.secure_url) {
          setFormData(prev => ({ ...prev, imageUrl: result.secure_url }));
          setImage(result.secure_url);
        } else {
          throw new Error('Cloudinary upload failed');
        }
      } catch (error) {
        ToastAndroid.show('Image upload failed!', ToastAndroid.SHORT);
      } finally {
        setIsUploading(false);
      }
    };
  
    const handleInputChange = (fieldName, fieldValue) => {
      setFormData(prev => ({ ...prev, [fieldName]: fieldValue }));
    };
  
    const onSubmit = async () => {
      if (
        !formData.title ||
        !formData.author ||
        !formData.category ||
        !formData.genre ||
        !formData.condition ||
        !formData.address ||
        !formData.about ||
        !formData.imageUrl
      ) {
        ToastAndroid.show('Enter all details including image', ToastAndroid.SHORT);
        return;
      }
  
      try {
        await addDoc(collection(db, 'Books'), formData);
        ToastAndroid.show('Book added successfully!', ToastAndroid.SHORT);
        navigation.goBack();
      } catch (error) {
        ToastAndroid.show('Error saving book!', ToastAndroid.SHORT);
      }
    };
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={{ padding: 20 }}
          contentContainerStyle={{ paddingBottom: 50 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Add a New Book to Swap</Text>
  
          <Pressable onPress={imagePicker}>
            {!image ? (
              <Image source={require('../../assets/images/bookplaceholder.png')} style={styles.image} />
            ) : (
              <Image source={{ uri: image }} style={styles.image} />
            )}
          </Pressable>
  
          {isUploading && <ActivityIndicator size="large" color={Colors.VIOLET} />}
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Book Title *</Text>
            <TextInput style={styles.input} onChangeText={value => handleInputChange('title', value)} />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Author *</Text>
            <TextInput style={styles.input} onChangeText={value => handleInputChange('author', value)} />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category *</Text>
            <Picker
              selectedValue={formData.category}
              style={styles.input}
              onValueChange={itemValue => handleInputChange('category', itemValue)}
            >
              {categoryList.map((category, index) => (
                <Picker.Item key={index} label={category} value={category} />
              ))}
            </Picker>
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Genre *</Text>
            <TextInput style={styles.input} onChangeText={value => handleInputChange('genre', value)} />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Target Age *</Text>
            <TextInput style={styles.input} onChangeText={value => handleInputChange('condition', value)} />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pages *</Text>
            <TextInput style={styles.input} onChangeText={value => handleInputChange('pages', value)} />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Language *</Text>
            <TextInput style={styles.input} onChangeText={value => handleInputChange('language', value)} />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>ISBN *</Text>
            <TextInput style={styles.input} onChangeText={value => handleInputChange('id', value)} />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Published *</Text>
            <TextInput style={styles.input} onChangeText={value => handleInputChange('published', value)} />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address *</Text>
            <TextInput style={styles.input} onChangeText={value => handleInputChange('address', value)} />
          </View>
  
          <View style={styles.inputContainer}>
            <Text style={styles.label}>About *</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              numberOfLines={5}
              multiline={true}
              onChangeText={value => handleInputChange('about', value)}
            />
          </View>
  
          <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={isUploading}>
            <Text style={styles.buttonText}>{isUploading ? 'Uploading...' : 'Submit'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    title: {
      fontFamily: 'solway-medium',
      fontSize: 20,
      color: Colors.VIOLET,
      marginBottom: 10,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: Colors.LIGHTGRAY,
      marginTop: 7,
    },
    inputContainer: {
      marginVertical: 5,
    },
    input: {
      padding: 10,
      backgroundColor: Colors.PRIMARY,
      borderRadius: 7,
      fontFamily: 'solway',
    },
    label: {
      marginVertical: 5,
      fontFamily: 'solway',
      color: Colors.PINK,
    },
    button: {
      padding: 15,
      backgroundColor: Colors.VIOLET,
      borderRadius: 7,
      marginVertical: 10,
      marginBottom: 40,
    },
    buttonText: {
      fontFamily: 'solway-medium',
      fontSize: 15,
      color: Colors.PRIMARY,
      textAlign: 'center',
    },
  });
  





// import { 
//     View, Text, Image, StyleSheet, TouchableOpacity, Pressable, 
//     ToastAndroid, ActivityIndicator, TextInput, ScrollView 
// } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { useNavigation } from 'expo-router';
// import Colors from '../../constants/Colors';
// import { Picker } from '@react-native-picker/picker';
// import { getDocs, collection, addDoc } from 'firebase/firestore';
// import { db } from '../../config/FirebaseConfig';
// import * as ImagePicker from 'expo-image-picker';
// import { useUser } from '@clerk/clerk-expo';
// import FontAwesome from '@expo/vector-icons/FontAwesome';

// export default function AddNewBook() {
//     const navigation = useNavigation();
//     const { user } = useUser();

//     const [formData, setFormData] = useState({
//         title: '',
//         author: '',
//         category: 'Children',
//         genre: '',
//         condition: '',
//         address: '',
//         about: '',
//         imageUrl: '',
//         userId: user ? user.id : '',
//         username: user ? user.fullName : '',
//         userImage: user ? user.imageUrl : '',
//         email:user ? user.primaryEmailAddress.emailAddress: '',
//     });

//     const [categoryList, setCategoryList] = useState([]);
//     const [image, setImage] = useState(null);
//     const [isUploading, setIsUploading] = useState(false);

//     <TouchableOpacity >
//                     <FontAwesome name="send" size={24} color={Colors.VIOLET} />
//     </TouchableOpacity>

//     useEffect(() => {
//         navigation.setOptions({
//             headerTitle: 'Add New Book',
//         });
//         GetCategories();
//     }, []);

//     const GetCategories = async () => {
//         setCategoryList([]);
//         const snapshot = await getDocs(collection(db, 'Category'));
//         const categories = snapshot.docs.map(doc => doc.data().name);  
//         setCategoryList(categories);
//     };

//     const imagePicker = async () => {
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1,
//         });

//         if (!result.canceled) {
//             setImage(result.assets[0].uri);
//             uploadImageToCloudinary(result.assets[0].uri);
//         }
//     };

//     const uploadImageToCloudinary = async (imageUri) => {
//         setIsUploading(true);
//         let data = new FormData();
//         data.append('file', {
//             uri: imageUri,
//             type: 'image/jpeg',
//             name: 'book_image.jpg',
//         });
//         data.append('upload_preset', 'book_uploads');

//         try {
//             let response = await fetch('https://api.cloudinary.com/v1_1/dolkb9pjb/image/upload', {
//                 method: 'POST',
//                 body: data,
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             let result = await response.json();

//             if (result.secure_url) {
//                 setFormData(prev => ({ ...prev, imageUrl: result.secure_url }));
//                 setImage(result.secure_url);
//             } else {
//                 throw new Error('Cloudinary upload failed');
//             }
//         } catch (error) {
//             ToastAndroid.show('Image upload failed!', ToastAndroid.SHORT);
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     const handleInputChange = (fieldName, fieldValue) => {
//         setFormData(prev => ({ ...prev, [fieldName]: fieldValue }));
//     };

//     const onSubmit = async () => {
//         if (!formData.title || !formData.author || !formData.category || 
//             !formData.genre || !formData.condition || !formData.address || 
//             !formData.about || !formData.imageUrl) {
//             ToastAndroid.show('Enter all details including image', ToastAndroid.SHORT);
//             return;
//         }

//         try {
//             await addDoc(collection(db, 'Books'), formData);
//             ToastAndroid.show('Book added successfully!', ToastAndroid.SHORT);
//             navigation.goBack();
//         } catch (error) {
//             ToastAndroid.show('Error saving book!', ToastAndroid.SHORT);
//         }
//     };

//     return (
//         <ScrollView style={{ padding: 20 }}>
//             <Text style={styles.title}>Add a New Book to Swap</Text>
//             <Pressable onPress={imagePicker}>
//                 {!image ? (
//                     <Image source={require('../../assets/images/bookplaceholder.png')} style={styles.image} />
//                 ) : (
//                     <Image source={{ uri: image }} style={styles.image} />
//                 )}
//             </Pressable>

//             {isUploading && <ActivityIndicator size="large" color={Colors.VIOLET} />}

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Book Title *</Text>
//                 <TextInput style={styles.input} onChangeText={(value) => handleInputChange('title', value)} />
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Author *</Text>
//                 <TextInput style={styles.input} onChangeText={(value) => handleInputChange('author', value)} />
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Category *</Text>
//                 <Picker
//                     selectedValue={formData.category}
//                     style={styles.input}
//                     onValueChange={(itemValue) => handleInputChange('category', itemValue)}>
//                     {categoryList.map((category, index) => (
//                         <Picker.Item key={index} label={category} value={category} />
//                     ))}
//                 </Picker>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Genre *</Text>
//                 <TextInput style={styles.input} onChangeText={(value) => handleInputChange('genre', value)} />
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Target Age *</Text>
//                 <TextInput style={styles.input} onChangeText={(value) => handleInputChange('condition', value)} />
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Pages *</Text>
//                 <TextInput style={styles.input} onChangeText={(value) => handleInputChange('pages', value)} />
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Language *</Text>
//                 <TextInput style={styles.input} onChangeText={(value) => handleInputChange('language', value)} />
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>ISBN *</Text>
//                 <TextInput style={styles.input} onChangeText={(value) => handleInputChange('id', value)} />
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Published *</Text>
//                 <TextInput style={styles.input} onChangeText={(value) => handleInputChange('published', value)} />
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Address *</Text>
//                 <TextInput style={styles.input} onChangeText={(value) => handleInputChange('address', value)} />
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>About *</Text>
//                 <TextInput
//                     style={[styles.input, { height: 100 }]}
//                     numberOfLines={5}
//                     multiline={true}
//                     onChangeText={(value) => handleInputChange('about', value)}
//                 />
//             </View>

//             <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={isUploading}>
//                 <Text style={styles.buttonText}>{isUploading ? 'Uploading...' : 'Submit'}</Text>
//             </TouchableOpacity>
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     title: { fontFamily: 'solway-medium', fontSize: 20, color: Colors.VIOLET },
//     image: { width: 100, height: 100, borderRadius: 15, borderWidth: 1, borderColor: Colors.LIGHTGRAY, marginTop: 7 },
//     inputContainer: { marginVertical: 5 },
//     input: { padding: 10, backgroundColor: Colors.PRIMARY, borderRadius: 7, fontFamily: 'solway' },
//     label: { marginVertical: 5, fontFamily: 'solway', color: Colors.PINK },
//     button: { padding: 15, backgroundColor: Colors.VIOLET, borderRadius: 7, marginVertical: 10, marginBottom: 40 },
//     buttonText: { fontFamily: 'solway-medium', fontSize: 15, color: Colors.PRIMARY, textAlign: 'center' },
// });





// import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, ToastAndroid } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { useNavigation } from 'expo-router'
// import Colors from '../../constants/Colors';
// import { TextInput } from 'react-native';
// import { ScrollView } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { getDocs,  collection } from 'firebase/firestore'
// import { db } from '../../config/FirebaseConfig'
// import * as ImagePicker from 'expo-image-picker';


// export default function AddNewBook(){
//     const navigation=useNavigation();
//     const [formData, setformData]=useState(
//         {category:'Children'}
//     );
//     const [categoryList, setCategoryList]=useState([]);
//     const [selectedCategory, setSelectedCategory]=useState();
//     const [image, setImage]=useState();

//     useEffect(()=>{
//         navigation.setOptions({
//             headerTitle:'Add New Book'
//         })
//         GetCategories();

//     },[])
//     const GetCategories=async()=>{
//             setCategoryList([]);
//             const snapshot= await getDocs(collection(db,'Category'));
//             snapshot.forEach((doc)=>{
//               console.log(doc.data());
//               setCategoryList(categoryList=>[...categoryList, doc.data()])
    
//         })
//     }
//     /**
//      * used to pick image from gallery
//      */
//     const imagePicker=async()=>{
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1,
//           });
      
//           console.log(result);
      
//           if (!result.canceled) {
//             setImage(result.assets[0].uri);
//           }
//     }

//     const handleInputChange=(fieldName, fieldValue)=>{
//         setformData(prev=>({
//             ...prev,
//             [fieldName]:fieldValue
//         }))
//     }
    
//     const onSubmit=()=>{
//         if(Object.keys(formData).length!=7)
//         {
//             ToastAndroid.show('Enter All Details',ToastAndroid.SHORT)
//             return;
//         }
//     }

//   return (
    
//     <ScrollView style={{
//         padding:20,
        
//     }}>
//       <Text style={{
//         fontFamily:'solway-medium',
//         fontSize:20,
//         color:Colors.VIOLET
//       }}>Add a New Book to Swap</Text>
//       <Pressable onPress={imagePicker}>
//       {!image? <Image source={require('./../../assets/images/bookplaceholder.png')}
//       style={{
//         width:100,
//         height:100,
//         borderRadius:15,
//         borderWidth:1,
//         borderColor:Colors.LIGHTGRAY,
//         marginTop:7
//       }}
//       />:
//       <Image source={{uri:image}}
//       style={{
//         width:100,
//         height:100,
//         borderRadius:15,
        
//         marginTop:7
//       }} />
//       }
//       </Pressable>

//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//                 Book Title *
//             </Text>
//             <TextInput style={styles.input} 
//             onChangeText={(value)=>handleInputChange('title', value)}></TextInput>
//         </View>

//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//                Author *
//             </Text>
//             <TextInput style={styles.input} 
//             onChangeText={(value)=>handleInputChange('author', value)}></TextInput>
//         </View>

        
//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//                 Category *
//             </Text>
//         <Picker
//         selectedValue={selectedCategory}
//         style={styles.input}
//         onValueChange={(itemValue, itemIndex) =>{
//             setSelectedCategory(itemValue);
//             handleInputChange('category',itemValue);
//         }
//         }>
//             {categoryList.map((category, index)=>(
//                 <Picker.Item key={index} label={category.name} value={category.name} />
//             ))}
        
        
//         </Picker>
//         </View>

//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//                 Genre*
//             </Text>
//             <TextInput style={styles.input}
//             onChangeText={(value)=>handleInputChange('genre', value)}></TextInput>
//         </View>

//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//                 Target Age *
//             </Text>
//             <TextInput style={styles.input} 
//             onChangeText={(value)=>handleInputChange('condition', value)}></TextInput>
//         </View>

//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//                 Address *
//             </Text>
//             <TextInput style={styles.input} 
//             onChangeText={(value)=>handleInputChange('address', value)}></TextInput>
//         </View>

//         <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//                 About *
//             </Text>
//             <TextInput style={[styles.input, { height: 100 }]}  
//             numberOfLines={5}
//             multiline={true}
//             onChangeText={(value)=>handleInputChange('about', value)}></TextInput>
//         </View>

//         <TouchableOpacity style={ [styles.button]} onPress={onSubmit}>
//             <Text style={{
//                 fontFamily:'solway-medium',
//                 fontSize:15,
//                 color:Colors.PRIMARY,
//                 textAlign:'center'
//             }
//             }>Submit</Text>
//         </TouchableOpacity>

        

//     </ScrollView>
//   )
// }

// const styles = StyleSheet.create({
//     inputContainer:{
//       marginVertical:5,

//     },
//     input:{
//             padding:10,
//             backgroundColor:Colors.PRIMARY,
//             borderRadius:7,
//             fontFamily:'solway'
//     },
//     label:{
//         marginVertical:5,
//         fontFamily:'solway',
//         color:Colors.PINK

//     },
//     button:{
//         padding:15,
//         backgroundColor:Colors.VIOLET,
//         borderRadius:7,
//         marginVertical:10,
//         marginBottom:40
//     }

// })
