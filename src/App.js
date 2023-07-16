import "./App.css";
import { useState, useEffect, useRef } from "react";
import DrawHandles from "./component/draw-handles";
import DrawShape from "./component/draw-shape";
import SidePanel from "./component/side-panel";
import rotatedVector from "./util/rotate-vector";
import { Polygon, Curve, Rectangle } from "./util/shape";
import MenuIcon from "./media/menu.svg";
import { clone, cloneDeep } from "lodash";
import getAngleBetweenVectors from "./util/angle-btw-vector";
function App() {
  let [shapeList, setShapeList] = useState([]);
  let [isDragging, setIsDragging] = useState(false);
  let [active, setActive] = useState({
    shapeIndex: null,
    handle: "",
    pointIndex: -1,
    controlPointIndex: -1,
  });

  let [backgroundColor, setBackgroundColor] = useState("#00ffff");
  let svgEl = useRef(null);
  let [isShowSidePanel, setIsShowSidePanel] = useState(true);
  let [isCreatingPolygon, setIsCreatingPolygon] = useState(false);
  let [isCreatingCurve, setIsCreatingCurve] = useState(false);
  let [intialPoint, setInitialPoint] = useState({ x: 0, y: 0 });

  function handleCurveCreation() {
    if (isCreatingCurve === false) {
      let newShapeList = cloneDeep(shapeList);
      newShapeList.push(new Curve()); //[...shapeList, new Curve()];
      setShapeList(newShapeList);
      setIsCreatingCurve(true);
      setActive((active) => {
        return { ...active, shapeIndex: shapeList.length };
      });
    } else {
      //if the user has created a Curve less than 2 points then remove that last shape from shapeList
      if (
        shapeList.length > 1 &&
        shapeList[active.shapeIndex].points.length < 2
      ) {
        let newShapeList = cloneDeep(shapeList); //[...shapeList];
        newShapeList.pop();
        setShapeList(newShapeList);
      }
      setIsCreatingCurve(false);
    }
  }

  function handlePolygonCreation() {
    if (isCreatingPolygon === false) {
      let newShapeList = cloneDeep(shapeList);
      newShapeList.push(new Polygon()); //[...shapeList, new Polygon()];
      setShapeList(newShapeList);
      setIsCreatingPolygon(true);
      setActive((active) => {
        return { ...active, shapeIndex: shapeList.length };
      });
    } else {
      //if the user has created a polygon less than 2 points then remove that last shape from shapeList
      if (
        shapeList.length > 1 &&
        shapeList[active.shapeIndex].points.length < 2
      ) {
        let newShapeList = cloneDeep(shapeList); //[...shapeList];
        newShapeList.pop();
        setShapeList(newShapeList);
      }

      setIsCreatingPolygon(false);
    }
  }

  function handlePointerUp(e) {
    setIsDragging(false);
    setActive((active) => {
      return { ...active, handle: "", pointIndex: -1 };
    });

    if (isCreatingCurve) {
      let rect = svgEl.current.getBoundingClientRect();

      let pointer = {
        x: e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left,
        y: e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top,
      };

      //add control point x,y into the last point of the last shapeList
      let newShapeList = cloneDeep(shapeList); //[...shapeList];
      let lastShape = newShapeList[newShapeList.length - 1];
      lastShape.points[lastShape.points.length - 1].ctx = pointer.x;
      lastShape.points[lastShape.points.length - 1].cty = pointer.y;
      setShapeList(newShapeList);
    }
  }

  function handlePointerMove(e) {
    if (!isDragging) return;

    const MIN_WIDTH_HEIGHT = 10;
    let rect = svgEl.current.getBoundingClientRect();

    let pointer = {
      x: e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left,
      y: e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top,
    };

    let newShape = cloneDeep(shapeList[active.shapeIndex]);
    let { x: cx, y: cy } = newShape.info().center;

    let { x: pointerX, y: pointerY } = rotatedVector(
      newShape.info().center,
      pointer,
      -1 * newShape.rotation
    );

    if (isDragging) {
      switch (active.handle) {
        case "handle-xy":
          newShape.width = Math.max(pointerX - newShape.left, MIN_WIDTH_HEIGHT);
          newShape.height = Math.max(pointerY - newShape.top, MIN_WIDTH_HEIGHT);
          break;
        case "handle-x":
          newShape.width = Math.max(pointerX - newShape.left, MIN_WIDTH_HEIGHT);
          break;
        case "handle-y":
          newShape.height = Math.max(pointerY - newShape.top, MIN_WIDTH_HEIGHT);
          break;
        case "handle-translate":
          newShape.left = pointerX - newShape.width / 2;
          newShape.top = pointerY - newShape.height / 2;
          break;
        case "handle-rotate":
          let vecA = {
            x: intialPoint.x - rect.left - cx,
            y: intialPoint.y - rect.top - cy,
          };
          let vecB = { x: pointer.x - cx, y: pointer.y - cy };
          let degree = getAngleBetweenVectors(vecA, vecB);
          // let radians = Math.atan2(pointer.y - cy, pointer.x - cx);
          newShape.rotation = pointer.x - cx > 0 ? degree : -1 * degree; //(radians * 180) / Math.PI;
          break;
        case "handle-polygon":
          let newPoints = [...newShape.points];
          newPoints[Number(active.pointIndex)].x = pointer.x;
          newPoints[Number(active.pointIndex)].y = pointer.y;
          newShape.points = newPoints;
          break;
        case "handle-curve":
          let newCurvePoints = [...newShape.points];
          if (active.controlPointIndex !== -1) {
            newCurvePoints[active.controlPointIndex].ctx = pointer.x;
            newCurvePoints[active.controlPointIndex].cty = pointer.y;
            console.log(
              "control point index",
              newCurvePoints[active.controlPointIndex]
            );
          }
          newShape.points = newCurvePoints;
          break;
        default:
          break;
      }
      updateShapeList(newShape);
    }
  }

  function addShape(shapeType) {
    setIsCreatingCurve(false)
    setIsCreatingPolygon(false)
    let clonedShapeList = cloneDeep(shapeList);

    switch (shapeType) {
      case "rectangle":
      case "ellipse":
      case "circle":
      case "arrow":
        clonedShapeList.push(new Rectangle(shapeType));
        break;
      case "polygon":
        clonedShapeList.push(new Polygon());
        break;
      case "curve":
        clonedShapeList.push(new Curve());
        break;
      default:
        break;
    }
    console.log("clonedShapeList", clonedShapeList);
    setShapeList(clonedShapeList);

    setActive((active) => {
      return { ...active, shapeIndex: shapeList.length };
    });
  }

  function updateShapeList(shape) {
    let newShapeList = shapeList.map((item, index) => {
      if (index === active.shapeIndex) {
        return { ...shape, info: item.info };
      }
      return item;
    });
    setShapeList(newShapeList);
  }

  function handleCLick(e) {
    let rect = svgEl.current.getBoundingClientRect();

    let pointer = {
      x: e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left,
      y: e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top,
    };

    if (e.target.id === "outer-container" || e.target.id === "svg-container") {
      setActive((active) => {
        return { ...active, shapeIndex: null };
      });
      //setIsShowSidePanel(false);
    }
    console.log(e);
    if (isCreatingPolygon && e.target.id === "svg-container") {
      //Add a new point to the points parameter of the last shape in shapeList
      let newShapeList = cloneDeep(shapeList); //[...shapeList];
      let lastShape = newShapeList[newShapeList.length - 1];
      let newPoints = [...lastShape.points, { x: pointer.x, y: pointer.y }];
      lastShape.points = newPoints;
      setShapeList(newShapeList);
    }
  }

  function handlePointerDown(e) {
    let rect = svgEl.current.getBoundingClientRect();

    let pointer = {
      x: e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left,
      y: e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top,
    };

    if (isCreatingCurve) {
      //Add a new point to the points parameter of the last shape in shapeList
      let newShapeList = cloneDeep(shapeList); //[...shapeList];
      let lastShape = newShapeList[newShapeList.length - 1];
      let newPoints = [...lastShape.points, { x: pointer.x, y: pointer.y }];
      lastShape.points = newPoints;
      setShapeList(newShapeList);
    }
  }

  return (
    <div id="outer-container" onClick={handleCLick}>
      <div id="heading">
        <h1>Svg Paint</h1>

        <button
          id="side-panel-button"
          onClick={() => setIsShowSidePanel((bool) => !bool)}
        >
          <img src={MenuIcon} width={48} height={48} alt="menu-icon" />
        </button>
      </div>

      <div id="paint-container">
        <svg
          height={500}
          ref={svgEl}
          id="svg-container"
          style={{ backgroundColor: backgroundColor }}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchEnd={handlePointerUp}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        >
          {shapeList.map((shape, index) => (
            <DrawShape
              shape={shape}
              index={index}
              key={index}
              setActive={setActive}
            />
          ))}

          {active.shapeIndex !== null  && (
            <DrawHandles
              shape={shapeList[active.shapeIndex]}
              setIsDragging={setIsDragging}
              setActive={setActive}
              setInitialPoint={setInitialPoint}
            />
          )}
        </svg>

        <div id="side-panel-container">
          {isShowSidePanel && (
            <SidePanel
              addShape={addShape}
              shape={shapeList[active.shapeIndex]}
              updateShapeList={updateShapeList}
              setBackgroundColor={setBackgroundColor}
              backgroundColor={backgroundColor}
              handlePolygonCreation={handlePolygonCreation}
              handleCurveCreation={handleCurveCreation}
              isCreatingCurve={isCreatingCurve}
              isCreatingPolygon={isCreatingPolygon}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
