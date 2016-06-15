/*
 * 该程序只写到了判断最后胜利
 * 判断输赢后没有进行界面处理
 * 中间存在一些bug
 * 加入位置需按先黑后白才能进行游戏
 * 服务器方面需要进行整理 删除一些不必要的代码
 * 客户端方面要做的是 整理main  FiveChess  Player 等里面的函数以及声明  删除一些测试用的console.log语句 以及不惜要的代码
 * */


class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    /**
    * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
    * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
    */
    private createBitmapByName(name: string): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
       
    private socket:FiveChess;
    private txt;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private lv:LoginView;
    private pl: Player;
    private sky:egret.Bitmap;
    private createGameScene():void {
        this.sky= this.createBitmapByName("background2_png");
        this.addChild(this.sky);
        var stageW:number = this.stage.stageWidth;
        var stageH:number = this.stage.stageHeight;
        this.sky.width = stageW;
        this.sky.height = stageH;
        
        this.socket=new FiveChess(ConnectData.host,ConnectData.port);
        this.setOn();
        
        this.pl = new Player();
        
        this.lv=new LoginView();
        this.addChild(this.lv);
        this.lv.addEventListener(egret.TouchEvent.TOUCH_TAP,this.Game,this);
    }
    
    private rv:RoomView;
    private Game(evt:egret.TouchEvent){
        if(this.lv.getLoginText()){
            this.socket.connect();
            this.socket.login(this.lv.getLoginText());
            this.removeChild(this.lv);
            this.rv=new RoomView();
            this.addChild(this.rv);
            this.rv.addEventListener(egret.TouchEvent.TOUCH_TAP,this.RdyGo,this);
            
        }
    }
    
    private rdybtn:egret.Bitmap;
    private rid;
    private RdyGo(evt:egret.TouchEvent){
        //触发位置事件      
        console.log(evt.target.name);//位置  0为黑  1为白
        
        this.socket.joinPid(evt.target.name);
        
        this.socket.ready();
        
        this.rid=evt.target.name;
        
        if(this.rv.getS1().name==evt.target.name){
            this.rv.getS2().touchEnabled=false;
        }else{
            this.rv.getS1().touchEnabled=false;
        }

       
    }
  
    private ID:string;
    
    private setOn(){
        var self=this;
        this.socket.on("login",function(data){
            if(data.ret==1){
                console.log("登录成功");
                }
            });
        this.socket.on("joinPid",function(data){

            });
        this.socket.on("ready",function(data){
            console.log("ready");
            });
        this.socket.on("start",
            function(data){

            console.log("start");
            console.log(data); 
            self.allowdraw = data.allowDraw;
            self.draw(data);
               
                
            });  
        this.socket.on("drawChess",function(data){
            
            //根据传递的数据画图
            
//            self.Enemy(data);

            console.log(data);
            console.log("ha"+self.substrings(data.id));
            
            if((data.id.substring(1,data.id.length))==self.personID){
                self.cb.touchEnabled=false;
                console.log(self.personID+" = "+self.cb.touchEnabled);
            }else{
                self.cb.touchEnabled = true;
                console.log(self.personID+" != " + self.cb.touchEnabled);
            }
            self.Enemy(data);
        });
        
        this.socket.on("winer",function(){
            console.log("你赢了");
            });
        this.socket.on("loser",function() {
            console.log("你输了");
        });
    }

    private allowdraw:boolean;
    private cb:ChessBoard;
    private c:Chess;
    private personID:string;
    private draw(data){
        console.log("id:"+data.id+"allowdraw:"+this.allowdraw);
        this.removeChildren();
        this.addChild(this.sky);
        this.cb=new ChessBoard();
        this.cb.y=180;
        this.addChild(this.cb);
        
        this.col=data.color;
        this.personID = data.id.substring(1,data.id.length);
        console.log("personID"+this.personID);
        
        if(data.allowDraw){
            this.cb.touchEnabled=true;
        }else{
            this.cb.touchEnabled=false;
        }
        
        this.cb.addEventListener(egret.TouchEvent.TOUCH_TAP,this.chess,this);
       
       
       
    }

    private col;
    //触发drawchess
    private chess(evt:egret.TouchEvent){
        
        var x=evt.localX;
        var y=evt.localY;
        var i=Math.floor(x/30);
        var j=Math.floor(y/30);
        if(i<15&&j<15){
            this.c = new Chess(this.col);
            this.c.x=i*30+10;
            this.c.y=j*30+10;
            this.cb.addChild(this.c);
            this.socket.drawChess(this.col,i,j);
        }
        console.log(evt.localX+":"+evt.localY);
    }
    
    private Enemy(data){
        var e:Chess=new Chess(data.color);
        e.x=30*data.x+10;
        e.y=30*data.y+10;
        this.cb.addChild(e);
       
    }
    
    public substrings(str:string):string{
        return str.substring(1,str.length-1);
    }
}
