import { fromFileOrResource, fromUrl, ImageSource, fromFontIconCode } from "tns-core-modules/image-source";
import { Font } from "tns-core-modules/ui/styling/font";
import { Color } from "tns-core-modules/color";
import { ARAddImageOptions } from "../../ar-common";
import { ARCommonNode } from "./arcommon";

const pixelsPerMeter = 500;

export class ARImage extends ARCommonNode {

  static create(options: ARAddImageOptions, renderer: SCNSceneRenderer): Promise<ARImage> {
    return ARImage.resolveImageOptions(options).then((options)=>{

      return new Promise<ARImage>(async (resolve, reject) => {
        const image = (<ImageSource>options.image).ios;

        if (!options.dimensions) {
          options.dimensions = {
            x: image.size.width / pixelsPerMeter,
            y: image.size.height / pixelsPerMeter
          };
        }

        const dimensions = options.dimensions;

        const materialPlane = SCNPlane.planeWithWidthHeight(dimensions.x, dimensions.y);



        materialPlane.firstMaterial.diffuse.contents = image;


        //materialPlane.firstMaterial.diffuse.contentsTransform= SCNMatrix4Translate(SCNMatrix4Scale(SCNMatrix4Identity, -1, 1, 1), 1, 0, 0);
        materialPlane.firstMaterial.doubleSided = true;

        resolve(new ARImage(options, SCNNode.nodeWithGeometry(materialPlane), renderer));

      });
    });
  }

  public setImage(options: ARAddImageOptions){

     return ARImage.resolveImageOptions(options).then((options)=>{
       return new Promise((resolve, reject)=>{

         const image = (<ImageSource>options.image).ios;

          if (!options.dimensions) {
            options.dimensions = {
              x: image.size.width / pixelsPerMeter,
              y: image.size.height / pixelsPerMeter
            };
          }

          const dimensions = options.dimensions;

          const materialPlane = this.ios.geometry;
          materialPlane.firstMaterial.diffuse.contents = image;
          //materialPlane.firstMaterial.diffuse.contentsTransform= SCNMatrix4Translate(SCNMatrix4Scale(SCNMatrix4Identity, -1, 1, 1), 1, 0, 0);
          materialPlane.firstMaterial.doubleSided = true;
          resolve(this);

       });
     });
  }

  private static resolveImageOptions(options: ImageSource|ARAddImageOptions|string){


    if (typeof options === "string"||options instanceof ImageSource){
      options=<ARAddImageOptions>{
        image:options
      }
    }

    return new Promise((resolve, reject)=>{
      
      if (typeof options.image === "string") {

        if (options.image.indexOf("://") >= 0) {


          if (options.image.indexOf("font://") >= 0) {           
                    

              let color=(options.fontColor instanceof Color)?options.fontColor:new Color(options.fontColor||"black")
              options.image =  fromFontIconCode((<string>options.image).split('font://').pop(), new Font(
                options.font||'FontAwesome', (options.fontSize||0.25)*pixelsPerMeter,  options.fontStyle||'normal', options.fontWeight||"100"), color);
                 options.dimensions={
                   x:options.image.width/pixelsPerMeter, y:options.image.height/pixelsPerMeter
                 }
              resolve(options);
              return;
            
          }

          fromUrl(options.image).then(function (image) {
            options.image = image;
            resolve(options);
          }).catch(reject);
          return
        }
        options.image = fromFileOrResource(options.image);
      }

      resolve(options);

    });

  }
}
