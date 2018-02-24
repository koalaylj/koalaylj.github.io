var PhaserSlot = function() {
  dragonBones.Slot.apply(this, arguments);
};

PhaserSlot.prototype = Object.create(dragonBones.Slot.prototype);
PhaserSlot.prototype.constructor = PhaserSlot;

PhaserSlot.prototype.toString = function() {
  return "[class dragonBones.PhaserSlot]";
};

PhaserSlot.prototype._onClear = function() {
  dragonBones.Slot.prototype._onClear.call(this);
  this._textureScale = 1.0;
  this._renderDisplay = null;
};

PhaserSlot.prototype._initDisplay = function(value, isRetain) {
  // tslint:disable-next-line:no-unused-expression
  value;
  // tslint:disable-next-line:no-unused-expression
  isRetain;
};

PhaserSlot.prototype._disposeDisplay = function(value, isRelease) {
  // tslint:disable-next-line:no-unused-expression
  value;
  if (!isRelease) {
    value.destroy(true); // PIXI.DisplayObject.destroy();
  }
};

PhaserSlot.prototype._onUpdateDisplay = function() {
  this._renderDisplay = this._display ? this._display : this._rawDisplay;
};

PhaserSlot.prototype._addDisplay = function() {
  var container = this._armature.display;
  container.addChild(this._renderDisplay);
};

PhaserSlot.prototype._replaceDisplay = function(value) {
  var container = this._armature.display;
  var prevDisplay = value;
  container.addChild(this._renderDisplay);
  container.swapChildren(this._renderDisplay, prevDisplay);
  container.removeChild(prevDisplay);
  this._textureScale = 1.0;
};

PhaserSlot.prototype._removeDisplay = function() {
  this._renderDisplay.parent.removeChild(this._renderDisplay);
};

PhaserSlot.prototype._updateZOrder = function() {
  var container = this._armature.display;
  var index = container.getChildIndex(this._renderDisplay);
  if (index === this._zOrder) {
    return;
  }
  container.addChildAt(this._renderDisplay, this._zOrder);
};

PhaserSlot.prototype._updateVisible = function() {
  this._renderDisplay.visible = this._parent.visible && this._visible;
};

PhaserSlot.prototype._updateBlendMode = function() {
  if (this._renderDisplay instanceof PIXI.Sprite) {
    switch (this._blendMode) {
      case 0 /* Normal */:
        this._renderDisplay.blendMode = PIXI.blendModes.NORMAL;
        break;
      case 1 /* Add */:
        this._renderDisplay.blendMode = PIXI.blendModes.ADD;
        break;
      case 3 /* Darken */:
        this._renderDisplay.blendMode = PIXI.blendModes.DARKEN;
        break;
      case 4 /* Difference */:
        this._renderDisplay.blendMode = PIXI.blendModes.DIFFERENCE;
        break;
      case 6 /* HardLight */:
        this._renderDisplay.blendMode = PIXI.blendModes.HARD_LIGHT;
        break;
      case 9 /* Lighten */:
        this._renderDisplay.blendMode = PIXI.blendModes.LIGHTEN;
        break;
      case 10 /* Multiply */:
        this._renderDisplay.blendMode = PIXI.blendModes.MULTIPLY;
        break;
      case 11 /* Overlay */:
        this._renderDisplay.blendMode = PIXI.blendModes.OVERLAY;
        break;
      case 12 /* Screen */:
        this._renderDisplay.blendMode = PIXI.blendModes.SCREEN;
        break;
      default:
        break;
    }
  }
  // TODO child armature.
};

PhaserSlot.prototype._updateColor = function() {
  this._renderDisplay.alpha = this._colorTransform.alphaMultiplier;
  if (this._renderDisplay instanceof PIXI.Sprite) {
    var color =
      (Math.round(this._colorTransform.redMultiplier * 0xff) << 16) +
      (Math.round(this._colorTransform.greenMultiplier * 0xff) << 8) +
      Math.round(this._colorTransform.blueMultiplier * 0xff);
    this._renderDisplay.tint = color;
  }
  // TODO child armature.
};

PhaserSlot.prototype._updateFrame = function() {
  var meshData = this._display === this._meshDisplay ? this._meshData : null;
  var currentTextureData = this._textureData;
  if (
    this._displayIndex >= 0 &&
    this._display !== null &&
    currentTextureData !== null
  ) {
    var currentTextureAtlasData = currentTextureData.parent;
    if (
      this._armature.replacedTexture !== null &&
      this._rawDisplayDatas !== null &&
      this._rawDisplayDatas.indexOf(this._displayData) >= 0
    ) {
      if (this._armature._replaceTextureAtlasData === null) {
        currentTextureAtlasData = dragonBones.BaseObject.borrowObject(
          dragonBones.PhaserTextureAtlasData
        );
        currentTextureAtlasData.copyFrom(currentTextureData.parent);
        currentTextureAtlasData.renderTexture = this._armature.replacedTexture;
        this._armature._replaceTextureAtlasData = currentTextureAtlasData;
      } else {
        currentTextureAtlasData = this._armature._replaceTextureAtlasData;
      }
      currentTextureData = currentTextureAtlasData.getTexture(
        currentTextureData.name
      );
    }
    var renderTexture = currentTextureData.renderTexture;
    if (renderTexture !== null) {
      if (meshData !== null) {
        // TODO
      } else {
        this._textureScale =
          currentTextureData.parent.scale * this._armature._armatureData.scale;
        var normalDisplay = this._renderDisplay;
        normalDisplay.setTexture(renderTexture);
      }
      this._visibleDirty = true;
      return;
    }
  }
  if (meshData !== null) {
    // TODO
  } else {
    var normalDisplay = this._renderDisplay;
    // normalDisplay.texture = null as any;
    normalDisplay.x = 0.0;
    normalDisplay.y = 0.0;
    normalDisplay.visible = false;
  }
};

PhaserSlot.prototype._updateMesh = function() {
  // TODO
};

PhaserSlot.prototype._updateGlueMesh = function() {
  // TODO
};

PhaserSlot.prototype._updateTransform = function() {
  this.updateGlobalTransform(); // Update transform.
  var transform = this.global;
  if (
    this._renderDisplay === this._rawDisplay ||
    this._renderDisplay === this._meshDisplay
  ) {
    var x =
      transform.x -
      (this.globalTransformMatrix.a * this._pivotX +
        this.globalTransformMatrix.c * this._pivotY);
    var y =
      transform.y -
      (this.globalTransformMatrix.b * this._pivotX +
        this.globalTransformMatrix.d * this._pivotY);
    this._renderDisplay.x = x;
    this._renderDisplay.y = y;
  } else {
    this._renderDisplay.x = transform.x;
    this._renderDisplay.y = transform.y;
  }
  this._renderDisplay.rotation = transform.rotation;
  this._renderDisplay.skew = transform.skew; // Phase can not support skew.
  this._renderDisplay.scale.x = transform.scaleX * this._textureScale;
  this._renderDisplay.scale.y = transform.scaleY * this._textureScale;
};

PhaserSlot.prototype._identityTransform = function() {
  this._renderDisplay.x = 0.0;
  this._renderDisplay.y = 0.0;
  this._renderDisplay.rotation = 0.0;
  this._renderDisplay.skew = 0.0;
  this._renderDisplay.scale.x = 1.0;
  this._renderDisplay.scale.y = 1.0;
};

dragonBones.PhaserSlot = PhaserSlot;
