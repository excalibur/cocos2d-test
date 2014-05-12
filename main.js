
cc.game.onStart = function(){
    cc.view.setDesignResolutionSize(960, 640, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new HelloWorldScene());
  //       scene = ccs.sceneReader.createNodeWithSceneFile(res.s_FightScene_json);
  //       cc.director.runScene(scene);

  //       // 获取英雄
  //       var hero = ccs.armatureDataManager.getArmatureData("girl");
        
  //       console.log(hero.boneDataDic);
  //       console.log(hero.boneDataDic['girl_head.png']);
  //       console.log(scene);
		// var head = cc.Sprite.create("res/publish/ani/hero/girl0.png");
		// head.attr({
  //           x: 0,
  //           y: 0
  //       });
		// this.addChild(head);
		

		cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(){
    		//处理游戏进入后台的情况
    		console.log("hide");
		});

		cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(){
		    //处理返回游戏的情况
		    console.log("show");
		});

		console.log(cc.eventManager);
    }, this);


   
};
cc.game.run();