import { isArray } from "lodash";
const repo = new WeakMap();

const ShapeLayerService = {
  upsert: (shape, layer) => {
    if (!isArray(shape)) shape = [shape];
    var got = shape;
    if (repo.has(layer)) {
      got = repo.get();
      got = [...got, shape];
    }
    repo.set(layer, got);
  },
  get: () => repo
};

export default ShapeLayerService;
