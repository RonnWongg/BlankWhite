/**
 *
 * @author 
 *
 */
class RoomView extends egret.Sprite{
	public constructor() {
    	super();
    	this.RoomInit();
	}
	private sd:egret.Bitmap;
	private chessboard:egret.Sprite;
	private seat1:egret.Bitmap;
    private seat2:egret.Bitmap;
	private RoomInit(){	    
	    this.chessboard=new egret.Sprite();
	    this.addChild(this.chessboard);
	    
	    this.seat1=new egret.Bitmap();
	    this.seat1.texture=RES.getRes("seat1_png");
	    this.addChild(this.seat1);
	    
	    this.seat1.touchEnabled=true;
	    
	  
	    this.seat2=new egret.Bitmap();
	    this.seat2.texture=RES.getRes("seat2_png");
	    this.addChild(this.seat2);
	    
	    this.seat2.touchEnabled=true;
	    
        this.seat1.x = 120;
        this.seat1.y = 100;
        this.seat1.name = "0";
	    	    
	    this.seat2.x=300;
	    this.seat2.y=100;
	    this.seat2.name="1";
	    
	    var cbbg:egret.Bitmap=new egret.Bitmap();
	    cbbg.texture=RES.getRes("qipan_png");
	    this.chessboard.addChild(cbbg);
	    
	    this.chessboard.x=10;
	    this.chessboard.y=180;
	    
//	    this.chessboard.touchEnabled=true;
	}
	public getCB():any{
	    return this.chessboard;
	}
	public getS1():any{
	    return this.seat1;
	}
	public getS2():any{
	    return this.seat2;
	}
	public getSD():any{
	    return this.sd;
	}

    public drawSD(){
        this.sd = new egret.Bitmap();
        this.sd.texture = RES.getRes("shutdown_png");
        this.addChild(this.sd);
        this.sd.x = 410;
        this.sd.y = 10;
    }	
    private removeSD(){
        this.removeChild(this.sd);
    }
   
}
