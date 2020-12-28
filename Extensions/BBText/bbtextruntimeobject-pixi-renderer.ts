declare var MultiStyleText: any;

namespace gdjs {
  /**
   * The PIXI.js renderer for the BBCode Text runtime object.
   *
   * @class BBTextRuntimeObjectPixiRenderer
   */
  export class BBTextRuntimeObjectPixiRenderer {
    _object: gdjs.BBTextRuntimeObject;
    _pixiObject: any;

    /**
     * @param runtimeObject The object to render
     * @param runtimeScene The gdjs.RuntimeScene in which the object is
     */
    constructor(
      runtimeObject: gdjs.BBTextRuntimeObject,
      runtimeScene: gdjs.RuntimeScene
    ) {
      this._object = runtimeObject;

      // Load (or reset) the text
      if (this._pixiObject === undefined) {
        this._pixiObject = new MultiStyleText(runtimeObject._text, {
          default: {
            fontFamily: runtimeScene
              .getGame()
              .getFontManager()
              .getFontFamily(runtimeObject._fontFamily),
            fontSize: runtimeObject._fontSize + 'px',
            fill: gdjs.rgbToHexNumber(
              runtimeObject._color[0],
              runtimeObject._color[1],
              runtimeObject._color[2]
            ),
            tagStyle: 'bbcode',
            wordWrap: runtimeObject._wordWrap,
            wordWrapWidth: runtimeObject._wrappingWidth,
            align: runtimeObject._align,
          },
        });
      } else {
        this.updateColor();
        this.updateAlignment();
        this.updateFontFamily();
        this.updateFontSize();
      }
      runtimeScene
        .getLayer('')
        .getRenderer()
        .addRendererObject(this._pixiObject, runtimeObject.getZOrder());

      // Set the anchor in the center, so that the object rotates around
      // its center
      this._pixiObject.anchor.x = 0.5;
      this._pixiObject.anchor.y = 0.5;
      this.updateText();
      this.updatePosition();
      this.updateAngle();
      this.updateOpacity();
    }

    getRendererObject() {
      return this._pixiObject;
    }

    updateWordWrap(): void {
      this._pixiObject._style.wordWrap = this._object._wordWrap;
      this._pixiObject.dirty = true;
      this.updatePosition();
    }

    updateWrappingWidth(): void {
      this._pixiObject._style.wordWrapWidth = this._object._wrappingWidth;
      this._pixiObject.dirty = true;
      this.updatePosition();
    }

    updateText(): void {
      this._pixiObject.text = this._object._text;
      this.updatePosition();
    }

    updateColor(): void {
      this._pixiObject.textStyles.default.fill = gdjs.rgbToHexNumber(
        this._object._color[0],
        this._object._color[1],
        this._object._color[2]
      );
      this._pixiObject.dirty = true;
    }

    updateAlignment(): void {
      this._pixiObject._style.align = this._object._align;
      this._pixiObject.dirty = true;
    }

    updateFontFamily(): void {
      this._pixiObject.textStyles.default.fontFamily = this._object._runtimeScene
        .getGame()
        .getFontManager()
        .getFontFamily(this._object._fontFamily);
      this._pixiObject.dirty = true;
    }

    updateFontSize(): void {
      this._pixiObject.textStyles.default.fontSize =
        this._object._fontSize + 'px';
      this._pixiObject.dirty = true;
    }

    updatePosition(): void {
      this._pixiObject.position.x = this._object.x + this._pixiObject.width / 2;
      this._pixiObject.position.y =
        this._object.y + this._pixiObject.height / 2;
    }

    updateAngle(): void {
      this._pixiObject.rotation = gdjs.toRad(this._object.angle);
    }

    updateOpacity(): void {
      this._pixiObject.alpha = this._object._opacity / 255;
    }

    getWidth(): float {
      return this._pixiObject.width;
    }

    getHeight(): float {
      return this._pixiObject.height;
    }
  }

  // @ts-ignore - Register the class to let the engine use it.
  export const BBTextRuntimeObjectRenderer = BBTextRuntimeObjectPixiRenderer;
  export type BBTextRuntimeObjectRenderer = BBTextRuntimeObjectPixiRenderer;
}