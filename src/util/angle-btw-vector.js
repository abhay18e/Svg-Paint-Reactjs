function getAngleBetweenVectors(a, b) {
    // Calculate the dot product of the vectors
    const dotProduct = a.x * b.x + a.y * b.y;
  
    // Calculate the magnitude (length) of the vectors
    const magnitudeA = Math.sqrt(a.x * a.x + a.y * a.y);
    const magnitudeB = Math.sqrt(b.x * b.x + b.y * b.y);
  
    // Calculate the cosine of the angle
    const cosine = dotProduct / (magnitudeA * magnitudeB);
  
    // Calculate the angle in radians
    const radians = Math.acos(cosine);
  
    // Convert the angle to degrees
    const degrees = radians * (180 / Math.PI);
  
    return degrees;
  }
  
  export default getAngleBetweenVectors;