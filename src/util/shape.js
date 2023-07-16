class Rectangle {
  constructor(shapeType) {
    // Shape properties
    this.type = shapeType;
    this.left = 200;
    this.top = 100;
    this.width = 100;
    this.height = 100;
    this.fillColor = "#ff0000";
    this.strokeColor = "#808080";
    this.strokeWidth = 5;
    this.rotation = 0;
  }

  info() {
    const margin = 8;
    const centerX = this.left + this.width / 2;
    const centerY = this.top + this.height / 2;
    const handleX = { x: this.left + this.width + margin, y: centerY };
    const handleY = { x: centerX, y: this.top + this.height + margin };
    const handleXY = {
      x: this.left + this.width + margin,
      y: this.top + this.height + margin,
    };
    const handleTranslate = { x: centerX, y: centerY };
    const handleRotate = { x: centerX, y: this.top - margin };

    return {
      getBoundingRect: {
        top: this.top - margin,
        left: this.left - margin,
        width: this.width + margin * 2,
        height: this.height + margin * 2,
      },
      center: { x: centerX, y: centerY },
      handleX,
      handleY,
      handleXY,
      handleTranslate,
      handleRotate,
    };
  }
}

class Polygon {
  constructor() {
    // Shape properties
    this.type = "polygon";
    this.points = [];
    this.fillColor = "#ff0000";
    this.strokeColor = "#808080";
    this.strokeWidth = 5;
  }

  info() {
    const margin = 8;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    this.points.forEach((point) => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const handleX = { x: maxX + margin, y: centerY };
    const handleY = { x: centerX, y: maxY + margin };
    const handleXY = { x: maxX + margin, y: maxY + margin };
    const handleTranslate = { x: centerX, y: centerY };
    const handleRotate = { x: centerX, y: minY - margin };

    return {
      getBoundingRect: {
        top: minY - margin,
        left: minX - margin,
        width: maxX - minX + margin * 2,
        height: maxY - minY + margin * 2,
      },
      center: { x: centerX, y: centerY },
      handleX,
      handleY,
      handleXY,
      handleTranslate,
      handleRotate,
    };
  }
}

class Curve {
  constructor() {
    // Shape properties
    this.type = "curve";
    this.points = [];
    this.strokeColor = "#808080";
    this.strokeWidth = 5;
    this.tension = 0.5;
    this.closed = true;
  }

  info() {
    const margin = 8;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    this.points.forEach((point) => {
      minX = Math.min(minX, point.x, point.ctx);
      minY = Math.min(minY, point.y, point.cty);
      maxX = Math.max(maxX, point.x, point.ctx);
      maxY = Math.max(maxY, point.y, point.cty);
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const handleX = { x: maxX + margin, y: centerY };
    const handleY = { x: centerX, y: maxY + margin };
    const handleXY = { x: maxX + margin, y: maxY + margin };
    const handleTranslate = { x: centerX, y: centerY };
    const handleRotate = { x: centerX, y: minY - margin };

    return {
      getBoundingRect: {
        top: minY - margin,
        left: minX - margin,
        width: maxX - minX + margin * 2,
        height: maxY - minY + margin * 2,
      },
      center: { x: centerX, y: centerY },
      handleX,
      handleY,
      handleXY,
      handleTranslate,
      handleRotate,
    };
  }
}

function getArrowPoint(shape) {
  const { x, y, width: w, height: h } = shape;
  const A1 = 0.35;
  const A2 = 0.65;
  const B1 = 0.65;
  const C1 = 0.5;

  let x1 = x,
    y1 = y + h * A1;
  let x2 = x + w * B1,
    y2 = y + h * A1;
  let x3 = x + w * B1,
    y3 = y;
  let x4 = x + w,
    y4 = y + h * C1;
  let x5 = x + w * B1,
    y5 = y + h;
  let x6 = x + w * B1,
    y6 = y + h * A2;
  let x7 = x,
    y7 = y + h * A2;
  return `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4} ${x5},${y5} ${x6},${y6} ${x7},${y7}`;
}

export { Rectangle, Polygon, Curve, getArrowPoint };
