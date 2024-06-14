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



export function getLayout(node){

  if(isTextLayer(node) || isFrameAllText(node)){ // Check for condition 1&2 for invalid frames
    return null;
  }
  if(checkLabel(node)){ // Check for atomic
    return node;
  }
  let fields = [] as (object | string)[]; // Array for output
  let numberOfValid = 0;
  if(node.children){
    for(const item of node.children){
      const childLayout = getLayout(item); // Recurse the function over the children of node
      if(!!childLayout){
        fields.push(childLayout);
        numberOfValid++;
      }
    }
  }
  if (numberOfValid === 1){ // If only 1 valid child pass it above
    return fields[0];
  }
  return createObj(node.name,orientation(node),fields); // Add object denoting a subform
}



export function orientation(node){ // Provides the orientation of form
  const xmap= new Map(); 
  const ymap= new Map();
  if(node.children){
    for(const item of node.children){
      xmap.set(item.x , '1');
      ymap.set(item.y , '1');
    }
  }
  // Check for orientaton using map, if all are same in x direction, the xmap will have size 1.
  if(xmap.size > 1){
    return 1;
  }
  return 2;
}

export function checkLabel(node){ // Checks for Atomic Frame
  if(node.children){ 
    for (const layer of node.children) { // Checks for label in the children of the node
      if(layer.name === "Label"){
        return true;
      }
    }
  }
  return false;
}

export function isFrameAllText(layer){ // Checks if all children are text type
  if(layer.children){
    let bool = true;
    for (const subLayer of layer.children) { 
      bool = bool && isTextLayer(subLayer);
    }
    return bool;
  }
  return false;
}

export function isTextLayer(layer){ // Checks if current node is Text
  if(layer.type === "TEXT"){
    return true;
  }
  return false;
}


export function obtainType(node){ // Provides the type for Atomic nodes
  let inputType ="";
  if(node.children){
    for (const layer of node.children) { // Gives the type of object as it runs on Atomic elements only
      if(layer.name !== "Label"){
        inputType=layer.name;
      }
    }
  }
  return inputType;
}

export function obtainName(node){
  let inputType ="";
  if(node.children){
    for (const layer of node.children) { // Gives the type of object as it runs on Atomic elements only
      if(layer.name === "Label"){
        if(layer.type !== "TEXT" && layer.children){
          for (const item  of layer.children) { // Gives the type of object as it runs on Atomic elements only
            if(item.type === "TEXT"){
              inputType=item.characters;
            }
          }
        }
        else{
          inputType= layer.characters;
        }
      }
    }
  }
  return inputType;
}
export function obtainPlaceholder(node){
  let inputType ="";
  if(node.children){
    for (const layer of node.children) { // Gives the type of object as it runs on Atomic elements only
      if(layer.name !== "Label"){
        if(layer.type !== "TEXT" && layer.children){
          for (const item  of layer.children) { // Gives the type of object as it runs on Atomic elements only
            if(item.type === "TEXT"){
              inputType=item.characters;
            }
          }
        }
        else{
          inputType= layer.characters;
        }
      }
    }
  }
  return inputType;
}
  


export function createObj (name,orientation,children){ // Creates the object with its direction and Children array
  if(orientation===1){
    return {
      "direction" : "horizontal",
      "children" : children,
      "name": name
    }
  }
  else{
    return {
      "direction" : "vertical",
      "children" : children,
      "name": name
    }
  }
}

export function converttoCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '') // Remove non-alphanumeric characters
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, ''); // Remove spaces
}

export function convertToUpperSnakeCase(str: string): string {
  return str
    .toUpperCase() // Convert the string to uppercase
    .replace(/\s+/g, '_'); // Replace all spaces with underscores
}

export function obtainFormName(node) {
  return node.name;
}