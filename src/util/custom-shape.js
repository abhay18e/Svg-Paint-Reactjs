export default {
    "arrow":
    {
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

}
