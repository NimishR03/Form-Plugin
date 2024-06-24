import { convertToAllCaps } from "./convertCasing";

export function checkLabel(node) {
  // Checks for Atomic Frame
  if (node.children) {
    for (const layer of node.children) {
      // Checks for label in the children of the node
      if (convertToAllCaps(layer.name) === "LABEL") {
        return true;
      }
    }
  }
  return false;
}

export function isRequired(node) {
  if (node.children) {
    for (const layer of node.children) {
      // Gives the type of object as it runs on Atomic elements only
      if (convertToAllCaps(layer.name) === "LABEL") {
        if (layer.children) {
          for (const subLayer of layer.children) {
            if (convertToAllCaps(subLayer.name) === "REQUIRED") {
              return true;
            }
          }
        }
      }
      return false;
    }
  }
}

export function isInformation(node) {
  if (node.children) {
    for (const layer of node.children) {
      // Gives the type of object as it runs on Atomic elements only
      if (convertToAllCaps(layer.name) === "LABEL") {
        if (layer.children) {
          for (const subLayer of layer.children) {
            if (convertToAllCaps(subLayer.name) === "INFORMATION") {
              return true;
            }
          }
        }
      }
      return false;
    }
  }
}

export function getInformation(node) {
  let information = "";
  if (node.children) {
    for (const layer of node.children) {
      // Gives the type of object as it runs on Atomic elements only
      if (convertToAllCaps(layer.name) === "LABEL") {
        if (layer.children) {
          for (const subLayer of layer.children) {
            if (convertToAllCaps(subLayer.name) === "INFORMATION") {
              if (subLayer.children) {
                for (const item of subLayer.children) {
                  if (item.type === "TEXT") {
                    information = item.characters;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return information;
}
