import {
  isTextLayer,
  isFrameAllText,
  checkLabel,
  obtainName,
  orientation,
} from "./util";

export function getLayoutDisplay(node) {
  if (isTextLayer(node) || isFrameAllText(node)) {
    // Check for condition 1&2 for invalid frames
    return null;
  }
  if (checkLabel(node)) {
    // Check for atomic
    return obtainName(node);
  }
  let fields = [] as (object | string)[]; // Array for output
  let numberOfValid = 0;
  if (node.children) {
    for (const item of node.children) {
      const childLayout = getLayoutDisplay(item); // Recurse the function over the children of node
      if (!!childLayout) {
        fields.push(childLayout);
        numberOfValid++;
      }
    }
  }
  if (numberOfValid === 1) {
    // If only 1 valid child pass it above
    return fields[0];
  }
  return createObjDisplay(node.name, orientation(node), fields); // Add object denoting a subform
}

export function createObjDisplay(name, orientation, children) {
  // Creates the object with its direction and Children array
  if (orientation === 1) {
    return {
      direction: "Horizontal",
      children: children,
      name: name,
    };
  } else {
    return {
      direction: "Vertical",
      children: children,
      name: name,
    };
  }
}
