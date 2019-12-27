import { fromFileOrResource, fromUrl, ImageSource, fromFontIconCode } from "tns-core-modules/image-source";
import { Font } from "tns-core-modules/ui/styling/font";
import { Color } from "tns-core-modules/color";
import { ARAddImageOptions } from "../../ar-common";
import { ARCommonNode } from "./arcommon";

const pixelsPerMeter = 500;

export class ARImage extends ARCommonNode {

  static create(options: ARAddImageOptions, renderer: SCNSceneRenderer): Promise<ARImage> {
    if (typeof options.image === "string") {

      if (options.image.indexOf("://") >= 0) {


        if (options.image.indexOf("font://") >= 0) {           
          return new Promise((resolve)=>{        

            let color=(options.fontColor instanceof Color)?options.fontColor:new Color(options.fontColor||"black")
            options.image =  fromFontIconCode((<string>options.image).split('font://').pop(), new Font(
              options.font||'FontAwesome', options.fontSize||100,  options.fontStyle||'normal', options.fontWeight||"300"), color);
            resolve(ARImage.create(options, renderer));
          });
        }

        return fromUrl(options.image).then(function (image) {
          options.image = image;
          return ARImage.create(options, renderer);
        });
      }
      options.image = fromFileOrResource(options.image);
    }

    return new Promise<ARImage>(async (resolve, reject) => {
      const image = (<ImageSource>options.image).ios;

      if (!options.dimensions) {
        options.dimensions = {
          x: image.size.width / pixelsPerMeter,
          y: image.size.height / pixelsPerMeter
        };
      }

      const dimensions = options.dimensions;

      const materialPlane = SCNPlane.planeWithWidthHeight(-dimensions.x, dimensions.y);


      materialPlane.firstMaterial.diffuse.contents = image;
      materialPlane.firstMaterial.doubleSided = true;

      resolve(new ARImage(options, SCNNode.nodeWithGeometry(materialPlane), renderer));

    });
  }
}
