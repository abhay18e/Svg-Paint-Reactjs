function DrawShape({shape,index,setActiveShapeIndex}){

    let cx = shape.x + shape.width/2;
    let cy = shape.y + shape.height/2;
    let rx = shape.width/2;
    let ry = shape.height/2;

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
        fill={shape.fill}
        style={style} 
        onClick={()=>setActiveShapeIndex(index)}
        />
      break;
      case "circle":
        return <circle 
        cx={cx} 
        cy={cy} 
        r={rx} 
        fill={shape.fill}
        style={style} 
        onClick={()=>setActiveShapeIndex(index)}
        />
        break;
      case "ellipse":       
        return <ellipse 
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={shape.fill}
        style={style}
        onClick={()=>setActiveShapeIndex(index)}
        />
        break;
      default:
        return null
        break;  
    }
  }

  export default DrawShape;