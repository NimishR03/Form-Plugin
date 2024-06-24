import { checkLabel } from "./checkLabel";
import { isParentofAtomic } from "./isParent";

export function isFrameAllText(layer) {
  // Checks if all children are text type
  if (layer.children) {
    let bool = true;
    for (const subLayer of layer.children) {
      bool = bool && isTextLayer(subLayer);
    }
    return bool;
  }
  return false;
}

export function isTextLayer(layer) {
  // Checks if current node is Text
  if (layer.type === "TEXT") {
    return true;
  }
  return false;
}
export function isText(layer) {
  if (isParentofAtomic(layer) || checkLabel(layer)) {
    return false;
  }
  if (layer.type === "TEXT") {
    return true;
  } else {
    if (layer.children) {
      let bool = true;
      for (const subLayer of layer.children) {
        // Gives the type of object as it runs on Atomic elements only
        bool = bool && isText(subLayer);
      }
      return bool;
    }
  }
  return false;
}
