import { checkLabel } from "./helpers/checkLabel";
import { isParentofAtomic } from "./helpers/isParent";
import { isTextLayer, isFrameAllText } from "./helpers/isText";
import { obtainName } from "./helpers/obtainFieldNames";

export function getLayoutDisplay(node) {
  if (isTextLayer(node) || isFrameAllText(node)) {
    // Check for condition 1&2 for invalid frames
    return null;
  }
  if (checkLabel(node)) {
    // Check for atomic
    return obtainName(node);
  }
  if (isParentofAtomic(node)) {
    let fields = [] as (object | string)[]; // Array for output
    let orientation = 0;
    let xmap = new Array();
    if (node.children) {
      for (const item of node.children) {
        if (isParentofAtomic(item) || checkLabel(item)) {
          xmap.push(item);
        }
      }
    }
    if (node.layoutMode === "NONE") {
      xmap = xmap.reverse();
    }
    // Check for orientaton using map, if all are same in x direction, the xmap will have size 1.
    if (xmap.length <= 1) {
      const childLayout = getLayoutDisplay(xmap[0]); // Recurse the function over the children of node
      if (!!childLayout) {
        return childLayout;
      } else {
        return null;
      }
    } else {
      for (let i = 1; i < xmap.length; i++) {
        if (Math.abs(xmap[i].x - xmap[i - 1].x) > 5) {
          orientation = 1;
        }
      }
      if (orientation === 0) {
        orientation = 2;
      }
    }

    let subFields = [] as (object | string)[];
    const childLayout = getLayoutDisplay(xmap[0]);
    if (!!childLayout) {
      subFields.push(childLayout);
    }
    for (let i = 1; i < xmap.length; i++) {
      if (xmap[i].x - xmap[i - 1].x > 5) {
        const childLayout = getLayoutDisplay(xmap[i]);
        if (!!childLayout) {
          subFields.push(childLayout);
        }
      } else {
        if (subFields.length === 1) {
          fields.push(subFields[0]);
        } else {
          fields.push(createObjDisplay(node, 1, subFields));
        }
        subFields.length = 0;
        const childLayout = getLayoutDisplay(xmap[i]);
        if (!!childLayout) {
          subFields.push(childLayout);
        }
      }
    }
    if (subFields.length === 1) {
      fields.push(subFields[0]);
    } else {
      fields.push(createObjDisplay(node.name, 1, subFields));
    }
    if (fields.length === 1) {
      return fields[0];
    }
    return createObjDisplay(node.name, 2, fields); // Add object denoting a subform
  }
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
