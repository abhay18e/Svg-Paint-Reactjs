const shapeInfo = {
    "defaultSquareDimension":(shapeType)=>{
       return {
        type:shapeType,
        x:100,
        y:100,
        width:100,
        height:100,
        fillColor:"#ff0000",
        strokeColor:"#808080",
        strokeWidth:2,
        rotation:0}
      },

      "defaultLineDimension":(shapeType)=>{
        return{
            type:shapeType,
            points : [{x:100,y:100},{x:200,y:200}],
            strokeColor:"#808080",
            strokeWidth:2,        
        }
      },

      "defaultPolygonDimension":(shapeType,vertexCount)=>{
         //with center 100 100 and radius 100 get me vertexCount points on circle
         let points = []
         for(let i=0;i<vertexCount;i++){
             let angle = (2*Math.PI*i)/vertexCount
             let x = 100 + 100*Math.cos(angle)
             let y = 100 + 100*Math.sin(angle)
             points.push({x,y})
         }
        return {
            type:shapeType,
            points,
            fillColor:"#ff0000",
            strokeColor:"#808080",
            strokeWidth:2,
        }
      },

   //------------------------------------
    "customShape":{
        "arrow":{
                getPoints : (shape)=>{
                    const {x,y,width:w,height:h} = shape
                    const A1 = 0.35
                    const A2 = 0.65
                    const B1 = 0.65
                    const C1 = 0.5
                    
                    let x1 = x      , y1 = y+h*A1
                    let x2 = x+w*B1 , y2 = y+h*A1
                    let x3 = x+w*B1 , y3 = y
                    let x4 = x+w    , y4 = y+h*C1
                    let x5 = x+w*B1 , y5 = y+h
                    let x6 = x+w*B1 , y6 = y+h*A2
                    let x7 = x      , y7 = y+h*A2
                    return `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4} ${x5},${y5} ${x6},${y6} ${x7},${y7}`
                }
            },

},
}
export default shapeInfo;