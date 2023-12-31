function rotateVector(center, vector, angle) {
  // Convert angle from degrees to radians
  angle = angle * (Math.PI / 180);

  // Translate vector to the origin
  var translatedVector = {
    x: vector.x - center.x,
    y: vector.y - center.y,
  };

  // Perform the rotation
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  var rotatedVector = {
    x: translatedVector.x * cos - translatedVector.y * sin,
    y: translatedVector.x * sin + translatedVector.y * cos,
  };

  // Translate the vector back to its original position
  var finalVector = {
    x: rotatedVector.x + center.x,
    y: rotatedVector.y + center.y,
  };

  return finalVector;
}

export default rotateVector;
