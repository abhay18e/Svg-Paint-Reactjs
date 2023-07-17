import { getArrowPoint } from "../util/shape";

function DrawShape({ shape, index, setActive }) {
  let style = {
    transform: `rotate(${shape.rotation}deg)`,
    transformBox: "fill-box",
    transformOrigin: "center",
  };

  function passActiveShapeIndex(index) {
    setActive((active) => {
      return { ...active, shapeIndex: index };
    });
  }

  switch (shape.type) {
    case "rectangle":
      return (
        <rect
          x={shape.left}
          y={shape.top}
          width={shape.width}
          height={shape.height}
          fill={
            shape.fillColor.isGradient
              ? `url(#gradient${index})`
              : shape.fillColor.colorA
          }
          style={style}
          stroke={shape.strokeColor}
          strokeWidth={shape.strokeWidth}
          onClick={() => passActiveShapeIndex(index)}
        />
      );

    case "circle":
      return (
        <circle
          cx={shape.info().center.x}
          cy={shape.info().center.y}
          r={shape.width / 2}
          fill={
            shape.fillColor.isGradient
              ? `url(#gradient${index})`
              : shape.fillColor.colorA
          }
          style={style}
          stroke={shape.strokeColor}
          strokeWidth={shape.strokeWidth}
          onClick={() => passActiveShapeIndex(index)}
        />
      );

    case "ellipse":
      return (
        <ellipse
          cx={shape.info().center.x}
          cy={shape.info().center.y}
          rx={shape.width / 2}
          ry={shape.height / 2}
          fill={
            shape.fillColor.isGradient
              ? `url(#gradient${index})`
              : shape.fillColor.colorA
          }
          style={style}
          stroke={shape.strokeColor}
          strokeWidth={shape.strokeWidth}
          onClick={() => passActiveShapeIndex(index)}
        />
      );

    case "arrow":
      let arrowPoints = getArrowPoint(shape);
      return (
        <polygon
          points={arrowPoints}
          fill={
            shape.fillColor.isGradient
              ? `url(#gradient${index})`
              : shape.fillColor.colorA
          }
          style={style}
          stroke={shape.strokeColor}
          strokeWidth={shape.strokeWidth}
          onClick={() => passActiveShapeIndex(index)}
        />
      );

    case "polygon":
      if (shape.points.length === 2) {
        return (
          <line
            x1={shape.points[0].x}
            y1={shape.points[0].y}
            x2={shape.points[1].x}
            y2={shape.points[1].y}
            stroke={shape.strokeColor}
            strokeWidth={shape.strokeWidth}
            onClick={() => passActiveShapeIndex(index)}
          />
        );
      }
      let points = shape.points.map((pt) => `${pt.x} ${pt.y}`);
      return (
        <polygon
          points={points}
          fill={
            shape.fillColor.isGradient
              ? `url(#gradient${index})`
              : shape.fillColor.colorA
          }
          stroke={shape.strokeColor}
          strokeWidth={shape.strokeWidth}
          onClick={() => passActiveShapeIndex(index)}
        />
      );

    case "curve":
      const curveCommands = shape.points.map((pt, index, points) => {
        const { x, y, ctx, cty } = pt;
        if (index === 0) {
          // Starting point of the first curve
          return `M ${x} ${y}`;
        } else {
          const prevPt = points[index - 1];
          // Quadratic Bezier curve command
          return `C ${prevPt.ctx} ${prevPt.cty}, ${ctx} ${cty}, ${x} ${y}`;
        }
      });

      // Join the path commands into a single string
      const pathData = curveCommands.join(" ");
      // Render the Bezier curves
      return (
        <path
          d={pathData}
          fill={"transparent"}
          stroke={shape.strokeColor}
          strokeWidth={shape.strokeWidth}
          onClick={() => passActiveShapeIndex(index)}
        />
      );
    default:
      return null;
  }
}

export default DrawShape;
