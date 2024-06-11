import JSZip from 'jszip';
import { getLayout } from "./util";
import { generateLayout } from './layout';
import { generateConstants } from './constants';
import { getLayoutDisplay } from './extra';
import { generatefieldConfigMap, obtainFieldConfigMap } from './useFieldConfigMap';

figma.showUI(__html__,{ width: 400, height: 500 });
const formNode = figma.currentPage.selection.find(node => node.name === "Form");
const formLayout = getLayout(formNode);
const formLayoutDisplay = getLayoutDisplay(formNode);
const layoutCode = generateLayout(formLayout); 
const constantsCode = generateConstants(formLayout);
const configMapCode = generatefieldConfigMap(formLayout);

console.log(configMapCode);

figma.ui.onmessage = (msg) => {
  if (msg.type === 'uiReady') {

    let jsonString = JSON.stringify(formLayoutDisplay);
    figma.ui.postMessage({type:"json", jsonString});
  } else if (msg.type === 'Download') {
    handleGenerateDownload();
  }
};


async function handleGenerateDownload() {
    console.log(JSON.stringify(formLayout));

    //console.log(layoutCode);
    const zip = new JSZip();
    zip.file("layout.ts", layoutCode);
    zip.file("constants.ts", constantsCode);
    zip.file("hooks/useFieldConfigMap.ts",configMapCode);

    const base64String = await zip.generateAsync({ type: "base64" });

    figma.ui.postMessage({ type: 'downloadZip', base64String });
}