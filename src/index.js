import React, { useState, useReducer } from "react";
import ReactDOM from "react-dom";
import { assign, filter, map, indexOf } from "lodash";

import ShapeService from "./services/ShapeService";
import LayerService from "./services/LayerService";
import ShapeLayerService from "./services/ShapeLayerService";

import FabricComponent from "./fabric-component";
import Toolbox from "./toolbox-component";
import Layers from "./layers";
import EditLayer from "./edit-layer";

import "./styles.css";

const canvasName = "screen";

const initialState = {
  currentData: {},
  currentTargets: [],
  allShapes: ShapeService.getAll(),
  allLayers: LayerService.getAll(),
  currentLayer: null
};

const reducer = (state, action) => {
  const stateAddition = {};
  switch (action.type) {
    case "adding":
      stateAddition.allShapes = ShapeService.getAll();
      break;
    case "addlayer":
      stateAddition.allLayers = LayerService.getAll();
      break;
    case "subtracting":
      stateAddition.currentTargets = filter(
        stateAddition.currentTargets,
        target => target.id === action.payload.id
      );
      break;
    case "selecting":
      stateAddition.currentTargets = [...state.currentTargets, action.payload];
      break;
    case "select-layer":
      stateAddition.currentLayer = action.payload;
      break;
    case "error":
      break;
    default:
      break;
  }
  const result = assign({}, state, stateAddition);
  return result;
};

function DrawPanel({ AllShapes }) {
  console.log("allshapes", AllShapes);
  return (
    <div>
      <h3>Shapes</h3>
      {map(AllShapes, shape => (
        <p key={shape.id}>{shape.id}</p>
      ))}
    </div>
  );
}

function SelectPanel({ Selections, AllShapes, OnNewLayer }) {
  console.log("from select panel", Selections);
  return (
    <div>
      <button onClick={() => OnNewLayer()}>Add to Layer</button>
      <h3>Selected Shapes</h3>
      {Selections.map(t => (
        <p>ShapeID: {t.id}</p>
      ))}
    </div>
  );
}

const TOOLS = {
  select: "SELECT",
  draw: "DRAW"
};

const _panels = {
  [TOOLS.select]: SelectPanel,
  [TOOLS.draw]: DrawPanel,
  default: () => <div>Default Panel</div>
};

const Panel = ({
  CurrentPanel,
  Selections,
  AllShapes,
  OnNewLayer,
  CurrentLayer
}) => {
  const ThisPanel = _panels[CurrentPanel] || _panels.default;
  return (
    <ThisPanel
      Selections={Selections}
      AllShapes={AllShapes}
      OnNewLayer={OnNewLayer}
      CurrentLayer={CurrentLayer}
    />
  );
};

const addShape = shape => ShapeService.addShape(shape);

const addLayer = layer => {
  LayerService.add(layer);
};

const addShapeLayer = (shape, layer) => {
  ShapeLayerService.add(shape, layer);
};

function App() {
  const [currentTool, setCurrentTool] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);
  const onNewShape = shape => {
    addShape(shape);
    dispatch({ type: "adding", payload: shape });
  };
  const addLayerAndShapes = (layer, shapes) => {
    LayerService.add(layer);
    let got = LayerService.get(layer);
    ShapeLayerService.upsert(shapes, got);
  };

  const onSelectLayer = layer => {
    dispatch({ type: "select-layer", payload: layer });
  };

  return (
    <div className="App">
      <h2>Instructions for buggy prototype</h2>
      <ol>
        <li>click [DRAW]</li>
        <li>draw some lines</li>
        <li>click [Select]</li>
        <li>select a line</li>
        <li>shft + select another line</li>
        <li>Click [Add New Layer]</li>
      </ol>
      <div>
        <Toolbox
          draw={() => setCurrentTool(TOOLS.draw)}
          select={() => {
            setCurrentTool(TOOLS.select);
          }}
          group={() => setCurrentTool("group")}
        />
      </div>
      <FabricComponent
        CanvasName={canvasName}
        CurrentTool={currentTool}
        CurrentTarget={{
          get: state.currentTargets,
          set: shape => {
            dispatch({ type: "selecting", payload: shape });
          }
        }}
        OnNewShape={shape => onNewShape(shape)}
      />
      <Panel
        CurrentPanel={currentTool}
        Selections={state.currentTargets}
        AllShapes={state.allShapes}
        OnNewLayer={() => {
          addLayerAndShapes(LayerService.getNextId(), state.currentTargets);
          dispatch({ type: "addlayer", payload: null });
        }}
        OnSelectLayer={onSelectLayer}
      />
      <EditLayer
        CurrentLayer={state.CurrentLayer}
        onColorChange={val => console.log(val)}
      />
      <div>
        <Layers
          layers={state.allLayers}
          getShapes={layer => {
            return ShapeLayerService.get().get(layer);
          }}
          selectLayer={onSelectLayer}
        />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
