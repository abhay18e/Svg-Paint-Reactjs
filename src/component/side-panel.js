import React from "react";

function SidePanel({
  addShape,
  shape,
  updateShapeList,
  backgroundColor,
  setBackgroundColor,
  handlePolygonCreation,
  handleCurveCreation,
  isCreatingPolygon,
  isCreatingCurve,
}) {
  const flexContainerStyle = {
    padding: "4px 0px",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    boxShadow: "1px 1px 5px grey",
  };

  const flexItemStyle = {
    flex: "95%",
    margin: "1px",
  };

  const inputStyle = {
    width: "50px",
    padding: "4px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    outline: "none",
  };

  const colorInputStyle = {
    ...inputStyle,

    appearance: "none",
    // "-moz-appearance": "none",
    // "-webkit-appearance": "none",
    background: "none",
    border: 0,
    cursor: "pointer",
    height: "25px",
    padding: 0,
    width: "50px",
  };

  const buttonStyle = {
    padding: "4px 8px",
    borderRadius: "4px",
    width: "90px",
    border: "none",
    backgroundColor: "grey",
    color: "#fff",
    cursor: "pointer",
    outline: "none",
    margin: "0px 4px",
  };

  const labelStyle = {
    display: "inline-flex",
    //alignItems: "center",
    padding: "0px 4px",
    width: "90px",
    color: "black",
    margin: "1px",
    // backgroundColor: "grey",
    // color: "#fff",
  };

  const handleColor = (fillColor) => {
    let newShape = { ...shape };
    newShape.fillColor = fillColor;
    updateShapeList(newShape);
  };
  const handleStrokeColor = (strokeColor) => {
    let newShape = { ...shape };
    newShape.strokeColor = strokeColor;
    updateShapeList(newShape);
  };
  const handleStrokeWidth = (strokeWidth) => {
    let newShape = { ...shape };
    newShape.strokeWidth = strokeWidth;
    updateShapeList(newShape);
  };
  const handleRotation = (rotation) => {
    let newShape = { ...shape };
    newShape.rotation = rotation;
    updateShapeList(newShape);
  };

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
        <button
          style={{
            ...buttonStyle,
            color: isCreatingPolygon ? "yellow" : "#fff",
          }}
          onClick={handlePolygonCreation}
        >
          Polygon
        </button>
      </div>

      <div style={flexItemStyle} className="flex-item">
        <button
          style={{ ...buttonStyle, color: isCreatingCurve ? "yellow" : "#fff" }}
          onClick={handleCurveCreation}
        >
          Curve
        </button>
      </div>

      <div style={flexItemStyle} className="flex-item">
        <label style={labelStyle} htmlFor="background-color">
          Background Color
        </label>
        <input
          style={colorInputStyle}
          type="color"
          id="backgroundColor"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>

      {shape && (
        <>
          <div style={flexItemStyle} className="flex-item">
            <label style={labelStyle} htmlFor="fill-color">
              Fill Color
            </label>
            <input
              style={colorInputStyle}
              type="color"
              id="fillColor"
              value={shape.fillColor}
              onChange={(e) => handleColor(e.target.value)}
            />
          </div>
          <div style={flexItemStyle} className="flex-item">
            <label style={labelStyle} htmlFor="strokeColor">
              Stroke Color
            </label>
            <input
              style={colorInputStyle}
              type="color"
              id="strokeColor"
              value={shape.strokeColor}
              onChange={(e) => handleStrokeColor(e.target.value)}
            />
          </div>
          <div style={flexItemStyle} className="flex-item">
            <label style={labelStyle} htmlFor="strokeWidth">
              Stroke Width
            </label>
            <input
              style={inputStyle}
              type="number"
              id="strokeWidth"
              value={shape.strokeWidth}
              onChange={(e) => handleStrokeWidth(Number(e.target.value))}
            />
          </div>
          <div style={flexItemStyle} className="flex-item">
            <label style={labelStyle} htmlFor="rotation">
              Rotation
            </label>
            <input
              style={inputStyle}
              type="number"
              id="rotation"
              value={shape.rotation}
              onChange={(e) => handleRotation(Number(e.target.value))}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default SidePanel;
