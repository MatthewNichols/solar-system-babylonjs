import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui";


export const createZoomButton = (uiLayer: GUI.AdvancedDynamicTexture, buttonName: string, buttonText: string, horizontalAlignment: number, verticalAlignment: number, action: () => void) => {
    const zoomButton = GUI.Button.CreateSimpleButton(buttonName, buttonText);
    zoomButton.height = "60px";
    zoomButton.width = "60px";
    zoomButton.fontSizeInPixels = 60;
    zoomButton.cornerRadius = 1000;
    zoomButton.background = "white";
    
    uiLayer.addControl(zoomButton);
    zoomButton.horizontalAlignment = horizontalAlignment; 
    zoomButton.verticalAlignment = verticalAlignment;
  
    zoomButton.onPointerUpObservable.add(action);
  }
  
  export const setupUI = (cameraControl: BABYLON.TransformNode) => {
    const uiLayer = GUI.AdvancedDynamicTexture.CreateFullscreenUI("Controls");
    createZoomButton(uiLayer, "ZoomIn", "+", GUI.Control.HORIZONTAL_ALIGNMENT_LEFT, GUI.Control.VERTICAL_ALIGNMENT_BOTTOM, () => {
      cameraControl.position.y = cameraControl.position.y - 30;
    });
  
    createZoomButton(uiLayer, "ZoomOut", "-", GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT, GUI.Control.VERTICAL_ALIGNMENT_BOTTOM, () => {
      cameraControl.position.y = cameraControl.position.y + 30;
    });
  
  }