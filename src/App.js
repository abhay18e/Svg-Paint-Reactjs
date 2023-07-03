import './App.css';
import { useState ,useEffect, useRef } from "react";
function App(){
  let [shapeList,setShapeList] = useState([])
  let [isDragging,setIsDragging] = useState(false)

  function handleUp(e){
    setIsDragging(false)
  }

  function handleMove(e){
    console.log("hi")
    let newShape = {...shapeList[0]}
    if(isDragging){
      newShape.width = e.clientX-newShape.x

      switch(e.target.id){
        case "topLeft":
          newShape.x = e.clientX
          newShape.y = e.clientY
          break;
        case "bottomRight":
          newShape.width = e.clientX-newShape.x
          newShape.height = e.clientY-newShape.y
          break;
        case "width":
          newShape.width = e.clientX-newShape.x
          break;
        case "height":
          newShape.height = e.clientY-newShape.y
          break;
        default:
          break;
      }
      updateShapeList(newShape,0)

    }
   
  }

  function addShape(shapeType){

    switch(shapeType){
      case "rectangle":
        setShapeList([...shapeList,{
          type:shapeType,
          x:0,
          y:0,
          width:100,
          height:100,
          fill:"red",
          isActive:true,
        }])
        break;
      default:
        break;
    }

  }

  function updateShapeList(shape,index){
    console.log(shape,index)
    let newShapeList = [...shapeList]
    newShapeList[index] = shape
    setShapeList(newShapeList)
  }



  return (
     <div id="outer-container">
      <h1 id="heading">Svg Paint</h1>
      <SidePanel addShape={addShape} />
      <svg id="svg-container" onPointerMove={handleMove} onPointerUp={handleUp}>
       {shapeList.map((shape,index)=>{
        return[
          <DrawShape shape={shape} />,
          <DrawHandles 
          shape={shape} 
          topLeftHandle={false} 
          bottomRightHandle={false} 
          widthHandle={true} 
          height={false}
          setIsDragging={setIsDragging} 
          />,
        ]
       })}
      </svg>
     </div>
  )
}

function DrawShape({shape}){

  switch(shape.type){
    case "rectangle":
      return <rect 
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      fill={shape.fill} 
      />
    
    break;
    default:
      return null
      break;  
  }
}


function DrawHandles({shape,topLeftHandle,bottomRightHandle,widthHandle,heightHandle,setIsDragging}){

  const radius = 5
  let handles = {
    topLeft:{
      x:shape.x,
      y:shape.y,
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
  }

  

  return(
    <>
   { topLeftHandle && <circle 
    cx={handles.topLeft.x}
    cy={handles.topLeft.y}
    r={radius} />
   }
    {bottomRightHandle && <circle 
    cx={handles.bottomRight.x}
    cy={handles.bottomRight.y}
    r={radius} />
   }
   { widthHandle && <circle 
    cx={handles.width.x}
    cy={handles.width.y} 
    onPointerDown={handleDown}
    r={radius} />
   }
   { heightHandle && <circle 
    cx={handles.height.x} 
    cy={handles.height.y} 
    r={radius} /> 
   }
    </>
  )
}


function SidePanel({addShape}){
 


  return (
    <div id="side-panel">
     <button 
     onClick={()=>addShape("rectangle")}
     >
      Rectangle
      </button>
    </div>
  )
}

export default App;