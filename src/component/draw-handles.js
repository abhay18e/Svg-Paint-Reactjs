
function DrawHandles({shape,setIsDragging,setActiveHandle}){
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
        transform: `rotate(${shape.rotation}deg)`,
        //tranfrom origin should be cx cy
        transforOrigin: `${cx}px ${cy}px`
    }
    
  
    const radius = 5
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
  
    function handleDown(e){
      setIsDragging(true)
      setActiveHandle(e.target.id)
    }
  
    
  
    return(
      <>
      {
        rotateHandle && <circle 
        cx={handles.rotate.x}
        cy={handles.rotate.y}
        r={radius}
        style={style}
        id='rotate-handle'
        onPointerDown={handleDown}
        />
      }
      {
        middleHandle && <circle
        cx={handles.middle.x}
        cy={handles.middle.y}
        r={radius}
        style={style}
        id='middle-handle'
        onPointerDown={handleDown}
         />
      } 
      {
      bottomRightHandle && <circle 
      cx={handles.bottomRight.x}
      cy={handles.bottomRight.y}
      r={radius}
      style={style}
      id='bottom-right-handle'
      onPointerDown={handleDown}
      />
     }
     { 
      widthHandle && <circle 
      cx={handles.width.x}
      cy={handles.width.y} 
      onPointerDown={handleDown}
      r={radius}
      style={style}
      id='width-handle'
      />
     }
     { 
      heightHandle && <circle 
      cx={handles.height.x} 
      cy={handles.height.y} 
      r={radius}
      style={style}
      onPointerDown={handleDown}
      id="height-handle"
      /> 
     }
      </>
    )
  }

  
export default DrawHandles;