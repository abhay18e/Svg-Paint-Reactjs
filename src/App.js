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
import DownloadIcon from "./media/download.svg";


function App() {
  let [shapeList, setShapeList] = useState([]);
  let [isDragging, setIsDragging] = useState(false);
  let [svgHeight, setSvgHeight] = useState(500);

  

  let [active, setActive] = useState({
    shapeIndex: null,
    handle: "",
    pointIndex: -1,
    controlPointIndex: -1,
  });

  let [backgroundColor, setBackgroundColor] = useState({
    colorA: "#ff0000",
    colorB: "#ffff00",
    isGradient: true,
    gradientAngle: 0,
  });
  let svgEl = useRef(null);
  let [isShowSidePanel, setIsShowSidePanel] = useState(true);
  let [isCreatingPolygon, setIsCreatingPolygon] = useState(false);
  let [isCreatingCurve, setIsCreatingCurve] = useState(false);
  let [intialPoint, setInitialPoint] = useState({ x: 0, y: 0 });
  let [currentPoint, setCurrentPoint] = useState({ x: 0, y: 0 });
  let timerId = useRef(null);
  let translatingShape = useRef(null);

  //console.log all state var in format console.log("var",value)
  // console.log("shapeList", shapeList);
  // console.log("isDragging", isDragging);
  // console.log("active", active);
  // console.log("active", active);
  // console.log("backgroundColor", backgroundColor);
  // console.log("isShowSidePanel", isShowSidePanel);
  // console.log("isCreatingPolygon", isCreatingPolygon);
  // console.log("isCreatingCurve", isCreatingCurve);
  // console.log("intialPoint", intialPoint);
  // console.log("currentPoint", currentPoint);
  useEffect(() => {
    //set svgHeight to windowHeight-50px
    let windowHeight = window.innerHeight;
    let svgHeight = windowHeight - 54;
    setSvgHeight(svgHeight);
  }, [svgHeight]);


  function downloadSvg(){
    const svgData = new XMLSerializer().serializeToString(svgEl.current);

    // Create a Blob from the SVG data
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

    // Create a temporary link element and set its attributes
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'drawing.svg';

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up the temporary link
    URL.revokeObjectURL(link.href);
  }

  function setTranslatingShape(shape) {
    translatingShape.current = shape;
  }

  function handleCurveCreation() {
    setIsCreatingPolygon(false);
    if (isCreatingCurve === false) {
      let newShapeList = cloneDeep(shapeList);
      newShapeList.push(new Curve()); //[...shapeList, new Curve()];
      setShapeList(newShapeList);
      setIsCreatingCurve(true);
      setActive((active) => {
        return { ...active, shapeIndex: newShapeList.length - 1 };
      });
    } else {
      //if the user has created a Curve less than 2 points then remove that last shape from shapeList
      if (
        shapeList.length >= 1 &&
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
    setIsCreatingCurve(false);
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
        shapeList.length >= 1 &&
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
    timerId.current = setTimeout(() => {
      setIsDragging(false);
    }, 100);

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
    const MIN_WIDTH_HEIGHT = 10;
    let rect = svgEl.current.getBoundingClientRect();

    let pointer = {
      x: e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left,
      y: e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top,
    };

    setCurrentPoint({ x: pointer.x, y: pointer.y });

    if (isDragging && isCreatingCurve) {
      let newShapeList = cloneDeep(shapeList); //[...shapeList];
      let lastShape = newShapeList[newShapeList.length - 1];
      lastShape.points[lastShape.points.length - 1].ctx = pointer.x;
      lastShape.points[lastShape.points.length - 1].cty = pointer.y;
      setShapeList(newShapeList);
    }

    if (
      isDragging &&
      !isCreatingCurve &&
      !isCreatingPolygon &&
      active.shapeIndex !== null
    ) {
      let newShape = cloneDeep(shapeList[active.shapeIndex]);
      let { x: cx, y: cy } = newShape.info().center;

      let { x: pointerX, y: pointerY } = rotatedVector(
        newShape.info().center,
        pointer,
        -1 * newShape.rotation
      );

      let vecA = {
        x: intialPoint.x - rect.left - cx,
        y: intialPoint.y - rect.top - cy,
      };
      let vecB = { x: pointer.x - cx, y: pointer.y - cy };
      let degree = getAngleBetweenVectors(vecA, vecB);
      degree = pointer.x - cx > 0 ? degree : -1 * degree;

      switch (active.handle) {
        case "handle-xy":
          newShape.width = Math.max(pointerX - newShape.left, MIN_WIDTH_HEIGHT);
          newShape.height = Math.max(pointerY - newShape.top, MIN_WIDTH_HEIGHT);
          break;
        case "handle-x":
          newShape.width = Math.max(pointerX - newShape.left, MIN_WIDTH_HEIGHT);
          if (newShape.type === "circle") newShape.height = newShape.width;
          break;
        case "handle-y":
          newShape.height = Math.max(pointerY - newShape.top, MIN_WIDTH_HEIGHT);
          break;
        case "handle-translate":
          newShape.left = pointerX - newShape.width / 2;
          newShape.top = pointerY - newShape.height / 2;
          break;
        case "handle-rotate":
          // let radians = Math.atan2(pointer.y - cy, pointer.x - cx);
          newShape.rotation = degree; //(radians * 180) / Math.PI;
          break;
        case "handle-curve-polygon-translate":
          let diffVector = {
            x: pointer.x - intialPoint.x,
            y: pointer.y - intialPoint.y,
          };
          newShape.points =
            translatingShape.current.getTranslatedPoints(diffVector);
          //*****************
          //************** */ */
          console.log("inside handle-curve-polygon-translate");
          break;
        case "handle-curve-polygon-rotate":
          newShape.points = translatingShape.current.getRotatedPoints(degree);
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
    setIsCreatingCurve(false);
    setIsCreatingPolygon(false);
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
    setShapeList(clonedShapeList);

    setActive((active) => {
      return { ...active, shapeIndex: shapeList.length };
    });
  }

  function moveUpShape() {
    if (active.shapeIndex === shapeList.length - 1) return;

    let newShapeList = cloneDeep(shapeList);
    let temp = newShapeList[active.shapeIndex];
    newShapeList[active.shapeIndex] = newShapeList[active.shapeIndex + 1];
    newShapeList[active.shapeIndex + 1] = temp;
    setShapeList(newShapeList);
    setActive((active) => {
      return { ...active, shapeIndex: active.shapeIndex + 1 };
    });
  }

  function moveDownShape() {
    if (active.shapeIndex === 0) return;

    let newShapeList = cloneDeep(shapeList);
    let temp = newShapeList[active.shapeIndex];
    newShapeList[active.shapeIndex] = newShapeList[active.shapeIndex - 1];
    newShapeList[active.shapeIndex - 1] = temp;
    setShapeList(newShapeList);
    setActive((active) => {
      return { ...active, shapeIndex: active.shapeIndex - 1 };
    });
  }

  function clearCanvas() {
    setShapeList([]);
    setActive({
      shapeIndex: null,
      handle: "",
      pointIndex: -1,
      controlPointIndex: -1,
    });
  }

  function deleteShape() {
    if (active.shapeIndex !== null) {
      let newShapeList = cloneDeep(shapeList);
      newShapeList.splice(active.shapeIndex, 1);
      setShapeList(newShapeList);
    }
    setActive({
      shapeIndex: null,
      handle: "",
      pointIndex: -1,
      controlPointIndex: -1,
    });
  }

  function updateShapeList(shape) {
    let newShapeList = shapeList.map((item, index) => {
      if (index === active.shapeIndex) {
        return {
          ...shape,
          info: item.info,
          getGradientDef: item.getGradientDef,
          getTranslatedPoints: item.getTranslatedPoints,
          getRotatedPoints: item.getRotatedPoints,
        };
      }
      return item;
    });
    setShapeList(newShapeList);
  }

  function handleCLick(e) {
    console.log(e);
    let rect = svgEl.current.getBoundingClientRect();
    let pointer = {
      x: e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left,
      y: e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top,
    };

    if (
      (e.target.id === "outer-container" || e.target.id === "svg-container") &&
      !isCreatingPolygon &&
      !isCreatingCurve
    ) {
      console.log("hhhhhhhhhh");
      setActive((active) => {
        return { ...active, shapeIndex: null };
      });
      //setIsShowSidePanel(false);
    }
    if (
      isCreatingPolygon &&
      (e.target.id === "svg-container" || e.target.id === "dummy-line")
    ) {
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
      let newPoints = [
        ...lastShape.points,
        { x: pointer.x, y: pointer.y, ctx: pointer.x, cty: pointer.y },
      ];
      lastShape.points = newPoints;
      setShapeList(newShapeList);
      setIsDragging(true);
      clearTimeout(timerId.current);
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

        <button id="download-svg-button" onClick={downloadSvg}>
          <img src={DownloadIcon} width={48} height={48} alt="download-icon" />
        </button>
      </div>

      <div id="paint-container">
        <svg
          height={svgHeight}
          ref={svgEl}
          id="svg-container-main"
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchEnd={handlePointerUp}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        >
          <defs>
            {shapeList.map((shape, index) => shape.getGradientDef(index))}
            {backgroundColor.isGradient && (
              <linearGradient
                id="backgroundGradient"
                gradientTransform={`rotate(${backgroundColor.gradientAngle})`}
              >
                <stop offset="0%" stopColor={backgroundColor.colorA} />
                <stop offset="100%" stopColor={backgroundColor.colorB} />
              </linearGradient>
            )}
          </defs>
          <rect
            id="svg-container"
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={
              backgroundColor.isGradient
                ? "url(#backgroundGradient)"
                : backgroundColor.colorA
            }
          />

          {shapeList.map((shape, index) => (
            <DrawShape
              shape={shape}
              index={index}
              key={index}
              setActive={setActive}
            />
          ))}

          {active.shapeIndex !== null && (
            <DrawHandles
              shape={shapeList[active.shapeIndex]}
              setIsDragging={setIsDragging}
              setActive={setActive}
              setInitialPoint={setInitialPoint}
              isCurvePolygonCreation={isCreatingCurve || isCreatingPolygon}
              setTranslatingShape={setTranslatingShape}
            />
          )}

          {isCreatingPolygon &&
            shapeList[active.shapeIndex].points.length > 0 && (
              <line
                x1={
                  shapeList[active.shapeIndex].points[
                    shapeList[active.shapeIndex].points.length - 1
                  ].x
                }
                y1={
                  shapeList[active.shapeIndex].points[
                    shapeList[active.shapeIndex].points.length - 1
                  ].y
                }
                x2={currentPoint.x}
                y2={currentPoint.y}
                stroke="black"
                id="dummy-line"
              />
            )}

          {isCreatingCurve &&
            shapeList[active.shapeIndex].points.length &&
            shapeList[active.shapeIndex].points[
              shapeList[active.shapeIndex].points.length - 1
            ].ctx && (
              <path
                d={`M ${
                  shapeList[active.shapeIndex].points[
                    shapeList[active.shapeIndex].points.length - 1
                  ].x
                }
        ${
          shapeList[active.shapeIndex].points[
            shapeList[active.shapeIndex].points.length - 1
          ].y
        },
        C ${
          shapeList[active.shapeIndex].points[
            shapeList[active.shapeIndex].points.length - 1
          ].ctx
        }
        ${
          shapeList[active.shapeIndex].points[
            shapeList[active.shapeIndex].points.length - 1
          ].cty
        },
        ${currentPoint.x}
        ${currentPoint.y},
        ${currentPoint.x}
        ${currentPoint.y}`}
                fill={"transparent"}
                stroke="black"
                id="dummy-line"
              />
            )}
        </svg>

        <div id="side-panel-container">
          {isShowSidePanel && (
            <SidePanel
              addShape={addShape}
              deleteShape={deleteShape}
              shape={shapeList[active.shapeIndex]}
              updateShapeList={updateShapeList}
              setBackgroundColor={setBackgroundColor}
              backgroundColor={backgroundColor}
              handlePolygonCreation={handlePolygonCreation}
              handleCurveCreation={handleCurveCreation}
              isCreatingCurve={isCreatingCurve}
              isCreatingPolygon={isCreatingPolygon}
              moveDownShape={moveDownShape}
              moveUpShape={moveUpShape}
              clearCanvas={clearCanvas}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

/*
   {isCreatingCurve &&
            shapeList[active.shapeIndex].points[
              shapeList[active.shapeIndex].points.length - 1
            ].ctx && (
              <path
                d={`M ${
                  shapeList[active.shapeIndex].points[
                    shapeList[active.shapeIndex].points.length - 1
                  ].x
                }
        ${
          shapeList[active.shapeIndex].points[
            shapeList[active.shapeIndex].points.length - 1
          ].y
        },
        C ${
          shapeList[active.shapeIndex].points[
            shapeList[active.shapeIndex].points.length - 1
          ].x
        }
        ${
          shapeList[active.shapeIndex].points[
            shapeList[active.shapeIndex].points.length - 1
          ].y
        },
        ${currentPoint.x}
        ${currentPoint.y},
        ${currentPoint.x}
        ${currentPoint.y}`}
                fill={"transparent"}
                stroke="black"
                id="dummy-line"
              />
            )}
*/
