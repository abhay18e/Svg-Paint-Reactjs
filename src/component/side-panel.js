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
  deleteShape,
  moveDownShape,
  moveUpShape,
  clearCanvas,
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

  const handleFillColor = (fillColor) => {
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

    
      <FillColor
        labelText="Background Color"
        fillColor={backgroundColor}
        onFillColorChange={setBackgroundColor}
        labelStyle={labelStyle}
        colorInputStyle={colorInputStyle}
      />

      {shape && (
        <>
          <FillColor
            labelText="Fill Color"
            fillColor={shape.fillColor}
            onFillColorChange={handleFillColor}
            labelStyle={labelStyle}
            colorInputStyle={colorInputStyle}
          />
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
          {!isCreatingCurve &&
            !isCreatingPolygon && [
              <div style={flexItemStyle} className="flex-item">
                <button style={buttonStyle} onClick={deleteShape}>
                  Delete {shape.type}
                </button>
              </div>,
              <div style={flexItemStyle} className="flex-item">
                <button style={buttonStyle} onClick={moveUpShape}>
                  Up {shape.type}
                </button>
              </div>,
              <div style={flexItemStyle} className="flex-item">
                <button style={buttonStyle} onClick={moveDownShape}>
                  Down {shape.type}
                </button>
              </div>,

              <div style={flexItemStyle} className="flex-item">
                <button style={buttonStyle} onClick={clearCanvas}>
                  Clear canvas
                </button>
              </div>,
            ]}
        </>
      )}
    </div>
  );
}

const FillColor = ({
  fillColor,
  onFillColorChange,
  colorInputStyle,
  labelStyle,
  labelText,
}) => {
  const handleColorAChange = (e) => {
    const newFillColor = { ...fillColor, colorA: e.target.value };
    onFillColorChange(newFillColor);
  };

  const handleColorBChange = (e) => {
    const newFillColor = { ...fillColor, colorB: e.target.value };
    onFillColorChange(newFillColor);
  };

  const handleGradientAngleChange = (e) => {
    const angle = parseInt(e.target.value);
    const newFillColor = {
      ...fillColor,
      gradientAngle: angle,
      isGradient: angle !== -1, // Set isGradient to false if gradientAngle is -1
    };
    onFillColorChange(newFillColor);
  };

  return (
    <div>
      <label style={labelStyle} htmlFor="colorA">
        {labelText}:
      </label>
      <input
        style={{ ...colorInputStyle, width: "25px" }}
        type="color"
        id="colorA"
        value={fillColor.colorA}
        onChange={handleColorAChange}
      />

      <select
        style={{ ...colorInputStyle, textAlign: "center" }}
        id="gradientAngle"
        value={fillColor.gradientAngle}
        onChange={handleGradientAngleChange}
      >
        <option value={-1}>None</option>
        <option value={0}>0°</option>
        <option value={45}>45°</option>
        <option value={90}>90°</option>
        <option value={135}>135°</option>
        <option value={180}>180°</option>
        <option value={225}>225°</option>
        <option value={270}>270°</option>
        <option value={315}>315°</option>

        {/* Add more options for other angles */}
      </select>
      <input
        style={{ ...colorInputStyle, width: "25px" }}
        type="color"
        id="colorB"
        value={fillColor.colorB}
        onChange={handleColorBChange}
      />
    </div>
  );
};

export default SidePanel;
