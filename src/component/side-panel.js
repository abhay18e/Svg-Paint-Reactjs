function SidePanel({addShape,shape,updateShapeList,backgroundColor,setBackgroundColor}){
  
   const handleColor = (fillColor)=>{
    let newShape = {...shape}
    newShape.fillColor = fillColor
    updateShapeList(newShape)
   }
   const handleStrokeColor = (strokeColor)=>{
    let newShape = {...shape}
    newShape.strokeColor = strokeColor
    updateShapeList(newShape)
   }
   const handleStrokeWidth = (strokeWidth)=>{
    let newShape = {...shape}
    newShape.strokeWidth = strokeWidth
    updateShapeList(newShape)
   }
   const handleRotation = (rotation)=>{
    let newShape = {...shape}
    newShape.rotation = rotation
    updateShapeList(newShape)
   }

    return (
      <div id="side-panel">
        <div id="shapes">
        <button 
        onClick={()=>addShape("rectangle")}
        >
          Rectangle
        </button>
        <button
        onClick={()=>addShape("circle")}
        >
          Circle
        </button>
        <button 
        onClick={()=>addShape("ellipse")}
        >
          Ellipse
        </button>
        </div>

        <div>
        <label htmlFor="background-color">Color:</label>
        <input
          type="color"
          id="backgroundColor"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>
      
   { 
   shape &&    
  <div>
      <div>
        <label htmlFor="fill-color">Color:</label>
        <input
          type="color"
          id="fillColor"
          value={shape.fillColor}
          onChange={(e) => handleColor(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="strokeColor">Stroke Color:</label>
        <input
          type="color"
          id="strokeColor"
          value={shape.strokeColor}
          onChange={(e) => handleStrokeColor(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="strokeWidth">Stroke Width:</label>
        <input
          type="number"
          id="strokeWidth"
          value={shape.strokeWidth}
          onChange={(e) => handleStrokeWidth(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="rotation">Rotation:</label>
        <input
          type="number"
          id="rotation"
          value={shape.rotation}
          onChange={(e) => handleRotation(Number(e.target.value))}
        />
      </div>
      </div>
}
      </div>
    )
  }

  export default SidePanel;
