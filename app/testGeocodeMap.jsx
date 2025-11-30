// app/testGeocodeMap.jsx
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ActivityIndicator, Dimensions 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { geocodeAddress } from '../utils/geocode';
import { calculateMidpoint } from '../utils/midpoint';

export default function TestGeocodeMap() {
  // States for the addresses and coordinates
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [coord1, setCoord1] = useState(null);
  const [coord2, setCoord2] = useState(null);
  const [midpoint, setMidpoint] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleShowOnMap = async () => {
    if (!address1 || !address2) {
      alert("Please enter both addresses.");
      return;
    }
    setLoading(true);
    try {
      // Geocode both addresses
      const result1 = await geocodeAddress(address1);
      const result2 = await geocodeAddress(address2);
      setCoord1(result1);
      setCoord2(result2);

      if (result1 && result2) {
        // Calculate the midpoint using the improved spherical formula if needed
        const mid = calculateMidpoint(result1, result2);
        setMidpoint(mid);
      } else {
        alert("Could not retrieve coordinates for one or both addresses.");
      }
    } catch (error) {
      console.error("Error in geocoding:", error);
      alert("An error occurred while geocoding addresses.");
    }
    setLoading(false);
  };

  // Define a default region. We'll center on the midpoint if available,
  // otherwise default to Bangalore.
  const mapRegion = midpoint
    ? {
        latitude: midpoint.lat,
        longitude: midpoint.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 12.9716,
        longitude: 77.5946,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Enter Addresses</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Address 1"
          value={address1}
          onChangeText={setAddress1}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Address 2"
          value={address2}
          onChangeText={setAddress2}
        />
        <TouchableOpacity style={styles.button} onPress={handleShowOnMap}>
          <Text style={styles.buttonText}>Show on Map</Text>
        </TouchableOpacity>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text>Geocoding addresses...</Text>
          </View>
        )}
      </View>
      <MapView style={styles.map} region={mapRegion}>
        {/* Marker for Address 1 */}
        {coord1 && (
          <Marker 
            coordinate={{ latitude: coord1.lat, longitude: coord1.lng }}
            title="Address 1"
            description={address1}
            pinColor="red"  // red marker for Address 1
          />
        )}
        {/* Marker for Address 2 */}
        {coord2 && (
          <Marker 
            coordinate={{ latitude: coord2.lat, longitude: coord2.lng }}
            title="Address 2"
            description={address2}
            pinColor="green"  // green marker for Address 2
          />
        )}
        {/* Marker for the midpoint */}
        {midpoint && (
          <Marker 
            coordinate={{ latitude: midpoint.lat, longitude: midpoint.lng }}
            title="Midpoint"
            description="Calculated midpoint"
            pinColor="blue"  // blue marker for midpoint
          />
        )}
      </MapView>
    </View>
  );
}

const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 5 
  },
  button: { 
    backgroundColor: '#6C5B7B', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginBottom: 10 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  loadingContainer: { alignItems: 'center', marginTop: 10 },
  map: { flex: 1, height: height * 0.6 },
});
