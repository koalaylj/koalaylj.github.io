var PhaserTextureData = function() {
  this.renderTexture = null;

  dragonBones.TextureData.call(this);
};

PhaserTextureData.prototype = Object.create(dragonBones.TextureData.prototype);
PhaserTextureData.prototype.constructor = PhaserTextureData;

PhaserTextureData.prototype.toString = function() {
  return "[class dragonBones.PhaserTextureData]";
};

PhaserTextureData.prototype._onClear = function() {
  dragonBones.TextureData.prototype._onClear.call(this);
  if (this.renderTexture !== null) {
    this.renderTexture.destroy(false);
  }
  this.renderTexture = null;
};

dragonBones.PhaserTextureData = PhaserTextureData;
