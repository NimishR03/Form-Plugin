import { checkLabel } from "./checkLabel";

export function isParentofAtomic(node) {
  // Checks weather the node is a parent of atomic element or not
  if (node.children) {
    for (const layer of node.children) {
      if (checkLabel(layer)) {
        return true;
      } else {
        if (isParentofAtomic(layer)) {
          return true;
        }
      }
    }
  }
  return false;
}
