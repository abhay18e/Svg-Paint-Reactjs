import shapeInfo from "../util/shape-info";

function DrawShape({shape,index,setActiveShapeIndex}){
    
    let cx = shape.x + shape.width/2 ||0;
    let cy = shape.y + shape.height/2 ||0;
    let rx = shape.width/2 ||0;
    let ry = shape.height/2 ||0;

    let style = {
        transform:`rotate(${shape.rotation}deg)`,
        transformBox:"fill-box",
        transformOrigin:"center"
    }
    switch(shape.type){
      case "rectangle":
        return <rect 
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        fill={shape.fillColor}
        style={style}
        stroke={shape.strokeColor}
        strokeWidth={shape.strokeWidth} 
        onClick={()=>setActiveShapeIndex(index)}
        />
      break;
      case "circle":
        return <circle 
        cx={cx} 
        cy={cy} 
        r={rx} 
        fill={shape.fillColor}
        style={style}
        stroke={shape.strokeColor}
        strokeWidth={shape.strokeWidth} 
        onClick={()=>setActiveShapeIndex(index)}
        />
        break;
      case "ellipse":       
        return <ellipse 
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={shape.fillColor}
        style={style}
        stroke={shape.strokeColor}
        strokeWidth={shape.strokeWidth}
        onClick={()=>setActiveShapeIndex(index)}
        />
        break;
      case "arrow":
        let arrowPoints = shapeInfo.customShape.arrow.getPoints(shape)
        return  <polygon
            points={arrowPoints}
            fill={shape.fillColor}
            style={style}
            stroke={shape.strokeColor}
            strokeWidth={shape.strokeWidth}
            onClick={() => setActiveShapeIndex(index)}
          />
          break;
        case "line":
          return <line
            x1={shape.points[0].x}
            y1={shape.points[0].y}
            x2={shape.points[1].x}
            y2={shape.points[1].y}
            stroke={shape.strokeColor}
            strokeWidth={shape.strokeWidth}
            onClick={() => setActiveShapeIndex(index)}
            />
          break;
        case "polygon":
          let points = shape.points.map(pt=>`${pt.x} ${pt.y}`)
          return <polygon
            points={points}
            fill={shape.fillColor}
            stroke={shape.strokeColor}
            strokeWidth={shape.strokeWidth}
            onClick={() => setActiveShapeIndex(index)}
            />
      default:
        return null
        break;  
    }
  }

  export default DrawShape;


