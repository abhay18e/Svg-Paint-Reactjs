import './App.css';
import { useState ,useEffect, useRef } from "react";
import DrawHandles from './component/draw-handles';
import DrawShape from './component/draw-shape';
import SidePanel from './component/side-panel';
import rotatedVector from './util/rotate-vector';

function App(){
  let [shapeList,setShapeList] = useState([])
  let [isDragging,setIsDragging] = useState(false)
  let [activShapeIndex,setActiveShapeIndex] = useState(null)
  let [activeHandle,setActiveHandle] = useState("")
  let [backgroundColor,setBackgroundColor] = useState("#00ffff")
  let svgEl = useRef(null)

  function handlePointerUp(e){
    setIsDragging(false)
    setActiveHandle("")
  }

  function handlePointerMove(e){
    const MIN_WIDTH_HEIGHT = 10
    let newShape = {...shapeList[activShapeIndex]}
    let rect = svgEl.current.getBoundingClientRect()
    let pointer;
    if (e.touches) {
      // If it's a touch event
      e.preventDefault()
      pointer = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      // If it's a mouse event
      pointer = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  
    let cx = newShape.x + newShape.width/2;
    let cy = newShape.y + newShape.height/2;
    
    let {x:pointerX,y:pointerY} = rotatedVector(cx,cy,pointer,-1*newShape.rotation)

    if(isDragging){

      switch(activeHandle){
        case "bottom-right-handle":
          newShape.width  = Math.max( pointerX-newShape.x , MIN_WIDTH_HEIGHT) 
          newShape.height = Math.max( pointerY-newShape.y , MIN_WIDTH_HEIGHT)
          break;
        case "width-handle":
          newShape.width  = Math.max( pointerX-newShape.x , MIN_WIDTH_HEIGHT)
          break;
        case "height-handle":
          newShape.height = Math.max( pointerY-newShape.y , MIN_WIDTH_HEIGHT)
          break;
        case "middle-handle":
          newShape.x = pointerX-newShape.width/2
          newShape.y = pointerY-newShape.height/2
        break;
        case "rotate-handle":
          let radians = Math.atan2(pointerY-newShape.y,pointerX-newShape.x)
          newShape.rotation  = radians*180/Math.PI
        default:
          break;
      }
      updateShapeList(newShape)

    }
   
  }

  function addShape(shapeType){

    setShapeList([...shapeList,{
      type:shapeType,
      x:100,
      y:100,
      width:100,
      height:100,
      fillColor:"#ff0000",
      strokeColor:"#808080",
      strokeWidth:2,
      rotation:0
    }])
    setActiveShapeIndex(shapeList.length)

  }

  function updateShapeList(shape){
    let newShapeList = [...shapeList]
    newShapeList[activShapeIndex] = shape
    setShapeList(newShapeList)
  }

  function handleCLick(e){
    console.log(e.target)
    
    if(e.target.id === "outer-container" || e.target.id === "svg-container"){
      setActiveShapeIndex(null)
    }
  }



  return (
     <div id="outer-container" onClick={handleCLick}>
      <h1 id="heading">Svg Paint</h1>
      <SidePanel 
      addShape={addShape} 
      shape={shapeList[activShapeIndex]}
      updateShapeList={updateShapeList} 
      setBackgroundColor={setBackgroundColor}
      backgroundColor={backgroundColor}
      />
      <svg 
      height={500} 
      ref={svgEl} 
      id="svg-container"
      style={{backgroundColor:backgroundColor}} 
      onMouseMove={handlePointerMove} 
      onTouchMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onTouchEnd={handlePointerUp}
      >
       {
       shapeList.map((shape,index)=>
          <DrawShape 
          shape={shape} 
          index={index} 
          setActiveShapeIndex={setActiveShapeIndex}
          />)
       }

       {
       activShapeIndex !== null &&
        <DrawHandles 
        shape={shapeList[activShapeIndex]} 
        setIsDragging={setIsDragging}
        setActiveHandle={setActiveHandle}
        />
       }
      </svg>
     </div>
  )
}






export default App;