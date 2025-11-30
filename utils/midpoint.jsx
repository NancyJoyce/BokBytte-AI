// utils/midpoint.js
export const calculateMidpoint = (coord1, coord2) => {
    // Convert degrees to radians
    const lat1 = (coord1.lat * Math.PI) / 180;
    const lon1 = (coord1.lng * Math.PI) / 180;
    const lat2 = (coord2.lat * Math.PI) / 180;
    const lon2 = (coord2.lng * Math.PI) / 180;
  
    // Compute spherical midpoint
    const bx = Math.cos(lat2) * Math.cos(lon2 - lon1);
    const by = Math.cos(lat2) * Math.sin(lon2 - lon1);
    const midLat = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bx) ** 2 + by ** 2));
    const midLon = lon1 + Math.atan2(by, Math.cos(lat1) + Math.cos(lat2));
  
    // Convert radians back to degrees
    return { lat: midLat * 180 / Math.PI, lng: midLon * 180 / Math.PI };
  };
  