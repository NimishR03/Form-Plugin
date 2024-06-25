/*
This files contains the necessary functions for the code.

The getLayout() function gives the laout of the elements with a array of objects.
The direction is calculated using coordinates, if they are horizontaly oriented, the y value remains same, 
else x value remains same. Then a recursive loop is run on the node to calculate all the atomic elements and subForms.

The checkLabel() function checks if a label field is present under the node so that we can denote it atomic

The obtainChildren() function gives the children for atomic elements

The getChild() function gives all the children under a node

The createObj() function creates the objects for the getLayout function

The isParentofAtomic() Tells if the element is a parent of an atomic element or not

*/
/*
 *  Assumption : Atomic elements will have LABEL parallel to them, based on which we will derive if that is an atomic element or not
 *
 *
 *  getLayout -> recursive function which will be called with mainForm selection as an argument, and will return an object containing
 *               direction and children array
 *
 *
 *
 * Recursion :
 *      Break Cases (Exit Conditions)
 *    1) If particular children(K) is of type TEXT, it will return nothing / flag / false, in order to not include this element in children array - isTextLayer()
 *    2) If particular children(k) is of type FRAME, and all it's immediate children are of type TEXT, it will return nothing / flag / false, in order to not include this element in children array- isFrameText()
 *
 *    If any element has any of the above condition true, it will be considered as invalid element,
 *
 *    3) If particular children(k) has LABEL as it's immediate children, that 'k' is considered to be an atomic element, and it will return a string with 'obtainType' util -
 *    4) If particular children(k) has none of above mentioned condition true, it will be considered as subForm, and it will call getLayout recursive function on all of its children
 *          - If there is only one valid element in immediate children of 'k', it will just return the return value of that particular children as it is. It will not add direction on it's own, as there will not be more than one element for direction to work
 *
 *
 *
 */

import { checkLabel } from "./checkLabel";
import { isParentofAtomic } from "./isParent";
import { isTextLayer, isFrameAllText } from "./isText";

export function getLayout(node) {
  if (isTextLayer(node) || isFrameAllText(node)) {
    // Check for condition 1&2 for invalid frames
    return null;
  }
  if (checkLabel(node)) {
    return node;
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
      const childLayout = getLayout(xmap[0]); // Recurse the function over the children of node
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
    const childLayout = getLayout(xmap[0]);
    if (!!childLayout) {
      subFields.push(childLayout);
    }
    for (let i = 1; i < xmap.length; i++) {
      if (xmap[i].x - xmap[i - 1].x > 5) {
        const childLayout = getLayout(xmap[i]);
        if (!!childLayout) {
          subFields.push(childLayout);
        }
      } else {
        if (subFields.length === 1) {
          fields.push(subFields[0]);
        } else {
          fields.push(createObj(node, 1, subFields));
        }
        subFields.length = 0;
        const childLayout = getLayout(xmap[i]);
        if (!!childLayout) {
          subFields.push(childLayout);
        }
      }
    }
    if (subFields.length === 1) {
      fields.push(subFields[0]);
    } else {
      fields.push(createObj(node, 1, subFields));
    }
    if (fields.length === 1) {
      return fields[0];
    }
    return createObj(node, 2, fields); // Add object denoting a subform
  }
}

export function createObj(node, orientation, children) {
  // Creates the object with its direction and Children array
  if (orientation === 1) {
    return {
      direction: "horizontal",
      children: children,
      node: node,
    };
  } else {
    return {
      direction: "vertical",
      children: children,
      node: node,
    };
  }
}
