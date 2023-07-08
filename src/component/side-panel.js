import { useState } from 'react'
function SidePanel({addShape,shape,updateShapeList,backgroundColor,setBackgroundColor}){
  const [vertexCount,setVertexCount] = useState(3)

  const flexContainerStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    boxShadow: "1px 1px 5px grey",
  }

  const flexItemStyle = {
    flex:"95%",
    margin:"1px",
  }

  const inputStyle ={
    
    width:"50px",
  }
  const buttonStyle = {
    padding:"1px",
  }
  
  const handleVertexCount = (e)=>{
      const value =Number(e.target.value)
      setVertexCount(value)
  }
  
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
      <div style={flexContainerStyle} id="side-panel">

          <div style={flexItemStyle} className="flex-item">
            <button style={buttonStyle} onClick={() => addShape("rectangle")}>
              Rectangle
            </button>
          </div>
          <div style={flexItemStyle} className="flex-item">
            <button style={buttonStyle} onClick={() => addShape("circle")}>
              Circle
            </button>
          </div>
          <div style={flexItemStyle} className="flex-item">
            <button style={buttonStyle} onClick={() => addShape("ellipse")}>
              Ellipse
            </button>
          </div>
          <div style={flexItemStyle} className="flex-item">
            <button style={buttonStyle} onClick={() => addShape("arrow")}>
              Arrow
            </button>
          </div>
          <div style={flexItemStyle} className="flex-item">
            <button style={buttonStyle} onClick={() => addShape("line")}>
              Line
            </button>
          </div>
          <div style={flexItemStyle} className='flex-item'>
            <input style={inputStyle} type='number' value={vertexCount} onChange={handleVertexCount} />
            <button style={buttonStyle} onClick={()=>addShape("polygon",vertexCount)} disabled={vertexCount<3}>
              Polygon
            </button>
          </div>
          
        

        <div style={flexItemStyle} className='flex-item'>
        <label htmlFor="background-color">Color:</label>
        <input style={inputStyle}
          type="color"
          id="backgroundColor"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>
      
   { 
   shape &&    
  <>
      <div style={flexItemStyle} className='flex-item'>
        <label htmlFor="fill-color">Color:</label>
        <input style={inputStyle}
          type="color"
          id="fillColor"
          value={shape.fillColor}
          onChange={(e) => handleColor(e.target.value)}
        />
      </div>
      <div style={flexItemStyle} className='flex-item'>
        <label htmlFor="strokeColor">Stroke Color:</label>
        <input style={inputStyle}
          type="color"
          id="strokeColor"
          value={shape.strokeColor}
          onChange={(e) => handleStrokeColor(e.target.value)}
        />
      </div>
      <div style={flexItemStyle} className='flex-item'>
        <label htmlFor="strokeWidth">Stroke Width:</label>
        <input style={inputStyle}
          type="number"
          id="strokeWidth"
          value={shape.strokeWidth}
          onChange={(e) => handleStrokeWidth(Number(e.target.value))}
        />
      </div>
      <div style={flexItemStyle} className='flex-item'>
        <label htmlFor="rotation">Rotation:</label>
        <input style={inputStyle}
          type="number"
          id="rotation"
          value={shape.rotation}
          onChange={(e) => handleRotation(Number(e.target.value))}
        />
      </div>
      </>
}
      
      </div>
    )
  }

  export default SidePanel;
