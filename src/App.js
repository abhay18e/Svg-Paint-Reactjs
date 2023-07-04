import './App.css';
import { useState ,useEffect, useRef } from "react";
import DrawHandles from './component/draw-handles';
import DrawShape from './component/draw-shape';
import SidePanel from './component/side-panel';

function App(){
  let [shapeList,setShapeList] = useState([])
  let [isDragging,setIsDragging] = useState(false)
  let [activShapeIndex,setActiveShapeIndex] = useState(null)
  let [activeHandle,setActiveHandle] = useState("")
  let svgEl = useRef(null)

  function handlePointerUp(e){
    setIsDragging(false)
    setActiveHandle("")
  }

  function handlePointerMove(e){
    let newShape = {...shapeList[activShapeIndex]}
    let rect = svgEl.current.getBoundingClientRect()
    let pointerX = e.clientX-rect.left
    let pointerY = e.clientY-rect.top
    if(isDragging){

      switch(activeHandle){
        case "bottom-right-handle":
          newShape.width  = Math.max( pointerX-newShape.x , 10) 
          newShape.height = Math.max( pointerY-newShape.y , 10)
          break;
        case "width-handle":
          newShape.width  = Math.max( pointerX-newShape.x , 10)
          break;
        case "height-handle":
          newShape.height = Math.max( pointerY-newShape.y , 10)
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
      fill:"red",
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
      <SidePanel addShape={addShape} />
      <svg height={500} ref={svgEl} id="svg-container" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
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