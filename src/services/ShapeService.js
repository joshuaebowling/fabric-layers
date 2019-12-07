import { keys } from "lodash";

const ShapeRepository = function() {
  const self = this;
  self._repo = {};
  self.get = shape => self._repo[shape.id];
  self.add = shape => {
    shape.id = self.getNextId();
    self._repo[shape.id] = shape;
  };
  self.getNextId = () => keys(self._repo).length + 1;
};

const shapeRepo = new ShapeRepository();

const ShapeService = {
  addShape: shape => shapeRepo.add(shape),
  get: id => shapeRepo.get(id),
  getAll: () => shapeRepo._repo
};

export default ShapeService;
