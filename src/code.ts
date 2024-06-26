/*
 */

//ZipFileMaker
import JSZip from "jszip";

//helpers
import { getLayout } from "./helpers/getLayout";
import { generateLayout } from "./layout";
import { generateConstants } from "./constants";
import { generatefieldConfigMap } from "./useFieldConfigMap";
import { generateFormCode } from "./form";
import { generateIndexCode } from ".";
import { getLayoutDisplay } from "./display";
import { generateValidation } from "./validation";
import { obtainFormName } from "./helpers/obtainFieldNames";

figma.showUI(__html__, { width: 400, height: 500 });
const formNode = figma.currentPage.selection.find((node) =>
  node.name.endsWith("Form")
);

const formLayout = getLayout(formNode);
const formLayoutDisplay = getLayoutDisplay(formNode);

const layoutCode = generateLayout(formLayout);
const constantsCode = generateConstants(formLayout);
const configMapCode = generatefieldConfigMap(formLayout);
const formCode = generateFormCode(formNode);
const indexCode = generateIndexCode(formNode);
const validationCode = generateValidation(formLayout);

figma.ui.onmessage = (msg) => {
  if (msg.type === "uiReady") {
    let jsonString = JSON.stringify(formLayoutDisplay);
    figma.ui.postMessage({ type: "json", jsonString });
  } else if (msg.type === "Download") {
    handleGenerateDownload();
  }
};

async function handleGenerateDownload() {
  const zip = new JSZip();
  zip.file("layout.ts", layoutCode);
  zip.file("constants.ts", constantsCode);
  zip.file("hooks/useFieldConfigMap.ts", configMapCode);
  zip.file(`${obtainFormName(formNode)}.tsx`, formCode);
  zip.file("index.tsx", indexCode);
  zip.file("validation.ts", validationCode);
  const base64String = await zip.generateAsync({ type: "base64" });
  figma.ui.postMessage({ type: "downloadZip", base64String });
}
