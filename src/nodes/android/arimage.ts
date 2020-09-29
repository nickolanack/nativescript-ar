import { fromFileOrResource, fromUrl, ImageSource, fromFontIconCode} from "tns-core-modules/image-source";
import { Font} from "tns-core-modules/ui/styling/font";
import { Color } from "tns-core-modules/color";
import * as utils from "tns-core-modules/utils/utils";
import { ARAddImageOptions } from "../../ar-common";
import { ARCommonNode } from "./arcommon";

const pixelsPerMeter = 500;

export class ARImage extends ARCommonNode {

  static create(options: ARAddImageOptions, fragment): Promise<ARImage> {
    

    return ARImage.resolveImageOptions(options).then((options)=>{

      return new Promise<ARImage>(async (resolve, reject) => {



      const image = (<ImageSource>options.image).android;

      const context = utils.ad.getApplicationContext();
      const imageView = new android.widget.ImageView(context);
      imageView.setImageBitmap(image);

      com.google.ar.sceneform.rendering.ViewRenderable.builder()
          .setView(context, imageView)
          .build()
          .thenAccept(new (<any>java.util).function.Consumer({
            accept: renderable => {

              if (options.dimensions) {
                renderable.setSizer(new com.google.ar.sceneform.rendering.FixedWidthViewSizer(options.dimensions.x));
              } else {
                renderable.setSizer(new com.google.ar.sceneform.rendering.DpToMetersViewSizer(pixelsPerMeter));
              }

              /**
               * pin bottom of view with node, this causes view to expand upward
               * com.google.ar.sceneform.rendering.ViewRenderable.VerticalAlignment.BOTTOM
               */
              renderable.setVerticalAlignment(com.google.ar.sceneform.rendering.ViewRenderable.VerticalAlignment.CENTER);
              const node = ARCommonNode.createNode(options, fragment);
              node.setRenderable(renderable);
              resolve(new ARImage(options, node));
            }
          }))
          .exceptionally(new (<any>java.util).function.Function({
            apply: error => reject(error)
          }));
      });

    });


    
  }


  public setImage(options: ARAddImageOptions){
    return ARImage.resolveImageOptions(options).then((options)=>{

      return new Promise<ARImage>(async (resolve, reject) => {

        const image = (<ImageSource>options.image).android;


        const renderable:com.google.ar.sceneform.rendering.ViewRenderable = <com.google.ar.sceneform.rendering.ViewRenderable>this.android.getRenderable();
          if (options.dimensions) {
                renderable.setSizer(new com.google.ar.sceneform.rendering.FixedWidthViewSizer(options.dimensions.x));
              } else {
                renderable.setSizer(new com.google.ar.sceneform.rendering.DpToMetersViewSizer(pixelsPerMeter));
              }
         (<android.widget.ImageView>renderable.getView()).setImageBitmap(image);
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
          fromUrl(options.image).then(image => {
            options.image = image;
            resolve(options);
          }).catch(reject);
          return;
        }

        options.image = fromFileOrResource(options.image);
      }

      resolve(options);

    });
  }


}


