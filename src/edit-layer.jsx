import React, { useState } from "react";

const EditLayer = ({ CurrentLayer, onColorChange }) => {
  const [currentColor, setCurrentColor] = useState("");
  if (!CurrentLayer) return <div />;
  return (
    <div>
      <h4>color:</h4>
      <input
        defaultValue={currentColor}
        onChange={e => setCurrentColor(e.target.value)}
      />
      <button onClick={() => onColorChange(currentColor)}>Apply</button>
    </div>
  );
};

export default EditLayer;
