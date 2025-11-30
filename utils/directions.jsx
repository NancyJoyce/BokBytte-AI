// utils/directions.js
export const getDirections = async (start, end) => {
    // OSRM expects coordinates in the order: longitude,latitude
    const url = `http://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json && json.routes && json.routes.length > 0) {
        return json.routes[0]; // This includes the route geometry, distance, duration, etc.
      } else {
        throw new Error("No route found");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
      return null;
    }
  };
  