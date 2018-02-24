var PhaserTextureAtlasData = function() {

  /**
   * @see PIXI.BaseTexture
   */
  this._renderTexture = null;

  dragonBones.TextureAtlasData.call(this);
};

PhaserTextureAtlasData.prototype = Object.create(
  dragonBones.TextureAtlasData.prototype
);

PhaserTextureAtlasData.prototype.constructor = PhaserTextureAtlasData;

PhaserTextureAtlasData.prototype.toString = function() {
  return "[class dragonBones.PhaserTextureAtlasData]";
};

PhaserTextureAtlasData.prototype._onClear = function() {
  dragonBones.TextureAtlasData.prototype._onClear.call(this);
  if (this._renderTexture !== null) {
    // this._renderTexture.dispose();
  }
  this._renderTexture = null;
};

PhaserTextureAtlasData.prototype.createTexture = function() {
  return dragonBones.BaseObject.borrowObject(PhaserTextureData);
};

Object.defineProperty(PhaserTextureAtlasData.prototype, "renderTexture", {
  get: function() {
    return this._renderTexture;
  },
  set: function(value) {
    if (this._renderTexture === value) {
      return;
    }
    this._renderTexture = value;
    if (this._renderTexture !== null) {
      for (var k in this.textures) {
        var textureData = this.textures[k];
        textureData.renderTexture = new PIXI.Texture(
          this._renderTexture,
          textureData.region, // No need to set frame.
          textureData.region,
          new PIXI.Rectangle(
            0,
            0,
            textureData.region.width,
            textureData.region.height
          )
        ); // Phaser-ce can not support texture rotate. TODO
      }
    } else {
      for (var k in this.textures) {
        var textureData = this.textures[k];
        textureData.renderTexture = null;
      }
    }
  },
  enumerable: true,
  configurable: true
});

dragonBones.PhaserTextureAtlasData = PhaserTextureAtlasData;
