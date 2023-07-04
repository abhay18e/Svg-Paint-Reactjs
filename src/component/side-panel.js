function SidePanel({addShape}){
 


    return (
      <div id="side-panel">
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
    )
  }

  export default SidePanel;