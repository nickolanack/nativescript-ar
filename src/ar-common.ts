import { Color } from "tns-core-modules/color";
import { EventData } from "tns-core-modules/data/observable";
import { ImageSource } from "tns-core-modules/image-source";
import { ContentView } from "tns-core-modules/ui/content-view";
import { Property, View } from "tns-core-modules/ui/core/view";
import { booleanConverter } from "tns-core-modules/ui/core/view-base";
import { FontStyle, FontWeight } from "tns-core-modules/ui/styling/font";

export type ARDebugLevel = "NONE" | "WORLD_ORIGIN" | "FEATURE_POINTS" | "PHYSICS_SHAPES";

export type ARTrackingMode = "WORLD" | "IMAGE" | "FACE";

const debugLevelProperty = new Property<AR, ARDebugLevel>({
  name: "debugLevel",
  defaultValue: "NONE"
});

const trackingModeProperty = new Property<AR, ARTrackingMode>({
  name: "trackingMode",
  defaultValue: "WORLD"
});

const planeMaterialProperty = new Property<AR, string>({
  name: "planeMaterial"
});

const faceMaterialProperty = new Property<AR, string>({
  name: "faceMaterial"
});

const trackingImagesBundleProperty = new Property<AR, string>({
  name: "trackingImagesBundle"
});

const planeOpacityProperty = new Property<AR, number>({
  name: "planeOpacity",
  defaultValue: 0.1
});

const planeDetectionProperty = new Property<AR, ARPlaneDetectionOrientation>({
  name: "planeDetection",
  defaultValue: "NONE"
});

const showStatisticsProperty = new Property<AR, boolean>({
  name: "showStatistics",
  defaultValue: false,
  valueConverter: booleanConverter
});

export interface ARNode {
  id: string;
  position: ARPosition;
  scale?: number | ARScale;
  rotation?: ARRotation;
  ios?: any; /* SCNNode */
  android?: any; /* TODO Anchor? */
  remove(): void;

  // TODO add animate({});
}

export interface ARNodeInteraction {
  touchPosition: ARDimensions2D;
  node: ARCommonNode;
}

export interface ARCommonNode extends ARNode {
  draggingEnabled?: boolean;
  rotatingEnabled?: boolean;
  scalingEnabled?: boolean;

  moveTo?(to: ARPosition): void;

  moveBy?(by: ARPosition): void;

  // TODO implement animations (but also: pass in a duration... so the API needs to change)
  rotateBy?(by: ARRotation, animated?: boolean): void;

  scaleBy?(by: number | ARScale): void;

  scaleTo?(to: number | ARScale): void;

  getPosition(): ARPosition;

  getWorldPosition(): ARPosition;

  setWorldPosition(to: ARPosition): void;

  getDistanceTo(otherPosition: ARPosition): number;

  onTap(touchPosition: ARDimensions2D): void;

  onLongPress(touchPosition: ARDimensions2D): void;

  onPan(touchPosition: ARDimensions2D): void;

  setVisible(visible: boolean): void;

  lookAtWorldPosition(worldPos: ARPosition): void;

  lookAtPosition(localPos: ARPosition): void;

  lookAtNode(node: ARCommonNode): void;

  getPositionOnScreen(): ARDimensions2D;
}

export interface ARVideoNode extends ARCommonNode {
  play(): void;

  pause(): void;

  isPlaying(): boolean;
}

export interface ARAddOptions {
  position: ARPosition;
  scale?: number | ARScale;
  rotation?: ARRotation;
  mass?: number;
  onTap?: (interaction: ARNodeInteraction) => void;
  onLongPress?: (interaction: ARNodeInteraction) => void;
  // onPan?: (interaction: ARNodeInteraction) => void;
  draggingEnabled?: boolean;
  rotatingEnabled?: boolean;
  scalingEnabled?: boolean;
  parentNode?: ARNode;
}

export type ARMaterialWrapMode = "Clamp" | "Repeat" | "ClampToBorder" | "Mirror";

export interface ARMaterialProperty {
  /**
   * Refers to a file in App_Resources.
   */
  contents: string;

  /**
   * Default "Repeat"
   */
  wrapMode?: ARMaterialWrapMode;
}

export interface ARMaterial {
  diffuse?: string | Color | ARMaterialProperty;
  roughness?: string | Color | ARMaterialProperty;
  metalness?: string | Color | ARMaterialProperty;
  normal?: string | Color | ARMaterialProperty;
  specular?: string | Color | ARMaterialProperty;
  emission?: string | Color | ARMaterialProperty;
  transparency?: number;
  /**
   * Default PHYSICALLY_BASED.
   * iOS only.
   */
  lightingModel?: "PHYSICALLY_BASED" | "CONSTANT";
}

export interface ARAddGeometryOptions extends ARAddOptions {
  materials?: Array<string | Color | ARMaterial>;
}

export interface ARUIViewOptions extends ARAddOptions {
  chamferRadius?: number;
  dimensions?: number | ARDimensions2D;
  view: View;
}

export interface ARAddImageOptions extends ARAddOptions {
  image: string | ImageSource;
  dimensions?: ARDimensions2D;
  font?:string;
  fontSize?:number;
  fontWeight?:FontWeight;
  fontStyle?:FontStyle;
  fontColor?:Color|string;
}

export interface ARAddModelOptions extends ARAddGeometryOptions {
  name: string;
  childNodeName?: string;
}

export interface ARAddVideoOptions extends ARAddOptions {
  video: any;
  loop?: boolean;
  play?: boolean;
  dimensions?: ARDimensions2D;
}

export interface ARAddBoxOptions extends ARAddGeometryOptions {
  dimensions: number | ARDimensions;
  /**
   * iOS only
   */
  chamferRadius?: number;
}

export interface ARAddPlaneOptions extends ARAddGeometryOptions {
  dimensions: number | ARDimensions2D;
}

export interface ARAddSphereOptions extends ARAddGeometryOptions {
  radius: number;
  segmentCount?: number;
}

export interface ARAddTextOptions extends ARAddGeometryOptions {
  /**
   * iOS: DefaultHelvetica 36 point.
   */
  // font?: string;
  text: string;
  /**
   * Leaving this out, or specifying 0.0 means 2D text is added.
   */
  depth?: number;
}

export interface ARAddTubeOptions extends ARAddGeometryOptions {
  innerRadius: number;
  outerRadius: number;
  height: number;
  radialSegmentCount?: number;
  heightSegmentCount?: number;
}

export interface ARPlane extends ARNode {
}

export interface AREventData extends EventData {
  object: AR;
}

export interface ARLoadedEventData extends AREventData {
  ios?: any; /* ARSCNView */
  android?: any; /* org.nativescript.tns.arlib.TNSSurfaceRenderer */
}

export interface ARPlaneTappedEventData extends AREventData {
  position: ARPosition;
}

export interface ARSceneTappedEventData extends AREventData {
  position: ARPosition;
}

export interface ARPlaneDetectedEventData extends AREventData {
  plane: ARPlane;
}

export interface ARTrackingImageDetectedEventData extends AREventData {
  position: ARPosition;
  size: ARSize;
  imageName: string;
  imageTrackingActions: ARImageTrackingActions;
}

export type ARTrackingFaceEventType = "FOUND" | "UPDATED" | "LOST";

export type ARPlaneDetectionOrientation = "NONE" | "HORIZONTAL" | "VERTICAL";

export interface ARTrackingFaceEventData extends AREventData {
  eventType: ARTrackingFaceEventType;

  /**
   * Set when eventType is either "FOUND" or "UPDATED".
   * Only available on iOS.
   */
  properties?: {
    eyeBlinkLeft: number;
    eyeBlinkRight: number;
    jawOpen: number;
    lookAtPoint: ARPosition;
    mouthFunnel: number;
    mouthSmileLeft: number;
    mouthSmileRight: number;
    tongueOut: number;
  };

  /**
   * Set when eventType is "FOUND".
   */
  faceTrackingActions?: ARFaceTrackingActions;
}

export interface ARFaceTrackingActions {
  /**
   * On Android there can be only 1 active model (I think).
   * @param options
   */
  addModel(options: ARAddModelOptions): Promise<ARCommonNode>;

  addText(options: ARAddTextOptions): Promise<ARCommonNode>;

  addUIView(options: ARUIViewOptions): Promise<ARCommonNode>;
}

export interface ARImageTrackingOptions {
  image: string;
  width?: number;
  name?: string;
  onDetectedImage?: (args: ARTrackingImageDetectedEventData) => void;
}

export interface ARImageTrackingActions {
  playVideo(url: string, loop?: boolean): void;

  stopVideoLoop(): void;

  addBox(options: ARAddBoxOptions): Promise<ARCommonNode>;

  addModel(options: ARAddModelOptions): Promise<ARCommonNode>;

  addImage(options: ARAddImageOptions): Promise<ARCommonNode>;

  addUIView(options: ARUIViewOptions): Promise<ARCommonNode>;

  addNode(options: ARAddOptions): Promise<ARCommonNode>;
}

export class ARDimensions {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class ARDimensions2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class ARSize {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

export class ARScale extends ARDimensions {
  // same as super
}

export class ARPosition extends ARDimensions {
  // same as super
}

export class ARRotation extends ARDimensions {
  // same as super
}

export abstract class AR extends ContentView {
  static arLoadedEvent: string = "arLoaded";
  static sceneTappedEvent: string = "sceneTapped";
  static planeDetectedEvent: string = "planeDetected";
  static planeTappedEvent: string = "planeTapped";
  static trackingImageDetectedEvent: string = "trackingImageDetected";
  static trackingFaceDetectedEvent: string = "trackingFaceDetected";

  faceMaterial: string;
  planeMaterial: string;
  planeOpacity: number;
  planeDetection: ARPlaneDetectionOrientation;
  showStatistics: boolean;
  trackingMode: ARTrackingMode;
  trackingImagesBundle: string;

  static isSupported(): boolean {
    return false;
  }

  static isImageTrackingSupported(): boolean {
    return true;
  }

  static isFaceTrackingSupported(): boolean {
    return true;
  }

  /**
   * This one seems to need work, so not documented yet.
   */
  abstract reset(): void;

  abstract addNode(options: ARAddOptions): Promise<ARCommonNode>;

  abstract addPlane(options: ARAddPlaneOptions): Promise<ARCommonNode>;

  abstract addModel(options: ARAddModelOptions): Promise<ARCommonNode>;

  abstract trackImage(options: ARImageTrackingOptions): void;

  abstract addVideo(options: ARAddVideoOptions): Promise<ARVideoNode>;

  abstract addImage(options: ARAddImageOptions): Promise<ARCommonNode>;

  abstract addBox(options: ARAddBoxOptions): Promise<ARCommonNode>;

  abstract addSphere(options: ARAddSphereOptions): Promise<ARCommonNode>;

  abstract addText(options: ARAddTextOptions): Promise<ARCommonNode>;

  abstract addTube(options: ARAddTubeOptions): Promise<ARCommonNode>;

  abstract addUIView(options: ARUIViewOptions): Promise<ARCommonNode>;

  abstract setPlaneDetection(to: ARPlaneDetectionOrientation): void;

  abstract toggleStatistics(on: boolean): void;

  abstract togglePlaneVisibility(on: boolean): void;

  abstract getCameraPosition(): ARPosition;

  abstract getCameraRotation(): ARRotation;

  abstract setDebugLevel(to: ARDebugLevel): void;

  abstract grabScreenshot(): Promise<ImageSource>;

  abstract startRecordingVideo(): Promise<boolean>;

  abstract stopRecordingVideo(): Promise<string>;

  [debugLevelProperty.setNative](value?: ARDebugLevel) {
    if (value) {
      this.setDebugLevel(value);
    }
  }

  [trackingModeProperty.setNative](value: ARTrackingMode) {
    this.trackingMode = value;
  }

  [planeMaterialProperty.setNative](value: string) {
    this.planeMaterial = value;
  }

  [faceMaterialProperty.setNative](value: string) {
    this.faceMaterial = value;
  }

  [trackingImagesBundleProperty.setNative](value: string) {
    this.trackingImagesBundle = value;
  }

  [planeDetectionProperty.setNative](value: ARPlaneDetectionOrientation) {
    this.planeDetection = value;
  }

  [showStatisticsProperty.setNative](value: boolean) {
    this.showStatistics = value;
  }

  [planeOpacityProperty.setNative](value: number) {
    if (!isNaN(value)) {
      this.planeOpacity = +value;
    }
  }
}

showStatisticsProperty.register(AR);
planeDetectionProperty.register(AR);
debugLevelProperty.register(AR);
trackingModeProperty.register(AR);
trackingImagesBundleProperty.register(AR);
faceMaterialProperty.register(AR);
planeMaterialProperty.register(AR);
planeOpacityProperty.register(AR);
