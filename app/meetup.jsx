// app/meetup.jsx
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ActivityIndicator, Dimensions, Platform 
} from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import Ionicons from '@expo/vector-icons/Ionicons';

import { geocodeAddress } from '../utils/geocode';
import { calculateMidpoint } from '../utils/midpoint';
import { getNearbyVenues } from '../utils/venues';
import { getDirections } from '../utils/directions'; // If you're using directions

export default function MeetupMap() {
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [coord1, setCoord1] = useState(null);
  const [coord2, setCoord2] = useState(null);
  const [midpoint, setMidpoint] = useState(null);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);

  // If you have directions
  const [directions1, setDirections1] = useState(null);
  const [directions2, setDirections2] = useState(null);

  const transformCoordinates = (coords) => {
    return coords.map(coord => ({
      latitude: coord[1],
      longitude: coord[0]
    }));
  };

  const handleFetchMeetup = async () => {
    if (!address1 || !address2) {
      alert("Please enter both addresses.");
      return;
    }
    setLoading(true);
    try {
      // Geocode addresses
      const result1 = await geocodeAddress(address1);
      const result2 = await geocodeAddress(address2);
      setCoord1(result1);
      setCoord2(result2);

      if (result1 && result2) {
        // Calculate midpoint
        const mid = calculateMidpoint(result1, result2);
        setMidpoint(mid);

        // Optionally fetch nearby venues
        const nearby = await getNearbyVenues(mid, 1000);
        setVenues(nearby);

        // If you're using directions
        // const route1 = await getDirections(result1, mid);
        // const route2 = await getDirections(result2, mid);
        // setDirections1(route1);
        // setDirections2(route2);
      } else {
        alert("Could not retrieve coordinates for one or both addresses.");
      }
    } catch (error) {
      console.error("Error fetching meetup suggestions:", error);
      alert("An error occurred while fetching meetup suggestions.");
    }
    setLoading(false);
  };

  const mapRegion = midpoint
    ? {
        latitude: midpoint.lat,
        longitude: midpoint.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 12.9716,  // Default to Bangalore
        longitude: 77.5946,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  return (
    <View style={styles.container}>
      {/* Top Card for Addresses */}
      <View style={styles.formCard}>
        <Text style={styles.title}>Enter Addresses for Meetup</Text>
        
        <View style={styles.inputRow}>
          <Ionicons name="home" size={20} color="#6C5B7B" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Address 1"
            value={address1}
            onChangeText={setAddress1}
          />
        </View>

        <View style={styles.inputRow}>
          <Ionicons name="location" size={20} color="#6C5B7B" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Address 2"
            value={address2}
            onChangeText={setAddress2}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleFetchMeetup}>
          <Text style={styles.buttonText}>Find Meetup Venues</Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 5 }}>Calculating meetup points...</Text>
          </View>
        )}
      </View>

      {/* Map Section */}
      <MapView style={styles.map} region={mapRegion}>
        {/* Marker for Address 1 */}
        {coord1 && (
          <Marker
            coordinate={{ latitude: coord1.lat, longitude: coord1.lng }}
            title="Address 1"
            pinColor="red"
          >
            <Callout>
              <Text>{address1}</Text>
            </Callout>
          </Marker>
        )}
        {/* Marker for Address 2 */}
        {coord2 && (
          <Marker
            coordinate={{ latitude: coord2.lat, longitude: coord2.lng }}
            title="Address 2"
            pinColor="green"
          >
            <Callout>
              <Text>{address2}</Text>
            </Callout>
          </Marker>
        )}
        {/* Midpoint Marker */}
        {midpoint && (
          <Marker
            coordinate={{ latitude: midpoint.lat, longitude: midpoint.lng }}
            title="Midpoint"
            pinColor="blue"
          />
        )}
        {/* Nearby Venues */}
        {venues.map((venue) => (
          <Marker
            key={venue.id}
            coordinate={{ latitude: venue.lat, longitude: venue.lon }}
            title={venue.tags.name || "Unnamed Venue"}
            pinColor="orange"
          />
        ))}
        {/* If using directions polylines
        {directions1 && directions1.geometry && (
          <Polyline
            coordinates={transformCoordinates(directions1.geometry.coordinates)}
            strokeColor="red"
            strokeWidth={3}
          />
        )}
        {directions2 && directions2.geometry && (
          <Polyline
            coordinates={transformCoordinates(directions2.geometry.coordinates)}
            strokeColor="green"
            strokeWidth={3}
          />
        )} */}
      </MapView>
    </View>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7', // Light background
  },
  formCard: {
    backgroundColor: '#fff',
    padding: 15,
    margin: 10,
    marginTop: Platform.OS === 'android' ? 40 : 10, // Add top margin for Android status bar
    borderRadius: 10,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  title: {
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 10, 
    color: '#333'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10, 
    borderRadius: 5
  },
  button: {
    backgroundColor: '#6C5B7B', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 10,
    // iOS shadow
    shadowColor: '#6C5B7B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    // Android elevation
    elevation: 4,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold'
  },
  loadingContainer: {
    marginTop: 10,
    alignItems: 'center'
  },
  map: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
});


// // app/meetup.jsx
// import React, { useState } from 'react';
// import { 
//   View, Text, TextInput, TouchableOpacity, 
//   StyleSheet, ActivityIndicator, Dimensions 
// } from 'react-native';
// import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
// import { geocodeAddress } from '../utils/geocode';
// import { calculateMidpoint } from '../utils/midpoint';
// import { getNearbyVenues } from '../utils/venues';
// import { getDirections } from '../utils/directions';

// export default function MeetupMap() {
//   const [address1, setAddress1] = useState('');
//   const [address2, setAddress2] = useState('');
//   const [midpoint, setMidpoint] = useState(null);
//   const [venues, setVenues] = useState([]);
//   const [directions1, setDirections1] = useState(null);
//   const [directions2, setDirections2] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Helper to transform OSRM geojson coordinates ([lng, lat]) to {latitude, longitude}
//   const transformCoordinates = (coords) => {
//     return coords.map(coord => ({
//       latitude: coord[1],
//       longitude: coord[0]
//     }));
//   };

//   const handleFetchMeetup = async () => {
//     if (!address1 || !address2) {
//       alert("Please enter both addresses.");
//       return;
//     }
//     setLoading(true);
//     try {
//       // Geocode both addresses
//       const coord1 = await geocodeAddress(address1);
//       const coord2 = await geocodeAddress(address2);
//       console.log("Coord1:", coord1, "Coord2:", coord2);
      
//       if (coord1 && coord2) {
//         // Calculate the midpoint
//         const mid = calculateMidpoint(coord1, coord2);
//         console.log("Midpoint:", mid);
//         setMidpoint(mid);
//         // Fetch nearby venues (radius set to 1000m)
//         const nearby = await getNearbyVenues(mid, 1000);
//         console.log("Nearby venues:", nearby);
//         setVenues(nearby);
        
//         // Get directions from each address to the midpoint
//         const route1 = await getDirections(coord1, mid);
//         const route2 = await getDirections(coord2, mid);
//         console.log("Route from Address1:", route1);
//         console.log("Route from Address2:", route2);
//         setDirections1(route1);
//         setDirections2(route2);
//       } else {
//         alert("Could not retrieve coordinates for one or both addresses.");
//       }
//     } catch (error) {
//       console.error("Error fetching meetup suggestions:", error);
//       alert("An error occurred while fetching meetup suggestions.");
//     }
//     setLoading(false);
//   };

//   // Determine the region for the MapView
//   const mapRegion = midpoint
//     ? {
//         latitude: midpoint.lat,
//         longitude: midpoint.lng,
//         latitudeDelta: 0.02,
//         longitudeDelta: 0.02,
//       }
//     : {
//         latitude: 12.9716,  // Default to Bangalore center
//         longitude: 77.5946,
//         latitudeDelta: 0.1,
//         longitudeDelta: 0.1,
//       };

//   return (
//     <View style={styles.container}>
//       <View style={styles.formContainer}>
//         <Text style={styles.title}>Enter Addresses for Meetup</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Address 1"
//           value={address1}
//           onChangeText={setAddress1}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Address 2"
//           value={address2}
//           onChangeText={setAddress2}
//         />
//         <TouchableOpacity style={styles.button} onPress={handleFetchMeetup}>
//           <Text style={styles.buttonText}>Find Meetup Venues</Text>
//         </TouchableOpacity>
//         {loading && (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" />
//             <Text>Calculating meetup points...</Text>
//           </View>
//         )}
//       </View>

//       <MapView style={styles.map} region={mapRegion}>
//         {/* Midpoint Marker */}
//         {midpoint && (
//           <Marker 
//             coordinate={{ latitude: midpoint.lat, longitude: midpoint.lng }}
//             title="Midpoint"
//             description="The calculated midpoint between the two addresses"
//             pinColor="blue"
//           />
//         )}
//         {/* Venue Markers */}
//         {venues.map((venue) => (
//           <Marker
//             key={venue.id}
//             coordinate={{ latitude: venue.lat, longitude: venue.lon }}
//             title={venue.tags.name || "Unnamed Venue"}
//             pinColor="orange"
//           >
//             <Callout>
//               <View style={{ width: 150 }}>
//                 <Text style={{ fontWeight: 'bold' }}>{venue.tags.name || "Unnamed Venue"}</Text>
//                 <Text>{venue.tags.amenity || venue.tags.leisure || "Venue"}</Text>
//               </View>
//             </Callout>
//           </Marker>
//         ))}
//         {/* Polyline for route from Address 1 to Midpoint */}
//         {directions1 && directions1.geometry && (
//           <Polyline
//             coordinates={transformCoordinates(directions1.geometry.coordinates)}
//             strokeColor="red"
//             strokeWidth={3}
//           />
//         )}
//         {/* Polyline for route from Address 2 to Midpoint */}
//         {directions2 && directions2.geometry && (
//           <Polyline
//             coordinates={transformCoordinates(directions2.geometry.coordinates)}
//             strokeColor="green"
//             strokeWidth={3}
//           />
//         )}
//       </MapView>
//     </View>
//   );
// }

// const { height } = Dimensions.get('window');
// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   formContainer: { padding: 20, backgroundColor: '#fff' },
//   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
//   input: { 
//     borderWidth: 1, 
//     borderColor: '#ccc', 
//     padding: 10, 
//     marginBottom: 10, 
//     borderRadius: 5 
//   },
//   button: { 
//     backgroundColor: '#6C5B7B', 
//     padding: 15, 
//     borderRadius: 10, 
//     alignItems: 'center', 
//     marginBottom: 10 
//   },
//   buttonText: { 
//     color: '#fff', 
//     fontSize: 16, 
//     fontWeight: 'bold' 
//   },
//   loadingContainer: { 
//     alignItems: 'center', 
//     marginTop: 10 
//   },
//   map: { 
//     flex: 1, 
//     height: height * 0.6 
//   },
// });



// // app/meetup.jsx
// import React, { useState } from 'react';
// import { 
//   View, Text, TextInput, TouchableOpacity, 
//   StyleSheet, ActivityIndicator, Dimensions 
// } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import { geocodeAddress } from '../utils/geocode';
// import { calculateMidpoint } from '../utils/midpoint';
// import { getNearbyVenues } from '../utils/venues';

// export default function MeetupMap() {
//   // States for addresses, venue markers, and loading indicator.
//   const [address1, setAddress1] = useState('');
//   const [address2, setAddress2] = useState('');
//   const [midpoint, setMidpoint] = useState(null);
//   const [venues, setVenues] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleFetchMeetup = async () => {
//     if (!address1 || !address2) {
//       alert("Please enter both addresses.");
//       return;
//     }
//     setLoading(true);
//     try {
//       // Geocode both addresses
//       const coord1 = await geocodeAddress(address1);
//       const coord2 = await geocodeAddress(address2);
//       console.log("Coord1:", coord1, "Coord2:", coord2);
      
//       if (coord1 && coord2) {
//         // Calculate the midpoint
//         const mid = calculateMidpoint(coord1, coord2);
//         console.log("Midpoint:", mid);
//         setMidpoint(mid);
//         // Fetch nearby venues around the midpoint (e.g., within 1000m)
//         const nearby = await getNearbyVenues(mid, 1000);
//         console.log("Nearby venues:", nearby);
//         setVenues(nearby);
//       } else {
//         alert("Could not retrieve coordinates for one or both addresses.");
//       }
//     } catch (error) {
//       console.error("Error fetching meetup suggestions:", error);
//       alert("An error occurred while fetching meetup suggestions.");
//     }
//     setLoading(false);
//   };

//   // Determine the region for the MapView
//   const mapRegion = midpoint
//     ? {
//         latitude: midpoint.lat,
//         longitude: midpoint.lng,
//         latitudeDelta: 0.02,
//         longitudeDelta: 0.02,
//       }
//     : {
//         latitude: 12.9716,  // Default to Bangalore center if no midpoint (Bangalore coordinates)
//         longitude: 77.5946,
//         latitudeDelta: 0.1,
//         longitudeDelta: 0.1,
//       };

//   return (
//     <View style={styles.container}>
//       <View style={styles.formContainer}>
//         <Text style={styles.title}>Enter Addresses for Meetup</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Address 1"
//           value={address1}
//           onChangeText={setAddress1}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Address 2"
//           value={address2}
//           onChangeText={setAddress2}
//         />
//         <TouchableOpacity style={styles.button} onPress={handleFetchMeetup}>
//           <Text style={styles.buttonText}>Find Meetup Venues</Text>
//         </TouchableOpacity>
//         {loading && (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" />
//             <Text>Calculating meetup points...</Text>
//           </View>
//         )}
//       </View>

//       <MapView style={styles.map} region={mapRegion}>
//         {/* Marker for the midpoint */}
//         {midpoint && (
//           <Marker 
//             coordinate={{
//               latitude: midpoint.lat,
//               longitude: midpoint.lng,
//             }}
//             title="Midpoint"
//             pinColor="blue"
//           />
//         )}
//         {/* Markers for nearby venues */}
//         {venues.map((venue) => (
//           <Marker
//             key={venue.id}
//             coordinate={{
//               latitude: venue.lat,
//               longitude: venue.lon,
//             }}
//             title={venue.tags.name || "Unnamed Venue"}
//             description={venue.tags.amenity || venue.tags.leisure}
//           />
//         ))}
//       </MapView>
//     </View>
//   );
// }

// const { height } = Dimensions.get('window');
// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   formContainer: { padding: 20, backgroundColor: '#fff' },
//   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
//   input: { 
//     borderWidth: 1, 
//     borderColor: '#ccc', 
//     padding: 10, 
//     marginBottom: 10, 
//     borderRadius: 5 
//   },
//   button: { 
//     backgroundColor: '#6C5B7B', 
//     padding: 15, 
//     borderRadius: 10, 
//     alignItems: 'center', 
//     marginBottom: 10 
//   },
//   buttonText: { 
//     color: '#fff', 
//     fontSize: 16, 
//     fontWeight: 'bold' 
//   },
//   loadingContainer: { 
//     alignItems: 'center', 
//     marginTop: 10 
//   },
//   map: { 
//     flex: 1, 
//     height: height * 0.6 
//   },
// });


// // app/meetup.jsx
// import React, { useState } from 'react';
// import { 
//   View, Text, TextInput, TouchableOpacity, 
//   FlatList, StyleSheet, ActivityIndicator 
// } from 'react-native';
// import { geocodeAddress } from '../utils/geocode';
// import { calculateMidpoint } from '../utils/midpoint';
// import { getNearbyVenues } from '../utils/venues';

// export default function MeetupSuggestions() {
//   const [address1, setAddress1] = useState('');
//   const [address2, setAddress2] = useState('');
//   const [venues, setVenues] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleFetchMeetup = async () => {
//     if (!address1 || !address2) {
//       alert("Please enter both addresses.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const coord1 = await geocodeAddress(address1);
//       const coord2 = await geocodeAddress(address2);
//       console.log("Coord1:", coord1, "Coord2:", coord2);
      
//       if (coord1 && coord2) {
//         const mid = calculateMidpoint(coord1, coord2);
//         console.log("Midpoint:", mid);
//         const nearby = await getNearbyVenues(mid, 1000);
//         console.log("Nearby venues:", nearby);
//         setVenues(nearby);
//       } else {
//         alert("Could not retrieve coordinates for one or both addresses.");
//       }
//     } catch (error) {
//       console.error("Error fetching meetup suggestions:", error);
//       alert("An error occurred while fetching meetup suggestions.");
//     }
//     setLoading(false);
//   };

//   const renderHeader = () => (
//     <View style={styles.headerContainer}>
//       <Text style={styles.title}>Enter Addresses for Meetup</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Address 1"
//         value={address1}
//         onChangeText={setAddress1}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Enter Address 2"
//         value={address2}
//         onChangeText={setAddress2}
//       />
//       <TouchableOpacity style={styles.button} onPress={handleFetchMeetup}>
//         <Text style={styles.buttonText}>Find Meetup Venues</Text>
//       </TouchableOpacity>
//       {loading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" />
//           <Text>Calculating meetup points...</Text>
//         </View>
//       )}
//       {!loading && venues.length === 0 && (
//         <Text style={styles.noVenuesText}>
//           No venues found yet. Enter addresses and search to see results.
//         </Text>
//       )}
//       <Text style={styles.subtitle}>Suggested Meetup Venues</Text>
//     </View>
//   );

//   const renderVenue = ({ item }) => (
//     <View style={styles.venueItem}>
//       <Text style={styles.venueName}>
//         {item.tags.name || "Unnamed Venue"}
//       </Text>
//       <Text style={styles.venueType}>
//         {item.tags.amenity || item.tags.leisure}
//       </Text>
//     </View>
//   );

//   return (
//     <FlatList
//       data={venues}
//       keyExtractor={(item) => item.id.toString()}
//       renderItem={renderVenue}
//       ListHeaderComponent={renderHeader}
//       contentContainerStyle={styles.container}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20 },
//   headerContainer: { marginBottom: 20 },
//   title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
//   input: { 
//     borderWidth: 1, 
//     borderColor: '#ccc', 
//     padding: 10, 
//     marginBottom: 10, 
//     borderRadius: 5 
//   },
//   button: { 
//     backgroundColor: '#6C5B7B', 
//     padding: 15, 
//     borderRadius: 10, 
//     alignItems: 'center', 
//     marginBottom: 20 
//   },
//   buttonText: { 
//     color: '#fff', 
//     fontSize: 16, 
//     fontWeight: 'bold' 
//   },
//   loadingContainer: { 
//     alignItems: 'center', 
//     marginTop: 10 
//   },
//   noVenuesText: {
//     textAlign: 'center',
//     marginBottom: 10,
//     color: '#555'
//   },
//   subtitle: { 
//     fontSize: 18, 
//     fontWeight: 'bold', 
//     marginBottom: 10 
//   },
//   venueItem: { 
//     padding: 10, 
//     borderBottomWidth: 1, 
//     borderBottomColor: '#ccc' 
//   },
//   venueName: { 
//     fontSize: 16, 
//     fontWeight: '600' 
//   },
//   venueType: { 
//     fontSize: 14, 
//     color: '#555' 
//   }
// });
