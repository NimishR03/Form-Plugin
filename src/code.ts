/*
In the Code below we have called a function getLayout() which returns a array of a custom object class
containing the type of the element, its orientation in the form and its children.

It only returns the elements which are either a subform or an atomic field.
*/


import {layerOrder,  getLayout, isParentofAtomic } from "./util";

console.log('.........');

let layerLayout = layerOrder();  // Gives an ordered array of all the layers of the file

let formFields = [] as object[];   // Object array to store the element properties.
for (const node of figma.currentPage.selection) {
  if (node.name == 'Form') {
    formFields = getLayout(node);  // obtain the layout of the form
  }
}

for(const element of formFields){
  if(element.hasOwnProperty('inputType')){
    console.log((element as any).inputType);  // print the layout to console for verifiaction
  }else{
    console.log(element);
  }
}

figma.closePlugin();  // Close the plugin after execution



/*

let rowNumber=0;
for (const item of fields) { 
  if(item.x === 0){
    rowNumber++;
  }
  console.log(item.name+' is in Row '+rowNumber);
}

*/
