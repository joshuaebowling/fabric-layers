import React from "react";
import { map, each } from "lodash";

const Layers = ({ layers, getShapes, selectLayer }) => {
  if (layers.length === 0) return <div />;
  each(layers, l => console.log(getShapes(l)));
  return (
    <table>
      <thead>
        <tr>
          <th>Layers</th>
          <th>shape ids</th>
        </tr>
      </thead>
      <tbody>
        {map(layers, layer => (
          <tr key={layer.id}>
            <td>
              <button onClick={() => selectLayer(layer)}>
                Edit {layer.id}
              </button>
            </td>
            <td>
              {(getShapes(layer) || [{ id: null }]).map(shape => (
                <span>{shape.id},</span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Layers;
