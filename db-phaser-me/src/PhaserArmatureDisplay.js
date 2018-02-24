var PhaserArmatureDisplay = function(game) {

  this.debugDraw = false;
  this._debugDraw = false;
  this._armature = null;
  this._signals = {};
  this._debugDrawer = null;
  
  Phaser.Sprite.call(this, game, 0.0, 0.0);
};

PhaserArmatureDisplay.prototype = Object.create(Phaser.Sprite.prototype);
PhaserArmatureDisplay.prototype.constructor = PhaserArmatureDisplay;

PhaserArmatureDisplay.prototype.toString = function() {
  return "[class dragonBones.PhaserArmatureDisplay]";
};

PhaserArmatureDisplay.prototype._getChildByName = function(container, name) {
  for (var _i = 0, _a = container.children; _i < _a.length; _i++) {
    var child = _a[_i];
    if (child.name === name) {
      return child;
    }
  }
  return null;
};

PhaserArmatureDisplay.prototype.dbInit = function(armature) {
  this._armature = armature;
};

PhaserArmatureDisplay.prototype.dbClear = function() {
  for (var k in this._signals) {
    var signal = this._signals[k];
    signal.removeAll();
    signal.dispose();
    delete this._signals[k];
  }
  if (this._debugDrawer !== null) {
    // this._debugDrawer.destroy(true);
  }
  // this._armature = null as any;
  // this._debugDrawer = null;
  _super.prototype.destroy.call(this, false);
};

PhaserArmatureDisplay.prototype.dbUpdate = function() {
  var drawed = dragonBones.DragonBones.debugDraw || this.debugDraw;
  if (drawed || this._debugDraw) {
    this._debugDraw = drawed;
    if (this._debugDraw) {
      if (this._debugDrawer === null) {
        this._debugDrawer = new Phaser.Sprite(this.game, 0.0, 0.0);
        var boneDrawer_1 = new Phaser.Graphics(this.game);
        this._debugDrawer.addChild(boneDrawer_1);
      }
      this.addChild(this._debugDrawer);
      var boneDrawer = this._debugDrawer.getChildAt(0);
      boneDrawer.clear();
      var bones = this._armature.getBones();
      for (var i = 0, l = bones.length; i < l; ++i) {
        var bone = bones[i];
        var boneLength = bone.boneData.length;
        var startX = bone.globalTransformMatrix.tx;
        var startY = bone.globalTransformMatrix.ty;
        var endX = startX + bone.globalTransformMatrix.a * boneLength;
        var endY = startY + bone.globalTransformMatrix.b * boneLength;
        boneDrawer.lineStyle(2.0, 0x00ffff, 0.7);
        boneDrawer.moveTo(startX, startY);
        boneDrawer.lineTo(endX, endY);
        boneDrawer.lineStyle(0.0, 0, 0.0);
        boneDrawer.beginFill(0x00ffff, 0.7);
        boneDrawer.drawCircle(startX, startY, 3.0);
        boneDrawer.endFill();
      }
      var slots = this._armature.getSlots();
      for (var i = 0, l = slots.length; i < l; ++i) {
        var slot = slots[i];
        var boundingBoxData = slot.boundingBoxData;
        if (boundingBoxData) {
          var child = this._getChildByName(this._debugDrawer, slot.name);
          if (!child) {
            child = new Phaser.Graphics(this.game);
            child.name = slot.name;
            this._debugDrawer.addChild(child);
          }
          child.clear();
          child.lineStyle(2.0, 0xff00ff, 0.7);
          switch (boundingBoxData.type) {
            case 0 /* Rectangle */:
              child.drawRect(
                -boundingBoxData.width * 0.5,
                -boundingBoxData.height * 0.5,
                boundingBoxData.width,
                boundingBoxData.height
              );
              break;
            case 1 /* Ellipse */:
              child.drawEllipse(
                -boundingBoxData.width * 0.5,
                -boundingBoxData.height * 0.5,
                boundingBoxData.width,
                boundingBoxData.height
              );
              break;
            case 2 /* Polygon */:
              var vertices = boundingBoxData.vertices;
              for (var i_1 = 0, l_1 = vertices.length; i_1 < l_1; i_1 += 2) {
                var x = vertices[i_1];
                var y = vertices[i_1 + 1];
                if (i_1 === 0) {
                  child.moveTo(x, y);
                } else {
                  child.lineTo(x, y);
                }
              }
              child.lineTo(vertices[0], vertices[1]);
              break;
            default:
              break;
          }
          child.endFill();
          slot.updateTransformAndMatrix();
          slot.updateGlobalTransform();
          var transform = slot.global;
          child.x = transform.x;
          child.y = transform.y;
          child.rotation = transform.rotation;
          // child.skew = transform.skew; // TODO
          child.scale.x = transform.scaleX;
          child.scale.y = transform.scaleY;
          child.pivot.x = slot._pivotX;
          child.pivot.y = slot._pivotY;
        } else {
          var child = this._getChildByName(this._debugDrawer, slot.name);
          if (child) {
            this._debugDrawer.removeChild(child);
          }
        }
      }
    } else if (
      this._debugDrawer !== null &&
      this._debugDrawer.parent === this
    ) {
      this.removeChild(this._debugDrawer);
    }
  }
};

PhaserArmatureDisplay.prototype.dispose = function(disposeProxy) {
  if (disposeProxy === void 0) {
    disposeProxy = true;
  }
  // tslint:disable-next-line:no-unused-expression
  disposeProxy;
  if (this._armature !== null) {
    this._armature.dispose();
    this._armature = null;
  }
};

PhaserArmatureDisplay.prototype.destroy = function() {
  this.dispose();
};

PhaserArmatureDisplay.prototype.dispatchDBEvent = function(type, eventObject) {
  if (!(type in this._signals)) {
    this._signals[type] = new Phaser.Signal();
  }
  var signal = this._signals[type];
  signal.dispatch(eventObject);
};

PhaserArmatureDisplay.prototype.hasDBEventListener = function(type) {
  return type in this._signals && this._signals[type].getNumListeners() > 0;
};

PhaserArmatureDisplay.prototype.addDBEventListener = function(
  type,
  listener,
  target
) {
  if (!(type in this._signals)) {
    this._signals[type] = new Phaser.Signal();
  }
  var signal = this._signals[type];
  signal.add(listener, target);
};

PhaserArmatureDisplay.prototype.removeDBEventListener = function(
  type,
  listener,
  target
) {
  if (type in this._signals) {
    var signal = this._signals[type];
    signal.remove(listener, target);
  }
};
Object.defineProperty(PhaserArmatureDisplay.prototype, "armature", {
  get: function() {
    return this._armature;
  },
  enumerable: true,
  configurable: true
});
Object.defineProperty(PhaserArmatureDisplay.prototype, "animation", {
  get: function() {
    return this._armature.animation;
  },
  enumerable: true,
  configurable: true
});

PhaserArmatureDisplay.prototype.hasEvent = function(type) {
  return this.hasDBEventListener(type);
};

PhaserArmatureDisplay.prototype.addEvent = function(type, listener, target) {
  this.addDBEventListener(type, listener, target);
};

PhaserArmatureDisplay.prototype.removeEvent = function(type, listener, target) {
  this.removeDBEventListener(type, listener, target);
};

//TODO hack updateTransform
Phaser.Image.prototype.updateTransform = function(parent) {
  if (!parent && !this.parent && !this.game) {
    return this;
  }
  var p = this.parent;
  if (parent) {
    p = parent;
  } else if (!this.parent) {
    p = this.game.world;
  }
  // create some matrix refs for easy access
  var pt = p.worldTransform;
  var wt = this.worldTransform;
  // temporary matrix variables
  var a, b, c, d, tx, ty;
  // so if rotation is between 0 then we can simplify the multiplication process..
  if (this.rotation % Phaser.Math.PI2) {
    // check to see if the rotation is the same as the previous render. This means we only need to use sin and cos when rotation actually changes
    if (this.rotation !== this.rotationCache) {
      this.rotationCache = this.rotation;
      this._sr = Math.sin(this.rotation);
      this._cr = Math.cos(this.rotation);
    }
    var skew = this.skew % dragonBones.Transform.PI_D; // Support skew.
    if (skew > 0.01 || skew < -0.01) {
      // get the matrix values of the displayobject based on its transform properties..
      a = this._cr * this.scale.x;
      b = this._sr * this.scale.x;
      c = -Math.sin(skew + this.rotation) * this.scale.y;
      d = Math.cos(skew + this.rotation) * this.scale.y;
      tx = this.position.x;
      ty = this.position.y;
    } else {
      // get the matrix values of the displayobject based on its transform properties..
      a = this._cr * this.scale.x;
      b = this._sr * this.scale.x;
      c = -this._sr * this.scale.y;
      d = this._cr * this.scale.y;
      tx = this.position.x;
      ty = this.position.y;
    }
    // check for pivot.. not often used so geared towards that fact!
    if (this.pivot.x || this.pivot.y) {
      tx -= this.pivot.x * a + this.pivot.y * c;
      ty -= this.pivot.x * b + this.pivot.y * d;
    }
    // concat the parent matrix with the objects transform.
    wt.a = a * pt.a + b * pt.c;
    wt.b = a * pt.b + b * pt.d;
    wt.c = c * pt.a + d * pt.c;
    wt.d = c * pt.b + d * pt.d;
    wt.tx = tx * pt.a + ty * pt.c + pt.tx;
    wt.ty = tx * pt.b + ty * pt.d + pt.ty;
  } else {
    // lets do the fast version as we know there is no rotation..
    a = this.scale.x;
    b = 0;
    c = 0;
    d = this.scale.y;
    tx = this.position.x - this.pivot.x * a;
    ty = this.position.y - this.pivot.y * d;
    wt.a = a * pt.a;
    wt.b = a * pt.b;
    wt.c = d * pt.c;
    wt.d = d * pt.d;
    wt.tx = tx * pt.a + ty * pt.c + pt.tx;
    wt.ty = tx * pt.b + ty * pt.d + pt.ty;
  }
  a = wt.a;
  b = wt.b;
  c = wt.c;
  d = wt.d;
  var determ = a * d - b * c;
  if (a || b) {
    var r = Math.sqrt(a * a + b * b);
    this.worldRotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
    this.worldScale.x = r;
    this.worldScale.y = determ / r;
  } else if (c || d) {
    var s = Math.sqrt(c * c + d * d);
    this.worldRotation =
      Phaser.Math.HALF_PI - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
    this.worldScale.x = determ / s;
    this.worldScale.y = s;
  } else {
    this.worldScale.x = 0;
    this.worldScale.y = 0;
  }
  //  Set the World values
  this.worldAlpha = this.alpha * p.worldAlpha;
  this.worldPosition.x = wt.tx;
  this.worldPosition.y = wt.ty;
  // reset the bounds each time this is called!
  this._currentBounds = null;
  //  Custom callback?
  if (this.transformCallback) {
    this.transformCallback.call(this.transformCallbackContext, wt, pt);
  }
  return this;
};

dragonBones.PhaserArmatureDisplay = PhaserArmatureDisplay;
