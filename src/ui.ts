import * as GUI from "babylonjs-gui";
import { UniCam } from "./uni-cam";

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
  
  export const setupUI = async (uniCam: UniCam) => {
    const uiLayer = GUI.AdvancedDynamicTexture.CreateFullscreenUI("Controls");
    await uiLayer.parseFromURLAsync("guiTexture.json");

    const zoomSlider = uiLayer.getControlByName("ZoomSlider") as GUI.Slider;

    zoomSlider.onValueChangedObservable.add((value: number) => {
      console.log(value)
      uniCam.setZoom(value);
    });
  }