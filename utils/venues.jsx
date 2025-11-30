// utils/venues.js
export const getNearbyVenues = async (midpoint, radius = 500) => {
    // Radius in meters; query for cafés, libraries, and parks
    const query = `
      [out:json];
      (
        node["amenity"="cafe"](around:${radius},${midpoint.lat},${midpoint.lng});
        node["amenity"="library"](around:${radius},${midpoint.lat},${midpoint.lng});
        node["leisure"="park"](around:${radius},${midpoint.lat},${midpoint.lng});
      );
      out body;
    `;
    
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.elements; // Returns an array of venues
    } catch (error) {
      console.error("Error fetching venues:", error);
      return [];
    }
  };
  