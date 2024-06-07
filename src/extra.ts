import { checkLabel, obtainType } from "./util";

export function obtainChildren(node){
  let inputType = [] as Object[];
  if(node.children){
    for (const layer of node.children) { // Gives the type of object as it runs on Atomic elements only
      if(isParentofAtomic(layer)){
        //inputType.push(getLayout(layer));
      }
      else{
        if(layer.name !== "Label" && !isText(layer)){
          inputType.push(obtainType(layer));
        }
      }
      
    }
  }
  return inputType;
}


export function isText(layer){
    if(isParentofAtomic(layer)||checkLabel(layer)){
      return false;
    }
      if(layer.type === "TEXT"){
        return true;
      }
      else{
        if(layer.children){
          let bool = true;
          for (const subLayer of layer.children) { // Gives the type of object as it runs on Atomic elements only
            bool = bool && isText(subLayer);
          }
          return bool;
        }
      }
    return false;
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
  export function isParentofAtomic(node){ // Checks weather the node is a parent of atomic element or not
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

  /*

let rowNumber=0;
for (const item of fields) { 
  if(item.x === 0){
    rowNumber++;
  }
  console.log(item.name+' is in Row '+rowNumber);
}

*/