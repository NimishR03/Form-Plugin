/*
  The getLayout() fucnction returns an object which contains the orientation of the form along with atomic and subform elements.
  Detailed working of the function is described in util.ts file along with all the test cases.
*/


import {getLayout} from "./util";

console.log('.........');

const formNode :any = figma.currentPage.selection.find(node => node.name === "Form");

let formLayout = getLayout(formNode); // Return an object with the nested layout of the Form


console.log("Formlayout", formLayout);

figma.closePlugin();  // Close the plugin after execution



