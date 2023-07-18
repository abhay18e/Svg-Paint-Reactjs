import rotateVector from "./rotate-vector";

class Rectangle {
  constructor(shapeType) {
    // Shape properties
    this.type = shapeType;
    this.left = 200;
    this.top = 100;
    this.width = 100;
    this.height = 100;
    this.fillColor = {
      colorA: "#ff0000",
      colorB: "#ffff00",
      isGradient: true,
      gradientAngle: 0,
    };
    this.strokeColor = "#808080";
    this.strokeWidth = 5;
    this.rotation = 0;
  }

  getTranslatedPoints({ x, y }) {
    return [];
  }

  getRotatedPoints(angle) {
    return [];
  }

  getGradientDef(index) {
    // angle can be 0 to 360
    var anglePI = this.fillColor.gradientAngle * (Math.PI / 180);
    var angleCoords = {
      x1: Math.round(50 + Math.sin(anglePI) * 50) + "%",
      y1: Math.round(50 + Math.cos(anglePI) * 50) + "%",
      x2: Math.round(50 + Math.sin(anglePI + Math.PI) * 50) + "%",
      y2: Math.round(50 + Math.cos(anglePI + Math.PI) * 50) + "%",
    };
    if (this.fillColor.isGradient) {
      return (
        <linearGradient
          id={`gradient${index}`}
          key={index}
          x1={angleCoords.x1}
          y1={angleCoords.y1}
          x2={angleCoords.x2}
          y2={angleCoords.y2}
        >
          <stop offset="0%" stopColor={this.fillColor.colorA} />
          <stop offset="100%" stopColor={this.fillColor.colorB} />
        </linearGradient>
      );
    } else {
      return null;
    }
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
    this.fillColor = {
      colorA: "#ff0000",
      colorB: "#ffff00",
      isGradient: false,
      gradientAngle: -1,
    };
    this.strokeColor = "#808080";
    this.strokeWidth = 5;
  }

  getTranslatedPoints({ x, y }) {
    let modifiedPoints = this.points.map((point) => ({
      x: point.x + x,
      y: point.y + y,
    }));
    return modifiedPoints;
  }

  getRotatedPoints(angle) {
    let modifiedPoints = this.points.map((point) => {
      let center = this.info().center;
      let newPoint = rotateVector(center, point, angle);
      return newPoint;
    });
    return modifiedPoints;
  }

  getGradientDef(index) {
    // angle can be 0 to 360
    var anglePI = this.fillColor.gradientAngle * (Math.PI / 180);
    var angleCoords = {
      x1: Math.round(50 + Math.sin(anglePI) * 50) + "%",
      y1: Math.round(50 + Math.cos(anglePI) * 50) + "%",
      x2: Math.round(50 + Math.sin(anglePI + Math.PI) * 50) + "%",
      y2: Math.round(50 + Math.cos(anglePI + Math.PI) * 50) + "%",
    };
    if (this.fillColor.isGradient) {
      return (
        <linearGradient
          id={`gradient${index}`}
          key={index}
          x1={angleCoords.x1}
          y1={angleCoords.y1}
          x2={angleCoords.x2}
          y2={angleCoords.y2}
        >
          <stop offset="0%" stopColor={this.fillColor.colorA} />
          <stop offset="100%" stopColor={this.fillColor.colorB} />
        </linearGradient>
      );
    } else {
      return null;
    }
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
    this.fillColor = {
      colorA: "#ff0000",
      colorB: "#ffff00",
      isGradient: false,
      gradientAngle: -1,
    };
    this.strokeColor = "#808080";
    this.strokeWidth = 5;
    this.tension = 0.5;
    this.closed = true;
  }

  getTranslatedPoints({ x, y }) {
    let modifiedPoints = this.points.map((point) => ({
      x: point.x + x,
      y: point.y + y,
      ctx: point.ctx !== null ? point.ctx + x : null,
      cty: point.cty !== null ? point.cty + y : null,
    }));
    return modifiedPoints;
  }

  getRotatedPoints(angle) {
    let modifiedPoints = this.points.map((point) => {
      let center = this.info().center;
      let newPoint = rotateVector(center, point, angle);
      let newControlPoints = rotateVector(
        center,
        {
          x: point.ctx,
          y: point.cty,
        },
        angle
      );
      return {x:newPoint.x, y:newPoint.y, ctx:newControlPoints.x, cty:newControlPoints.y};
    });
    return modifiedPoints;
  }

  getGradientDef(index) {
    // angle can be 0 to 360
    var anglePI = this.fillColor.gradientAngle * (Math.PI / 180);
    var angleCoords = {
      x1: Math.round(50 + Math.sin(anglePI) * 50) + "%",
      y1: Math.round(50 + Math.cos(anglePI) * 50) + "%",
      x2: Math.round(50 + Math.sin(anglePI + Math.PI) * 50) + "%",
      y2: Math.round(50 + Math.cos(anglePI + Math.PI) * 50) + "%",
    };
    if (this.fillColor.isGradient) {
      return (
        <linearGradient
          id={`gradient${index}`}
          key={index}
          x1={angleCoords.x1}
          y1={angleCoords.y1}
          x2={angleCoords.x2}
          y2={angleCoords.y2}
        >
          <stop offset="0%" stopColor={this.fillColor.colorA} />
          <stop offset="100%" stopColor={this.fillColor.colorB} />
        </linearGradient>
      );
    } else {
      return null;
    }
  }

  info() {
    const margin = 8;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    this.points.forEach((point) => {
      let ctx = point.ctx !== null ? point.ctx : point.x;
      let cty = point.cty !== null ? point.cty : point.y;
      minX = Math.min(minX, point.x, ctx);
      minY = Math.min(minY, point.y, cty);
      maxX = Math.max(maxX, point.x, ctx);
      maxY = Math.max(maxY, point.y, cty);
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
  const { left: x, top: y, width: w, height: h } = shape;
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
