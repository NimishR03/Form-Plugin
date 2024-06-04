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



export function getLayout(node){
  let fields = [] as object[]; // Array for output
  let orientationFlag=0; //Flag for orientation
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
    orientationFlag=1;
  }
  else orientationFlag=2;
  if(isParentofAtomic(node))fields.push(createObj(orientationFlag,obtainChildren(node)));
  if(node.children){
    for(const item of node.children){
      if(checkLabel(item)){ // if it is atomic push into the object array
        fields.push({inputType : obtainType(item)});
      }
      else{
         
        // if it is a parent of atomic push into the object array
        let subLayout = getLayout(item);
        for(const obj of subLayout){ // Carry the objects array through recursion
          fields.push(obj);
        }
      }
    }
  }
  return fields; // return object array
}




export function checkLabel(node){
  if(node.children){ 
    for (const layer of node.children) { // Checks for label in the children of the node
      if(layer.name === "Label"){
        return true;
      }
    }
  }
  return false;
}

export function obtainChildren(node){
  let inputType = [] as SceneNode[];
  if(node.children){
    for (const layer of node.children) { // Gives the type of object as it runs on Atomic elements only
      if(layer.name !== "Label"){
        inputType.push(layer.name);
      }
    }
  }
  return inputType;
}
export function obtainType(node){
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
  
export function getChild(node) {
  let childArray = [] as SceneNode[]; //Gives the Ordered list of all the fields of the layers
  for (const layer of node.children) {
    childArray.push(layer); // The layers are pushed and the DFS goes further.
    if (layer.type == 'COMPONENT' || layer.type == 'FRAME') { 
      let childrenArr = getChild(layer); // recursive call to the function
      for (const item of childrenArr) { 
        childArray.push(item);
      }
    }
  
  }
  return childArray;
}

export function createObj (orientation,children){
  if(orientation===1){
    return {
      "direction" : "Horizontal",
      "children" : children,
    }
  }
  else{
    return {
      "direction" : "Vertical",
      "children" : children,
    }
  }
}

export function layerOrder(){
  let output = [] as SceneNode[];
  for (const node of figma.currentPage.selection) {
    if (node.name == 'Form') {
      output.push(node);
      let childrenArr= getChild(node);
      for (const item of childrenArr) { 
        output.push(item);
      }
    }
  }
  return output;
}
  
export function isParentofAtomic(node){
  if(node.children){
    for (const layer of node.children) {
      if(checkLabel(layer)){
        return true
      }
      else {
        if(isParentofAtomic(layer)){
          return true;
        }
      }
    }
  }
  return false;
}

