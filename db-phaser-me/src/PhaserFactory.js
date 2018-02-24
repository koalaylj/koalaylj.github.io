var PhaserFactory = function(game,dataParser) {

  this.game = game;
  dragonBones.BaseFactory.call(this, dataParser);

  var eventManager = new dragonBones.PhaserArmatureDisplay(game);
  this._dragonBones = new dragonBones.DragonBones(
    eventManager
  );
};

PhaserFactory.prototype = Object.create(dragonBones.BaseFactory.prototype);
PhaserFactory.prototype.constructor = PhaserFactory;

PhaserFactory.prototype.toString = function() {
  return "[class dragonBones.PhaserFactory]";
};

// Object.defineProperty(PhaserFactory, "factory", {
//   get: function() {
//     if (PhaserFactory._factory === null) {
//       PhaserFactory._factory = new PhaserFactory();
//     }
//     return PhaserFactory._factory;
//   },
//   enumerable: true,
//   configurable: true
// });

PhaserFactory.prototype._isSupportMesh = function() {
  console.warn("Phaser-ce can not support mesh.");
  return false;
};

PhaserFactory.prototype._buildTextureAtlasData = function(
  textureAtlasData,
  textureAtlas
) {
  if (textureAtlasData) {
    textureAtlasData.renderTexture = textureAtlas;
  } else {
    textureAtlasData = dragonBones.BaseObject.borrowObject(
      dragonBones.PhaserTextureAtlasData
    );
  }
  return textureAtlasData;
};

PhaserFactory.prototype._buildArmature = function(dataPackage) {
  var armature = dragonBones.BaseObject.borrowObject(dragonBones.Armature);
  var armatureDisplay = new dragonBones.PhaserArmatureDisplay(this.game);
  armature.init(
    dataPackage.armature,
    armatureDisplay,
    armatureDisplay,
    this._dragonBones
  );
  return armature;
};

PhaserFactory.prototype._buildSlot = function(
  dataPackage,
  slotData,
  displays,
  armature
) {
  // tslint:disable-next-line:no-unused-expression
  dataPackage;
  // tslint:disable-next-line:no-unused-expression
  armature;
  var slot = dragonBones.BaseObject.borrowObject(dragonBones.PhaserSlot);
  var rawDisplay = new Phaser.Image(
    this.game,
    0.0,
    0.0,
    Phaser.Cache.DEFAULT
  );
  slot.init(slotData, displays, rawDisplay, rawDisplay);
  return slot;
};

/**
 * - 通过缓存的 DragonBonesData 实例和 TextureAtlasData 实例创建一个骨架，并用 {@link #clock} 更新该骨架。
 * 区别在于由 {@link #buildArmature} 创建的骨架没有 WorldClock 实例驱动。
 * @param armatureName - 骨架数据名称。
 * @param dragonBonesName - DragonBonesData 实例的缓存名称。 （如果未设置，将检索所有的 DragonBonesData 实例，当多个 DragonBonesData 实例中包含同名的骨架数据时，可能无法准确的创建出特定的骨架）
 * @param skinName - 皮肤名称，可以设置一个其他骨架数据名称来共享其皮肤数据。 （如果未设置，则使用默认的皮肤数据）
 * @returns 骨架的显示容器。
 * @version DragonBones 4.5
 * @example
 * <pre>
 *     let armatureDisplay = factory.buildArmatureDisplay("armatureName", "dragonBonesName");
 * </pre>
 * @language zh_CN
 */
PhaserFactory.prototype.buildArmatureDisplay = function(
  armatureName,
  dragonBonesName,
  skinName,
  textureAtlasName
) {
  if (dragonBonesName === void 0) {
    dragonBonesName = "";
  }
  if (skinName === void 0) {
    skinName = "";
  }
  if (textureAtlasName === void 0) {
    textureAtlasName = "";
  }
  var armature = this.buildArmature(
    armatureName,
    dragonBonesName || "",
    skinName || "",
    textureAtlasName || ""
  );
  if (armature !== null) {
    this._dragonBones.clock.add(armature);
    return armature.display;
  }
  return null;
};
/**
 * - 创建带有指定贴图的显示对象。
 * @param textureName 贴图数据名称。
 * @param textureAtlasName 贴图集数据名称。 （如果未设置，将检索所有的贴图集数据）
 * @version DragonBones 3.0
 * @language zh_CN
 */
PhaserFactory.prototype.getTextureDisplay = function(
  textureName,
  textureAtlasName
) {
  if (textureAtlasName === void 0) {
    textureAtlasName = null;
  }
  var textureData = this._getTextureData(
    textureAtlasName !== null ? textureAtlasName : "",
    textureName
  );
  if (textureData !== null && textureData.renderTexture !== null) {
    return new Phaser.Sprite(this.game, 0.0, 0.0);
  }
  return null;
};
Object.defineProperty(PhaserFactory.prototype, "soundEventManager", {
  /**
   * - 全局声音事件管理器。
   * 声音事件可以从该管理器统一侦听。
   * @version DragonBones 4.5
   * @language zh_CN
   */
  get: function() {
    return this._dragonBones.eventManager;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(PhaserFactory.prototype, "dragonbones", {
  get: function() {
    return this._dragonBones;
  },
  enumerable: true,
  configurable: true
});

dragonBones.PhaserFactory = PhaserFactory;
