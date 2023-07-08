import rotateVector from "../util/rotate-vector"

function DrawHandles({shape,setIsDragging,setActiveHandle,setActiveLineHandleIndex}){
    let bottomRightHandle = true
    let widthHandle = true
    let heightHandle = true
    let middleHandle = true
    let rotateHandle = true
  
    if(shape.type === "circle"){
      bottomRightHandle = false
      rotateHandle = false
    }
    let cx = shape.x + shape.width/2;
    let cy = shape.y + shape.height/2;
    let style =  {
      fill:"grey",
      stroke:"black",
      strokeWidth:3
        // transformBox: "fill-box",
        // transform: `rotate(${shape.rotation}deg)`,
        // transforOrigin: "center",//`${cx}px ${cy}px`,
    }
    
  
    const radius = 8
    let handles = {
      rotate:{
        x:shape.x+shape.width/2,
        y:shape.y-20
      },
      middle:{
        x:shape.x+shape.width/2,
        y:shape.y+shape.height/2,
      },
      bottomRight:{
        x:shape.x+shape.width,
        y:shape.y+shape.height,
      },
      height: {
        x:shape.x+shape.width/2,
        y:shape.y+shape.height,
      },
      width:{
        x:shape.x+shape.width,
        y:shape.y+shape.height/2,
      }
    }
  
    function handleDown(e,lineHandleIndex){
      setIsDragging(true)
      setActiveHandle(e.target.classList[0])
      setActiveLineHandleIndex(lineHandleIndex)
    }

    
    
    if(shape.type === "line" || shape.type === "polygon"){
      return <>
      {
        shape.points.map((point,i)=>{
          return <circle
          cx={point.x}
          cy={point.y}
          r={radius}
          class={`line-handle`}
          onMouseDown={(e)=>handleDown(e,i)}
          onTouchStart={(e)=>handleDown(e,i)}
          />
        })
      }
      </>
    }
    
  
    return(
      <>
      {
        rotateHandle && <circle 
        cx={rotateVector(cx,cy,handles.rotate,shape.rotation).x}
        cy={rotateVector(cx,cy,handles.rotate,shape.rotation).y}
        r={radius}
        style={style}
        class='rotate-handle'
        onMouseDown={handleDown}
        onTouchStart={handleDown}
        />
      }
      {
        middleHandle && <circle
        cx={rotateVector(cx,cy,handles.middle,shape.rotation).x}
        cy={rotateVector(cx,cy,handles.middle,shape.rotation).y}
        r={radius}
        style={style}
        class='middle-handle'
        onMouseDown={handleDown}
        onTouchStart={handleDown}
         />
      } 
      {
      bottomRightHandle && <circle 
      cx={rotateVector(cx,cy,handles.bottomRight,shape.rotation).x}
      cy={rotateVector(cx,cy,handles.bottomRight,shape.rotation).y}
      r={radius}
      style={style}
      class='bottom-right-handle'
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      />
     }
     { 
      widthHandle && <circle 
      cx={rotateVector(cx,cy,handles.width,shape.rotation).x}
      cy={rotateVector(cx,cy,handles.width,shape.rotation).y} 
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      r={radius}
      style={style}
      class='width-handle'
      />
     }
     { 
      heightHandle && <circle 
      cx={rotateVector(cx,cy,handles.height,shape.rotation).x} 
      cy={rotateVector(cx,cy,handles.height,shape.rotation).y} 
      r={radius}
      style={style}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      class="height-handle"
      /> 
     }
      </>
    )
  }
  
  
export default DrawHandles;