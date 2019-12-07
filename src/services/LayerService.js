import { keys } from "lodash";

import Layer from "../models/Layer";

const LayerRepository = function() {
  const self = this;
  self._repo = {};
  self.get = layer => self._repo[layer];
  self.add = layer => {
    self._repo[layer] = { id: layer };
  };
  self.getNextId = () => keys(self._repo).length + 1;
};

const layerRepo = new LayerRepository();

const LayerService = {
  add: layer => layerRepo.add(layer),
  get: id => layerRepo.get(id),
  getAll: () => layerRepo._repo,
  getNextId: layerRepo.getNextId
};

export default LayerService;
