import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/FirebaseConfig';
// import Swiper from 'react-native-deck-swiper';
import Colors from '../constants/Colors';
import { findSmartMatches } from '../utils/aiMatcher';
import { useRouter } from 'expo-router'; // ✅ Use expo-router

const { width } = Dimensions.get('window');

export default function MatchSwipe() {
  const { user } = useUser();
  const [swipeCards, setSwipeCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // ✅ Use expo-router's router

  const loadMatches = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'Books'));
      const allBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const userBooks = allBooks.filter(book => book.userId === user?.id);
      const otherBooks = allBooks.filter(book => book.userId !== user?.id);

      const matches = findSmartMatches(userBooks, otherBooks);

      const suggestions = matches.flatMap(match => match.suggestions);
      const uniqueSuggestions = Array.from(new Map(suggestions.map(item => [item.id, item])).values());

      setSwipeCards(uniqueSuggestions);
    } catch (e) {
      console.error('Error loading matches:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  if (swipeCards.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>No matches found!</Text>
      </View>
    );
  }

  const renderCard = (book) => (
    <View style={styles.card}>
      <Image
        source={{ uri: book.imageUrl || 'https://via.placeholder.com/140x180?text=No+Image' }}
        style={styles.image}
      />
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>by {book.author}</Text>
      <Text style={styles.detail}>Genre: {book.genre}</Text>
      <Text style={styles.detail}>Language: {book.language}</Text>
      <Text style={styles.uploaded}>Uploaded by: {book.user?.name || book.username}</Text>
    </View>
  );

  const handleSwipeRight = (cardIndex) => {
    const selectedBook = swipeCards[cardIndex];
    if (selectedBook) {
      router.push({
        pathname: '/book-details',
        params: {
          ...selectedBook
        }
      });
    }
  };

  // return (
  //   <View style={styles.container}>
  //     <Swiper
  //       cards={swipeCards}
  //       renderCard={renderCard}
  //       stackSize={3}
  //       cardIndex={0}
  //       backgroundColor="#f0f0f0"
  //       onSwipedRight={handleSwipeRight}
  //       onSwipedLeft={(cardIndex) => console.log('Skipped:', swipeCards[cardIndex]?.title)}
  //       overlayLabels={{
  //         left: {
  //           title: 'SKIP',
  //           style: {
  //             label: {
  //               backgroundColor: 'red',
  //               color: 'white',
  //               fontSize: 24,
  //             },
  //             wrapper: {
  //               flexDirection: 'column',
  //               alignItems: 'flex-end',
  //               justifyContent: 'flex-start',
  //               marginTop: 20,
  //               marginLeft: -20,
  //             },
  //           },
  //         },
  //         right: {
  //           title: 'MATCH',
  //           style: {
  //             label: {
  //               backgroundColor: 'green',
  //               color: 'white',
  //               fontSize: 24,
  //             },
  //             wrapper: {
  //               flexDirection: 'column',
  //               alignItems: 'flex-start',
  //               justifyContent: 'flex-start',
  //               marginTop: 20,
  //               marginLeft: 20,
  //             },
  //           },
  //         },
  //       }}
  //       animateOverlayLabelsOpacity
  //     />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontFamily: 'solway-medium',
    fontSize: 16,
    color: Colors.GRAY,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    height: 480,
    width: width - 40,
    alignSelf: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  image: {
    width: 140,
    height: 180,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontFamily: 'solway-bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: Colors.GRAY,
    fontFamily: 'solway-medium',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    fontFamily: 'solway',
    color: Colors.DARKGRAY,
  },
  uploaded: {
    marginTop: 10,
    fontStyle: 'italic',
    color: Colors.GRAY,
    fontSize: 12,
  },
});

// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
// import { useUser } from '@clerk/clerk-expo';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../config/FirebaseConfig';
// import Swiper from 'react-native-deck-swiper';
// import Colors from '../constants/Colors';
// import { findGenreMatches } from '../utils/aiMatcher';
// import { useNavigation } from '@react-navigation/native'; // ✅ Import navigation

// const { width } = Dimensions.get('window');

// export default function MatchSwipe() {
//   const { user } = useUser();
//   const [swipeCards, setSwipeCards] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation(); // ✅ Setup navigation

//   const loadMatches = async () => {
//     try {
//       const snapshot = await getDocs(collection(db, 'Books'));
//       const allBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//       const userBooks = allBooks.filter(book => book.userId === user?.id);
//       const otherBooks = allBooks.filter(book => book.userId !== user?.id);

//       const matches = findGenreMatches(userBooks, otherBooks);

//       const suggestions = matches.flatMap(match => match.suggestions);
//       const uniqueSuggestions = Array.from(new Map(suggestions.map(item => [item.id, item])).values());

//       setSwipeCards(uniqueSuggestions);
//     } catch (e) {
//       console.error('Error loading matches:', e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadMatches();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={Colors.PRIMARY} />
//       </View>
//     );
//   }

//   if (swipeCards.length === 0) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.noDataText}>No matches found!</Text>
//       </View>
//     );
//   }

//   const renderCard = (book) => (
//     <View style={styles.card}>
//       <Image
//         source={{ uri: book.imageUrl || 'https://via.placeholder.com/140x180?text=No+Image' }}
//         style={styles.image}
//       />
//       <Text style={styles.title}>{book.title}</Text>
//       <Text style={styles.author}>by {book.author}</Text>
//       <Text style={styles.detail}>Genre: {book.genre}</Text>
//       <Text style={styles.detail}>Language: {book.language}</Text>
//       <Text style={styles.uploaded}>Uploaded by: {book.user?.name || book.username}</Text>
//     </View>
//   );

//   const handleSwipeRight = (cardIndex) => {
//     const selectedBook = swipeCards[cardIndex];
//     if (selectedBook) {
//       navigation.navigate('BookDetails', { book: selectedBook }); // ✅ Navigate with book data
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Swiper
//         cards={swipeCards}
//         renderCard={renderCard}
//         stackSize={3}
//         cardIndex={0}
//         backgroundColor="#f0f0f0"
//         onSwipedRight={handleSwipeRight}
//         onSwipedLeft={(cardIndex) => console.log('Skipped:', swipeCards[cardIndex]?.title)}
//         overlayLabels={{
//           left: {
//             title: 'SKIP',
//             style: {
//               label: {
//                 backgroundColor: 'red',
//                 color: 'white',
//                 fontSize: 24,
//               },
//               wrapper: {
//                 flexDirection: 'column',
//                 alignItems: 'flex-end',
//                 justifyContent: 'flex-start',
//                 marginTop: 20,
//                 marginLeft: -20,
//               },
//             },
//           },
//           right: {
//             title: 'MATCH',
//             style: {
//               label: {
//                 backgroundColor: 'green',
//                 color: 'white',
//                 fontSize: 24,
//               },
//               wrapper: {
//                 flexDirection: 'column',
//                 alignItems: 'flex-start',
//                 justifyContent: 'flex-start',
//                 marginTop: 20,
//                 marginLeft: 20,
//               },
//             },
//           },
//         }}
//         animateOverlayLabelsOpacity
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fafafa',
//     justifyContent: 'center',
//     paddingVertical: 40,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noDataText: {
//     fontFamily: 'solway-medium',
//     fontSize: 16,
//     color: Colors.GRAY,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     height: 480,
//     width: width - 40,
//     alignSelf: 'center',
//     alignItems: 'center',
//     elevation: 5,
//   },
//   image: {
//     width: 140,
//     height: 180,
//     borderRadius: 10,
//     marginBottom: 16,
//     backgroundColor: '#ddd',
//   },
//   title: {
//     fontSize: 20,
//     fontFamily: 'solway-bold',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   author: {
//     fontSize: 16,
//     color: Colors.GRAY,
//     fontFamily: 'solway-medium',
//     marginBottom: 6,
//   },
//   detail: {
//     fontSize: 14,
//     fontFamily: 'solway',
//     color: Colors.DARKGRAY,
//   },
//   uploaded: {
//     marginTop: 10,
//     fontStyle: 'italic',
//     color: Colors.GRAY,
//     fontSize: 12,
//   },
// });



// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
// import { useUser } from '@clerk/clerk-expo';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../config/FirebaseConfig';
// import Swiper from 'react-native-deck-swiper';
// import Colors from '../constants/Colors';
// import { findGenreMatches } from '../utils/aiMatcher';

// const { width } = Dimensions.get('window');

// export default function MatchSwipe() {
//   const { user } = useUser();
//   const [swipeCards, setSwipeCards] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadMatches = async () => {
//     try {
//       const snapshot = await getDocs(collection(db, 'Books'));
//       const allBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//       const userBooks = allBooks.filter(book => book.userId === user?.id);
//       const otherBooks = allBooks.filter(book => book.userId !== user?.id);

//       const matches = findGenreMatches(userBooks, otherBooks);

//       // Flatten and remove duplicates
//       const suggestions = matches.flatMap(match => match.suggestions);
//       const uniqueSuggestions = Array.from(new Map(suggestions.map(item => [item.id, item])).values());

//       setSwipeCards(uniqueSuggestions);
//     } catch (e) {
//       console.error('Error loading matches:', e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadMatches();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={Colors.PRIMARY} />
//       </View>
//     );
//   }

//   if (swipeCards.length === 0) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.noDataText}>No matches found!</Text>
//       </View>
//     );
//   }

//   const renderCard = (book) => (
//     <View style={styles.card}>
//       <Image
//         source={{ uri: book.imageUrl || 'https://via.placeholder.com/140x180?text=No+Image' }}
//         style={styles.image}
//       />
//       <Text style={styles.title}>{book.title}</Text>
//       <Text style={styles.author}>by {book.author}</Text>
//       <Text style={styles.detail}>Genre: {book.genre}</Text>
//       <Text style={styles.detail}>Language: {book.language}</Text>
//       <Text style={styles.uploaded}>Uploaded by: {book.user?.name || book.username}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Swiper
//         cards={swipeCards}
//         renderCard={renderCard}
//         stackSize={3}
//         cardIndex={0}
//         backgroundColor="#f0f0f0"
//         onSwipedRight={(cardIndex) => console.log('Liked:', swipeCards[cardIndex].title)}
//         onSwipedLeft={(cardIndex) => console.log('Skipped:', swipeCards[cardIndex].title)}
//         overlayLabels={{
//           left: {
//             title: 'SKIP',
//             style: {
//               label: {
//                 backgroundColor: 'red',
//                 color: 'white',
//                 fontSize: 24,
//               },
//               wrapper: {
//                 flexDirection: 'column',
//                 alignItems: 'flex-end',
//                 justifyContent: 'flex-start',
//                 marginTop: 20,
//                 marginLeft: -20,
//               },
//             },
//           },
//           right: {
//             title: 'MATCH',
//             style: {
//               label: {
//                 backgroundColor: 'green',
//                 color: 'white',
//                 fontSize: 24,
//               },
//               wrapper: {
//                 flexDirection: 'column',
//                 alignItems: 'flex-start',
//                 justifyContent: 'flex-start',
//                 marginTop: 20,
//                 marginLeft: 20,
//               },
//             },
//           },
//         }}
//         animateOverlayLabelsOpacity
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fafafa',
//     justifyContent: 'center',
//     paddingVertical: 40,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noDataText: {
//     fontFamily: 'solway-medium',
//     fontSize: 16,
//     color: Colors.GRAY,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     height: 480,
//     width: width - 40,
//     alignSelf: 'center',
//     alignItems: 'center',
//     elevation: 5,
//   },
//   image: {
//     width: 140,
//     height: 180,
//     borderRadius: 10,
//     marginBottom: 16,
//     backgroundColor: '#ddd',
//   },
//   title: {
//     fontSize: 20,
//     fontFamily: 'solway-bold',
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   author: {
//     fontSize: 16,
//     color: Colors.GRAY,
//     fontFamily: 'solway-medium',
//     marginBottom: 6,
//   },
//   detail: {
//     fontSize: 14,
//     fontFamily: 'solway',
//     color: Colors.DARKGRAY,
//   },
//   uploaded: {
//     marginTop: 10,
//     fontStyle: 'italic',
//     color: Colors.GRAY,
//     fontSize: 12,
//   },
// });




// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import { useUser } from '@clerk/clerk-expo';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../config/FirebaseConfig';
// import Colors from '../constants/Colors';
// import { findGenreMatches } from '../utils/aiMatcher'; // 🧠 AI logic

// export default function Match() {
//   const { user } = useUser();
//   const [matches, setMatches] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchAndMatchBooks = async () => {
//     try {
//       const snapshot = await getDocs(collection(db, 'Books'));
//       const allBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//       const userBooks = allBooks.filter(book => book.userId === user?.id);
//       const otherBooks = allBooks.filter(book => book.userId !== user?.id);

//       const matchedResults = findGenreMatches(userBooks, otherBooks);
//       setMatches(matchedResults);
//     } catch (err) {
//       console.error('Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAndMatchBooks();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={Colors.PRIMARY} />
//       </View>
//     );
//   }

//   if (matches.length === 0) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.noDataText}>No matches found yet.</Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={matches}
//       keyExtractor={(item) => item.userBook.id}
//       contentContainerStyle={styles.list}
//       renderItem={({ item }) => (
//         <View>
//           <Text style={styles.header}>Your Book: {item.userBook.title}</Text>
//           {item.suggestions.map(suggestion => (
//             <View key={suggestion.id} style={styles.card}>
//               <Image
//                 source={{ uri: suggestion.imageUrl || 'https://via.placeholder.com/100x140?text=No+Image' }}
//                 style={styles.cover}
//               />
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.title}>{suggestion.title}</Text>
//                 <Text style={styles.author}>by {suggestion.author}</Text>
//                 <Text style={styles.detail}>Genre: {suggestion.genre}</Text>
//                 <Text style={styles.owner}>Uploaded by: {suggestion.user?.name || suggestion.username}</Text>
//               </View>
//             </View>
//           ))}
//         </View>
//       )}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   noDataText: { fontSize: 16, color: Colors.GRAY, fontFamily: 'solway-medium' },
//   list: { padding: 20, gap: 20 },
//   header: { fontSize: 18, fontFamily: 'solway-bold', marginBottom: 10 },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 10,
//     marginBottom: 10,
//     elevation: 3,
//     gap: 10,
//   },
//   cover: { width: 80, height: 120, borderRadius: 8, backgroundColor: '#ddd' },
//   title: { fontFamily: 'solway-bold', fontSize: 16 },
//   author: { fontFamily: 'solway-medium', color: Colors.GRAY },
//   detail: { fontFamily: 'solway', fontSize: 13, color: Colors.DARKGRAY },
//   owner: { fontStyle: 'italic', fontSize: 12, color: Colors.GRAY },
// });

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import { useUser } from '@clerk/clerk-expo';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../config/FirebaseConfig';
// import Colors from '../constants/Colors';

// export default function Match() {
//   const { user } = useUser();
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchBooks = async () => {
//     try {
//       const snapshot = await getDocs(collection(db, 'Books'));
//       const allBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//       // Filter books that are not uploaded by the current user
//       const filteredBooks = allBooks.filter(
//         book => book.userId && book.userId !== user?.id
//       );

//       setBooks(filteredBooks);
//     } catch (err) {
//       console.error('Error fetching books:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const renderItem = ({ item }) => {
//     const imageUri = item.imageUrl?.startsWith('http')
//       ? item.imageUrl
//       : 'https://via.placeholder.com/100x140?text=No+Image';

//     return (
//       <View style={styles.card}>
//         <Image source={{ uri: imageUri }} style={styles.cover} />
//         <View style={{ flex: 1 }}>
//           <Text style={styles.title}>{item.title}</Text>
//           <Text style={styles.author}>by {item.author}</Text>
//           <Text style={styles.detail}>Genre: {item.genre}</Text>
//           <Text style={styles.detail}>Language: {item.language}</Text>
//           <Text style={styles.detail}>Age: {item.condition}</Text>
//           <Text style={styles.owner}>
//             Uploaded by: {item.user?.name || item.username || 'Unknown'}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={Colors.PRIMARY} />
//       </View>
//     );
//   }

//   if (books.length === 0) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.noDataText}>No books available from other users yet.</Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={books}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.id}
//       contentContainerStyle={styles.list}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noDataText: {
//     fontFamily: 'solway-medium',
//     fontSize: 16,
//     color: Colors.GRAY,
//     textAlign: 'center',
//     paddingHorizontal: 20,
//   },
//   list: {
//     padding: 20,
//     gap: 15,
//   },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 3,
//     padding: 10,
//     gap: 12,
//   },
//   cover: {
//     width: 80,
//     height: 120,
//     borderRadius: 8,
//     backgroundColor: '#ddd',
//   },
//   title: {
//     fontFamily: 'solway-bold',
//     fontSize: 16,
//     marginBottom: 2,
//   },
//   author: {
//     fontFamily: 'solway-medium',
//     color: Colors.GRAY,
//     marginBottom: 4,
//   },
//   detail: {
//     fontFamily: 'solway',
//     fontSize: 13,
//     color: Colors.DARKGRAY,
//   },
//   owner: {
//     marginTop: 4,
//     fontStyle: 'italic',
//     fontSize: 12,
//     color: Colors.GRAY,
//   },
// });


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import { useUser } from '@clerk/clerk-expo';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../config/FirebaseConfig';
// import Colors from '../constants/Colors';

// export default function Match() {
//   const { user } = useUser();
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchBooks = async () => {
//     try {
//       const snapshot = await getDocs(collection(db, 'Books'));
//       const allBooks = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       const currentUserId = user?.id;

//       // Filter books not uploaded by the current user
//       const filteredBooks = allBooks.filter(
//         book => book.userId && book.userId !== currentUserId
//       );

//       setBooks(filteredBooks);
//     } catch (err) {
//       console.error('Error fetching books:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={Colors.PRIMARY} />
//       </View>
//     );
//   }

//   if (books.length === 0) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.noDataText}>
//           No books available from other users yet.
//         </Text>
//       </View>
//     );
//   }

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Image
//         source={{
//           uri:
//             item.imageUrl && item.imageUrl.startsWith('http')
//               ? item.imageUrl
//               : 'https://via.placeholder.com/100x140?text=No+Image',
//         }}
//         style={styles.cover}
//       />
//       <View style={{ flex: 1 }}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.author}>by {item.author}</Text>
//         <Text style={styles.detail}>Genre: {item.genre}</Text>
//         <Text style={styles.detail}>Language: {item.language}</Text>
//         <Text style={styles.detail}>Condition: {item.condition}</Text>
//         <Text style={styles.owner}>
//           Uploaded by: {item.user?.name || item.username || 'Unknown'}
//         </Text>
//       </View>
//     </View>
//   );

//   return (
//     <FlatList
//       data={books}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.id}
//       contentContainerStyle={styles.list}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noDataText: {
//     fontFamily: 'solway-medium',
//     fontSize: 16,
//     color: Colors.GRAY,
//   },
//   list: {
//     padding: 20,
//     gap: 15,
//   },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 3,
//     padding: 10,
//     gap: 12,
//   },
//   cover: {
//     width: 80,
//     height: 120,
//     borderRadius: 8,
//     backgroundColor: '#ddd',
//   },
//   title: {
//     fontFamily: 'solway-bold',
//     fontSize: 16,
//     marginBottom: 2,
//   },
//   author: {
//     fontFamily: 'solway-medium',
//     color: Colors.GRAY,
//     marginBottom: 4,
//   },
//   detail: {
//     fontFamily: 'solway',
//     fontSize: 13,
//     color: Colors.DARKGRAY,
//   },
//   owner: {
//     marginTop: 4,
//     fontStyle: 'italic',
//     fontSize: 12,
//     color: Colors.GRAY,
//   },
// });

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
// } from 'react-native';
// import { useUser } from '@clerk/clerk-expo';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../config/FirebaseConfig';;
// import Colors from '../constants/Colors';

// export default function Match() {
//   const { user } = useUser();
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchBooks = async () => {
//     try {
//       const snapshot = await getDocs(collection(db, 'Books'));
//       const allBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//       const filteredBooks = allBooks.filter(book => book.userId && book.userId !== user?.id);
//       setBooks(filteredBooks);
//     } catch (err) {
//       console.error('Error fetching books:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={Colors.PRIMARY} />
//       </View>
//     );
//   }

//   if (books.length === 0) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.noDataText}>No books available from other users yet.</Text>
//       </View>
//     );
//   }

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <Image
//         source={{
//           uri: item.imageUrl?.startsWith('http')
//             ? item.imageUrl
//             : 'https://via.placeholder.com/100x140?text=No+Image',
//         }}
//         style={styles.cover}
//       />
//       <View style={{ flex: 1 }}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.author}>by {item.author}</Text>
//         <Text style={styles.detail}>Genre: {item.genre}</Text>
//         <Text style={styles.detail}>Language: {item.language}</Text>
//         <Text style={styles.detail}>Condition: {item.condition}</Text>
//         <Text style={styles.owner}>Uploaded by: {item.user?.name}</Text>
//       </View>
//     </View>
//   );

//   return (
//     <FlatList
//       data={books}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.id}
//       contentContainerStyle={styles.list}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noDataText: {
//     fontFamily: 'solway-medium',
//     fontSize: 16,
//     color: Colors.GRAY,
//   },
//   list: {
//     padding: 20,
//     gap: 15,
//   },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     overflow: 'hidden',
//     elevation: 3,
//     padding: 10,
//     gap: 12,
//   },
//   cover: {
//     width: 80,
//     height: 120,
//     borderRadius: 8,
//     backgroundColor: '#ddd',
//   },
//   title: {
//     fontFamily: 'solway-bold',
//     fontSize: 16,
//     marginBottom: 2,
//   },
//   author: {
//     fontFamily: 'solway-medium',
//     color: Colors.GRAY,
//     marginBottom: 4,
//   },
//   detail: {
//     fontFamily: 'solway',
//     fontSize: 13,
//     color: Colors.DARKGRAY,
//   },
//   owner: {
//     marginTop: 4,
//     fontStyle: 'italic',
//     fontSize: 12,
//     color: Colors.GRAY,
//   },
// });


// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../config/FirebaseConfig'; // update if your path is different

// export default function MatchScreen() {
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchBooks = async () => {
//     try {
//       const snapshot = await getDocs(collection(db, 'Books'));
//       const fetchedBooks = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setBooks(fetchedBooks);
//     } catch (error) {
//       console.error('Error fetching books: ', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
//   }

//   if (books.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.noData}>No book data available</Text>
//       </View>
//     );
//   }

//   return (
//     <FlatList
//       data={books}
//       keyExtractor={(item) => item.id}
//       contentContainerStyle={styles.list}
//       renderItem={({ item }) => (
//         <View style={styles.card}>
//           <Image source={{ uri: item.coverUrl }} style={styles.cover} />
//           <View>
//             <Text style={styles.title}>{item.title}</Text>
//             <Text style={styles.author}>by {item.author}</Text>
//           </View>
//         </View>
//       )}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   noData: {
//     fontSize: 16,
//     color: '#888',
//   },
//   list: {
//     padding: 20,
//   },
//   card: {
//     flexDirection: 'row',
//     marginBottom: 15,
//     backgroundColor: '#f4f4f4',
//     borderRadius: 12,
//     padding: 15,
//     alignItems: 'center',
//     gap: 15,
//   },
//   cover: {
//     width: 60,
//     height: 90,
//     borderRadius: 6,
//     backgroundColor: '#ccc',
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#333'
//   },
//   author: {
//     fontSize: 14,
//     color: '#666',
//   },
// });


// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, ActivityIndicator } from 'react-native';
// import { db } from '../utils/firebase';
// import { collection, getDocs } from 'firebase/firestore';
// import Swiper from 'react-native-deck-swiper';
// import BookCard from '../components/Match/BookCard';
// import { calculateMatchScore } from '../utils/aiMatcher';

// export default function MatchBooks() {
//   const [books, setBooks] = useState([]);
//   const [userBook, setUserBook] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchBooks = async () => {
//       const querySnapshot = await getDocs(collection(db, 'books'));
//       const allBooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//       // Select one as userBook for now (mock user preference)
//       const currentUserBook = allBooks[0];
//       setUserBook(currentUserBook);

//       // Filter & sort matches
//       const matches = allBooks
//         .filter(b => b.id !== currentUserBook.id)
//         .map(b => ({ ...b, matchScore: calculateMatchScore(currentUserBook, b) }))
//         .sort((a, b) => b.matchScore - a.matchScore);

//       setBooks(matches);
//       setLoading(false);
//     };
//     fetchBooks();
//   }, []);

//   if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#4169e1" />;

//   return (
//     <View style={styles.container}>
//       <Swiper
//         cards={books}
//         renderCard={(book) => <BookCard book={book} />}
//         stackSize={3}
//         backgroundColor={'#f5f5f5'}
//         cardIndex={0}
//         showSecondCard={true}
//         infinite={false}
//         disableTopSwipe
//         disableBottomSwipe
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingTop: 50, backgroundColor: '#e6eefc' },
// });
