
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

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = cc.MenuItemImage.create(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = cc.Menu.create(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        // var helloLabel = cc.LabelTTF.create("！", "Arial", 38);
        // position the label on the center of the screen
        // helloLabel.x = size.width / 2;
        // helloLabel.y = size.height - 40;
        // add the label as a child to this layer
        //this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = cc.Sprite.create(res.Bg_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);


        // 添加主人公
        // ccs.CONST_CONTENT_SCALE = 0;

        ccs.armatureDataManager.addArmatureFileInfo(res.s_Hero_png,res.s_Hero_plist,res.s_Hero_json);
        
        var hero = ccs.Armature.create("girl");
        hero.getAnimation().play("loading"); 
       
        hero.setPosition(cc.p(size.width / 10,size.height / 3));
        this.addChild(hero);


        // 添加怪物
        
        ccs.armatureDataManager.addArmatureFileInfo(res.s_Enemy_png,res.s_Enemy_plist,res.s_Enemy_json);
        
        var enemy = ccs.Armature.create("monster");
        enemy.getAnimation().play("loading"); 
       
        enemy.setPosition(cc.p(size.width - size.width / 7,size.height / 2.5));
        this.addChild(enemy);

        // 声音
        cc.audioEngine.playMusic(res.s_music_background, true);

        // 头部血条
        // ccs.armatureDataManager.addArmatureFileInfo(res.s_FightScene_png,res.s_FightScene_plist,res.s_FightScene_json);
        // var enemy = ccs.Armature.create("monster");

        return true;
    }
});

// 创建一个事件监听器 OneByOne 为单点触摸
var listener1 = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,                       // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没
    onTouchBegan: function (touch, event) {     //实现 onTouchBegan 事件回调函数
        var target = event.getCurrentTarget();  // 获取事件所绑定的 target 

        // 获取当前点击点所在相对按钮的位置坐标
        var locationInNode = target.convertToNodeSpace(touch.getLocation());    
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        if (cc.rectContainsPoint(rect, locationInNode)) {       // 点击范围判断检测
            cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
            target.opacity = 180;
            return true;
        }
        return false;
    },
    onTouchMoved: function (touch, event) {         // 触摸移动时触发
        // 移动当前按钮精灵的坐标位置
        var target = event.getCurrentTarget();
        var delta = touch.getDelta();
        target.x += delta.x;
        target.y += delta.y;
    },
    onTouchEnded: function (touch, event) {         // 点击事件结束处理
        var target = event.getCurrentTarget();
        cc.log("sprite onTouchesEnded.. ");
        target.setOpacity(255);
        if (target == sprite2) {                    // 重新设置 ZOrder，显示的前后顺序将会改变
            sprite1.setLocalZOrder(100);
        } else if (target == sprite1) {
            sprite1.setLocalZOrder(0);
        }
    }
});


// 鼠标点击
var listener2 = cc.EventListener.create({
        event: cc.EventListener.MOUSE,
        onMouseMove: function(event){
            var str = "MousePosition X: " + event.getLocationX() + "  Y:" + event.getLocationY();
            // do something...
            cc.log("onMouseMove.. ");

        },
        onMouseUp: function(event){
            var str = "Mouse Up detected, Key: " + event.getButton();
            // do something...
             cc.log("Mouse Up detected ");
        },
        onMouseDown: function(event){
            var str = "Mouse Down detected, Key: " + event.getButton();
            // do something...
            cc.log("Mouse Down detected");
        },
        onMouseScroll: function(event){
            var str = "Mouse Scroll detected, X: " + event.getLocationX() + "  Y:" + event.getLocationY();
            // do something...
            cc.log("Mouse Scroll detected");
        }
    },this);

var scene;

var HelloWorldScene = cc.Scene.extend({
    world: null,
    onEnter:function () {
        this._super();
        // var layer = new cc.Layer();
        // console.log(layer);
        // this.addChild(layer);
        
        scene = ccs.sceneReader.createNodeWithSceneFile(res.s_FightScene_json);

        // var uiLayer= ccui.Layout.create();
        // uiLayer.scheduleUpdate();

        // this.addChild(uiLayer);

        // var widget = ccs.uiReader.widgetFromJsonFile(res.s_FightScene_json);
        // uiLayer.addChild(widget);
        // 
        // 

        // hero.play("loading"); 
        // cc.eventManager.addListener(listener2, hero);

        //给hero绑定键盘事件
        cc.eventManager.addListener(heroListener, scene);

        // cc.eventManager.addListener(listener2, scene);
        // var layer = new Box2DTestLayer();
        // this.addChild(layer);
        // scene.addChild(layer);
        // 
        // 
        // 
        // box2d 尝试

         var b2Vec2 = Box2D.Common.Math.b2Vec2
            , b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2World = Box2D.Dynamics.b2World
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var screenSize = cc.director.getWinSize();
        //UXLog(L"Screen width %0.2f screen height %0.2f",screenSize.width,screenSize.height);




      
        // 创建一个box2d的世界
        this.world = new b2World(new b2Vec2(0, -10), true);

        // this.world.SetContinuousPhysics(true);

        // var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
        // var debugDraw = new b2DebugDraw();
        // var canvas = document.createElement("canvas");
        // canvas.id = "box2d";
        // canvas.width = document.getElementById('gameCanvas').width;
        // canvas.height = document.getElementById('gameCanvas').height;
        // document.getElementById("Cocos2dGameContainer").appendChild(canvas);
        // debugDraw.SetSprite(canvas
        //         .getContext("2d"));
        // debugDraw.SetDrawScale(30);
        // debugDraw.SetFillAlpha(1);
        // debugDraw.SetFlags(b2DebugDraw.e_shapeBit);
        // this.world.SetDebugDraw(debugDraw);


        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        var bodyDef = new b2BodyDef;

        // 32px = 1米
        //create ground
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(screenSize.width / PTM_RATIO + 2, 2);
        // upper
        bodyDef.position.Set(screenSize.width / PTM_RATIO + 2, screenSize.height / PTM_RATIO + 1.8);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        // bottom
        bodyDef.position.Set(screenSize.width / PTM_RATIO + 2, 4.6);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        fixDef.shape.SetAsBox(2, screenSize.height / PTM_RATIO + 1.8);
        // left
        bodyDef.position.Set(-1.8, screenSize.height / PTM_RATIO + 1.8);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        // right
        bodyDef.position.Set(screenSize.width / PTM_RATIO + 1.8 , screenSize.height / PTM_RATIO + 1.8);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        //Set up sprite

        var hero = scene.getChildByTag(10005);
        var mon = scene.getChildByTag(10006);
        // 设置英雄的大小
        // 
        // this.addHero(hero);
        // 
        var herobodyDef = new Box2D.Dynamics.b2BodyDef;
        herobodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;

        var herofixDef = new Box2D.Dynamics.b2FixtureDef;

        //define basic parameters
        herofixDef.density = 1.0;
        herofixDef.friction = 0.5;
        herofixDef.restitution = 0.2;
        herofixDef.isSensor = false;
        herofixDef.userData = hero;
        


        //define shape
        herofixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(5);


        this.world.CreateBody(herobodyDef).CreateFixture(herofixDef);
        // 怪物
        // this.addNewSpriteWithCoords(mon);
        // this.addChild(hero, 1);

        // this.addChild(mon, 2);

        this.world.SetContactListener(listener);
       


        

        this.addChild(scene);

        this.addNewSpriteWithCoords(cc.p(screenSize.width / 2, screenSize.height / 2));
        this.scheduleUpdate();


    },
    addNewSpriteWithCoords:function (sprite) {
        console.log("-----------");
       
    
        // console.log(sprite.tag == 10006);

        // Define the dynamic body.
        //Set up a 1m squared box in the physics world
        var b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(sprite.x / 32, 4.6);
        bodyDef.userData = sprite;
        var body = this.world.CreateBody(bodyDef);

        // Define another box shape for our dynamic body.
        var dynamicBox = new b2PolygonShape();
        dynamicBox.SetAsBox(0.5, 0.5);//These are mid points for our 1m box

        // Define the dynamic body fixture.
        var fixtureDef = new b2FixtureDef();
        fixtureDef.shape = dynamicBox;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.8;
        body.CreateFixture(fixtureDef);


    },
    addHero:function (sprite) {
        console.log("-----222------");
       
    
        // console.log(sprite.tag == 10006);

        // Define the dynamic body.
        //Set up a 1m squared box in the physics world
        var b2BodyDef = Box2D.Dynamics.b2BodyDef
            , b2Body = Box2D.Dynamics.b2Body
            , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_staticBody;
        // bodyDef.position.Set(2, 8);
        bodyDef.userData = sprite;
        var body = this.world.CreateBody(bodyDef);

        // Define another box shape for our dynamic body.
        var dynamicBox = new b2PolygonShape();
        dynamicBox.SetAsBox(5, 5);//These are mid points for our 1m box

        // Define the dynamic body fixture.
        var fixtureDef = new b2FixtureDef();
        fixtureDef.shape = dynamicBox;
        fixtureDef.density = 1.0;
        fixtureDef.friction = 0.8;
        body.CreateFixture(fixtureDef);


    },
    // box2d 重力
    update:function (dt) {
        //It is recommended that a fixed time step is used with Box2D for stability
        //of the simulation, however, we are using a variable time step here.
        //You need to make an informed choice, the following URL is useful
        //http://gafferongames.com/game-physics/fix-your-timestep/
        var velocityIterations = 8;
        var positionIterations = 1;

        // Instruct the world to perform a single step of simulation. It is
        // generally best to keep the time step and iterations fixed.
        this.world.Step(dt, velocityIterations, positionIterations);

        //Iterate over the bodies in the physics world
        for (var b = this.world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData() != null) {
                //Synchronize the AtlasSprites position and rotation with the corresponding body
                var myActor = b.GetUserData();
      
                myActor.x = b.GetPosition().x * PTM_RATIO;
                myActor.y = b.GetPosition().y * PTM_RATIO;
                myActor.rotation = -1 * cc.radiansToDegress(b.GetAngle());
            }
        }

    }
});


var heroListener = cc.EventListener.create({
    event: cc.EventListener.KEYBOARD,
    flag: true,
    onKeyPressed:  function(keyCode, event){
       
        if (!this.flag) {
            return;
        }
        cc.log("Key " + keyCode.toString() + " was pressed!");
        // 获取英雄
        // var hero = ccs.armatureDataManager.getArmatureData("girl");
        // var hero = ccs.Armature.create("girl"); 


        // var hero = ccs.armatureDataManager.getAnimationData("girl");
        // hero.getAnimation().play("run"); 
        // var run = ccs.ArmatureAnimation.create(hero);
       
        // run.play("run");

        var scene = cc.director.getRunningScene();
 
        var hero = scene.getChildByTag(10000).getChildByTag(10005).getChildren()[0];
        var mon = scene.getChildByTag(10000).getChildByTag(10006).getChildren()[0];
        
      
        var heroAn = hero.getAnimation();
        
        this.hero = hero;
       // heroAn.setMovementEventCallFunc(this.movementEventCallFunc,hero);
        // if (!this.isFirst) {

        //     setTimeout(function(){
        //         this.isFirst = true;

        //     },0.2)
        //     return;
        // }else{
        //     this.isFirst = false;
        // }
       
        
        // 0: "loading"
        // 1: "run"
        // 2: "attack"
        // 3: "smitten"
        // 4: "death"
        switch(keyCode){
            case 68:{
                
                // 
                // hero.x += 10;

                var action = cc.MoveBy.create(0.4,cc.p(80,0));
                hero.runAction(action);
                hero.rotationY = 0;

                hero.schedule(this.runFront, 0.4);
                heroAn.play("run");
              
                
                this.flag = false;
                break;
            };
            case 65:{

                var action = cc.MoveBy.create(0.4,cc.p(-80,0));
                hero.runAction(action);

                hero.rotationY = 180;

                hero.schedule(this.runBack, 0.4);
                heroAn.play("run");
                this.flag = false;
                break;
               

            };
            case 87:{
                
                var action = cc.JumpBy.create(0.5,cc.p(0,0), 100 ,1);


                hero.scheduleOnce(this.setup.bind(this), 0.5);
                hero.runAction(action);
                heroAn.play("loading");
                this.flag = false;
                break;
            };
            case 83:{
                heroAn.play("attack");
                hero.scheduleOnce(this.setup.bind(this), 0.8);

                
                this.flag = false;

                

               
                break;
            };
            case 88:{
                heroAn.play("smitten");
                
                break;
            };
        }

       
    },
    updateGame:function(){
        console.log("-----------------");
        var scene = cc.director.getRunningScene();

        var hero = scene.getChildByTag(10000).getChildByTag(10005).getChildren()[0];
        var mon = scene.getChildByTag(10000).getChildByTag(10006).getChildren()[0];
        
        // 如果身体碰撞到武器那没受伤
        var heroAu = hero.getArmatureData();

        // 武器
        var heroArms = heroAu.boneDataDic["girl_arms.png"];




    },
    runFront:function(){
       
        var action = cc.MoveBy.create(0.4,cc.p(80,0));
        this.runAction(action);
    },
    runBack:function(){

        var action = cc.MoveBy.create(0.4,cc.p(-80,0));
        this.runAction(action);
    },
    setup:function(){
        this.flag = true;
    },
    movementEventCallFunc: function(armature, movementType, movementID){
        console.log("callback - " + movementType);
        
        if (movementType == 2 && movementID == "run") {
            var action = cc.MoveBy.create(0.4,cc.p(100,0));
            this.runAction(action);
            this.getAnimation().play("run");
            // this.run();
        }else if(movementType == 2 && movementID == "loading"){
            this.getAnimation().setMovementEventCallFunc();
        };
    },
    onKeyReleased: function(keyCode, event){
        cc.log("Key " + keyCode.toString() + " was released!");
        


        var scene = cc.director.getRunningScene();

        var hero = scene.getChildByTag(10000).getChildByTag(10005).getChildren()[0];
        var mon = scene.getChildByTag(10000).getChildByTag(10006).getChildren()[0];
        
      
        var heroAn = hero.getAnimation();

        // hero.cleanup();
       

        switch(keyCode){
            case 68:{
                hero.unschedule(this.runFront);
                hero.stopAllActions();
                 heroAn.play("loading");
                this.flag = true;
                break;
            };
            case 65:{
                hero.unschedule(this.runBack);
                hero.stopAllActions();
                heroAn.play("loading");
                this.flag = true;
                break;
               

            };
            case 87:{

                break;
            };
            case 83:{
                
                break;
            };
            case 88:{
                
                
                break;
            };
        }
    }
}, this);



var listener = new Box2D.Dynamics.b2ContactListener;
// 监听碰撞事件
listener.BeginContact = function(contact) {
        console.log("*********************");

        // 获取碰撞物体
        console.log(contact.GetFixtureA().GetBody().GetUserData());
        console.log(contact.GetFixtureB().GetBody().GetUserData());
}