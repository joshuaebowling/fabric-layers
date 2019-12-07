import React from "react";
import ReactDOM from "react-dom";
import { fabric } from "fabric";

import ShapeService from "./services/ShapeService";

var canvas = new fabric.Canvas("c", {
  isDrawingMode: true
});

class CanvasComponent extends React.Component {
  canvas = null;
  getFrame = null;
  onNewShape = () => console.log("on ns");
  currentTool = "DRAW";
  drawEventsSet = false;
  currentTarget = {
    get: () => {},
    set: () => {
      console.log("default set");
    }
  };
  initDrawEvents() {
    canvas.on("object:added", e => {
      this.onNewShape(e.target);
    });
    this.drawEventsSet = true;
  }
  destroyDrawEvents() {
    console.log("destroy draw events");
    canvas
      .off("mouse:up")
      .off("object:added")
      .off("selection:created")
      .off("selection:cleared");
    this.drawEventsSet = false;
  }
  initSelectionEvents() {
    console.log("init select events");
    canvas.on("selection:created", e => {
      canvas.on("mouse:up", e => {
        if (e.target._objects) {
          console.log("in mouseup", e);
          let objs = e.target._objects;
          objs.forEach(obj => this.currentTarget.set(obj));
        }
      });
    });
    canvas.on("selection:cleared", () => {
      canvas.off("mouse:up");
    });
  }
  constructor(props) {
    super(props);
    this.currentTarget = props.CurrentTarget;
    this.onNewShape = props.OnNewShape.bind(this);
    this.initDrawEvents = this.initDrawEvents.bind(this);
  }

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    const self = this;
    // Here we have the canvas so we can initialize fabric
    canvas.initialize(el, {
      height: 300,
      width: 300
    });

    //    canvas.loadFromJSON(props.CanvasData);

    // // on mouse up lets save some state
    // this.canvas.on("mouse:up", () => {
    //   reactor.dispatch(keys.fabricData, fabricCanvas.toObject());
    //   reactor.dispatch(keys.activeObject, !!fabricCanvas.getActiveObject());
    // });

    // // an event we will fire when we want to save state
    // fabricCanvas.on("saveData", () => {
    //   reactor.dispatch(keys.fabricData, fabricCanvas.toObject());
    //   reactor.dispatch(keys.activeObject, !!fabricCanvas.getActiveObject());
    //   fabricCanvas.renderAll(); // programatic changes we make will not trigger a render in fabric
    // });
  }
  componentWillReceiveProps(props) {
    console.log("receiveprops", props);
    this.currentTool = props.CurrentTool;
    switch (props.CurrentTool) {
      case "DRAW":
        canvas.isDrawingMode = true;
        break;
      case "SELECT":
        canvas.isDrawingMode = false;
        break;

      default:
        break;
    }
    switch (this.currentTool) {
      case "DRAW":
        console.log("set draw");
        if (!this.drawEventsSet) {
          console.log("set draw events");
          this.initDrawEvents();
        }
        break;
      case "SELECT":
        this.destroyDrawEvents();
        this.initSelectionEvents();
        break;
      default:
        break;
    }
  }
  componentDidUpdate(props) {}
  render() {
    return <canvas id="c" />;
  }
}

export default CanvasComponent;
