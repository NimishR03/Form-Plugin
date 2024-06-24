import { checkLabel } from "./checkLabel";
import { convertToAllCaps } from "./convertCasing";

export function obtainFormName(node) {
  return node.name;
}

export function obtainType(node) {
  // Provides the type for Atomic nodes
  let inputType = "";
  if (node.children) {
    for (const layer of node.children) {
      // Gives the type of object as it runs on Atomic elements only
      if (convertToAllCaps(layer.name) !== "LABEL") {
        inputType = layer.name;
      }
    }
  }
  return inputType;
}

export function obtainName(node) {
  let inputType = "";
  if (node.children) {
    for (const layer of node.children) {
      // Gives the type of object as it runs on Atomic elements only
      if (convertToAllCaps(layer.name) === "LABEL") {
        if (layer.type !== "TEXT" && layer.children) {
          for (const item of layer.children) {
            // Gives the type of object as it runs on Atomic elements only
            if (item.type === "TEXT") {
              inputType = item.characters;
            }
          }
        } else {
          inputType = layer.characters;
        }
      }
    }
  }
  return inputType;
}
export function obtainPlaceholder(node) {
  let inputType = "";
  if (node.children) {
    for (const layer of node.children) {
      // Gives the type of object as it runs on Atomic elements only
      if (convertToAllCaps(layer.name) !== "LABEL") {
        if (layer.type !== "TEXT" && layer.children) {
          for (const item of layer.children) {
            // Gives the type of object as it runs on Atomic elements only
            if (item.type === "TEXT") {
              inputType = item.characters;
            }
          }
        } else {
          inputType = layer.characters;
        }
      }
    }
  }
  return inputType;
}
export function obtainTitle(node) {
  let inputType = "";
  if (node.children) {
    for (const layer of node.children) {
      if (!checkLabel(layer)) {
        if (layer.type === "TEXT") {
          inputType = layer.characters;
        }
      }
    }
  }
  return inputType;
}
