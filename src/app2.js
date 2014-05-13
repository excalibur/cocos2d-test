var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        var size = cc.director.getWinSize();

        var spritebatch = cc.SpriteBatchNode.create(res.s_Hero_png);    //读取我们需要的图片 
        cc.spriteFrameCache.addSpriteFrame(res.s_Hero_plist,"aaa");
        cc.animationCache.addAnimation("res.s_Hero_plist","aa");
        cc.Sprite.create("aaa",);
        return true;
    }
});


var HelloWorldScene = cc.Scene.extend({
    world: null,
    onEnter:function () {
        this._super();
        // var layer = new cc.Layer();
        // console.log(layer);
        // this.addChild(layer);
        
        var layer = new HelloWorldLayer();


        this.addChild(layer);
    }
});

