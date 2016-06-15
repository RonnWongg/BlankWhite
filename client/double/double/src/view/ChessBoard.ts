/**
 *
 * @author 
 *
 */
class ChessBoard extends egret.Sprite{
	public constructor() {
    	super();
    	this.init();
	}
    private chessboard: egret.Sprite;
	private init(){
        this.chessboard = new egret.Sprite();
        this.addChild(this.chessboard);
        
        var cbbg: egret.Bitmap = new egret.Bitmap();
        cbbg.texture = RES.getRes("qipan_png");
        this.chessboard.addChild(cbbg);

        this.chessboard.x = 10;

//        this.chessboard.touchEnabled = true;
	}
}
