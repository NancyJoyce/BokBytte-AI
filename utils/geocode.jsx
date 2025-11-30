// utils/geocode.js
export const geocodeAddress = async (address, delay = 1100) => {
  // Wait for the specified delay (default 1.1 seconds) to respect the API rate limit
  await new Promise(resolve => setTimeout(resolve, delay));

  const encodedAddress = encodeURIComponent(address);
  // The geocode.xyz API endpoint with JSON response
  const url = `https://geocode.xyz/${encodedAddress}?json=1`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Bokbytte/1.0 (your-email@example.com)",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HTTP error:", response.status, errorText);
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    // geocode.xyz returns an "error" property when something goes wrong
    if (data.error) {
      console.error("Geocoding error:", data.error);
      throw new Error(data.error.description || "Error in geocoding");
    }

    // The API returns latitude in "latt" and longitude in "longt"
    if (data.latt && data.longt) {
      return {
        lat: parseFloat(data.latt),
        lng: parseFloat(data.longt)
      };
    } else {
      throw new Error("No geocoding results");
    }
  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
};


// // utils/geocode.js
// export const geocodeAddress = async (address) => {
//     const encodedAddress = encodeURIComponent(address);
//     const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;
    
//     try {
//       const response = await fetch(url, {
//         headers: {
//           "User-Agent": "Bokbytte/1.0 (your-email@example.com)",
//           "Accept": "application/json"
//         }
//       });
//       const data = await response.json();
//       if (data && data.length > 0) {
//         return { 
//           lat: parseFloat(data[0].lat), 
//           lng: parseFloat(data[0].lon) 
//         };
//       } else {
//         throw new Error("No geocoding results");
//       }
//     } catch (error) {
//       console.error("Error geocoding address:", error);
//       return null;
//     }
//   };
  