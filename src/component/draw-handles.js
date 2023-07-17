import rotateVector from "../util/rotate-vector";

function DrawHandles({ shape, setIsDragging, setActive, setInitialPoint }) {
  let handleXY = true;
  let handleX = true;
  let handleY = true;
  let handleTranslate = true;
  let handleRotate = true;

  if (shape.type === "circle") {
    handleXY = handleY = handleRotate = false;
  }
 

  let box = shape.info().getBoundingRect;

  let style = {
    fill: "grey",
    stroke: "black",
    strokeWidth: 3,
    // transformBox: "fill-box",
    // transform: `rotate(${shape.rotation}deg)`,
    // transforOrigin: "center",//`${cx}px ${cy}px`,
  };

  const radius = 8;

  function handleDown(e, pointIndex = -1, controlPointIndex = -1) {
    setIsDragging(true);

    setInitialPoint({
      x: e.touches ? e.touches[0].clientX : e.clientX,
      y: e.touches ? e.touches[0].clientY : e.clientY,
    });

    setActive((active) => {
      return {
        ...active,
        handle: e.target.classList[0],
        pointIndex: pointIndex,
        controlPointIndex: controlPointIndex,
      };
    });
  }

  if (shape.type === "polygon" || shape.type === "curve") {
    return (
      <>
        {
          //Bounding-box
          <rect
            x={box.left}
            y={box.top}
            width={box.width}
            height={box.height}
            stroke="grey"
            fill="transparent"
            strokeWidth={1}
          />
        }

        {shape.points.map((point, i) => {
          return (
            <circle
              cx={point.x}
              cy={point.y}
              r={radius}
              className={`handle-polygon`}
              onMouseDown={(e) => handleDown(e, i)}
              onTouchStart={(e) => handleDown(e, i)}
            />
          );
        })}
        {shape.type === "curve" &&
          shape.points.map((point, i) => {
            if(point.ctx === null) return null
            return [
              <circle
                cx={point.ctx}
                cy={point.cty}
                r={radius}
                className={`handle-curve`}
                onMouseDown={(e) => handleDown(e, 0, i)}
                onTouchStart={(e) => handleDown(e, 0, i)}
              />,
              <line
                x1={point.x}
                y1={point.y}
                x2={point.ctx}
                y2={point.cty}
                stroke={"black"}
                strokeWidth={1}
                
              />,
            ];
          })}
      </>
    );
  }

  return (
    <>
      {
        //Bounding-box
        <rect
          x={box.left}
          y={box.top}
          width={box.width}
          height={box.height}
          stroke="grey"
          fill="transparent"
          strokeWidth={1}
        />
      }

      {handleRotate && (
        <circle
          cx={
            rotateVector(
              shape.info().center,
              shape.info().handleRotate,
              shape.rotation
            ).x
          }
          cy={
            rotateVector(
              shape.info().center,
              shape.info().handleRotate,
              shape.rotation
            ).y
          }
          r={radius}
          style={style}
          className="handle-rotate"
          onMouseDown={handleDown}
          onTouchStart={handleDown}
        />
      )}
      {handleTranslate && (
        <circle
          cx={
            rotateVector(
              shape.info().center,
              shape.info().handleTranslate,
              shape.rotation
            ).x
          }
          cy={
            rotateVector(
              shape.info().center,
              shape.info().handleTranslate,
              shape.rotation
            ).y
          }
          r={radius}
          style={style}
          className="handle-translate"
          onMouseDown={handleDown}
          onTouchStart={handleDown}
        />
      )}
      {handleXY && (
        <circle
          cx={
            rotateVector(
              shape.info().center,
              shape.info().handleXY,
              shape.rotation
            ).x
          }
          cy={
            rotateVector(
              shape.info().center,
              shape.info().handleXY,
              shape.rotation
            ).y
          }
          r={radius}
          style={style}
          className="handle-xy"
          onMouseDown={handleDown}
          onTouchStart={handleDown}
        />
      )}
      {handleX && (
        <circle
          cx={
            rotateVector(
              shape.info().center,
              shape.info().handleX,
              shape.rotation
            ).x
          }
          cy={
            rotateVector(
              shape.info().center,
              shape.info().handleX,
              shape.rotation
            ).y
          }
          onMouseDown={handleDown}
          onTouchStart={handleDown}
          r={radius}
          style={style}
          className="handle-x"
        />
      )}
      {handleY && (
        <circle
          cx={
            rotateVector(
              shape.info().center,
              shape.info().handleY,
              shape.rotation
            ).x
          }
          cy={
            rotateVector(
              shape.info().center,
              shape.info().handleY,
              shape.rotation
            ).y
          }
          r={radius}
          style={style}
          onMouseDown={handleDown}
          onTouchStart={handleDown}
          className="handle-y"
        />
      )}
    </>
  );
}

export default DrawHandles;
