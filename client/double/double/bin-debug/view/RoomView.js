/**
 *
 * @author
 *
 */
var RoomView = (function (_super) {
    __extends(RoomView, _super);
    function RoomView() {
        _super.call(this);
        this.RoomInit();
    }
    var d = __define,c=RoomView,p=c.prototype;
    p.RoomInit = function () {
        this.chessboard = new egret.Sprite();
        this.addChild(this.chessboard);
        this.seat1 = new egret.Bitmap();
        this.seat1.texture = RES.getRes("seat1_png");
        this.addChild(this.seat1);
        this.seat1.touchEnabled = true;
        this.seat2 = new egret.Bitmap();
        this.seat2.texture = RES.getRes("seat2_png");
        this.addChild(this.seat2);
        this.seat2.touchEnabled = true;
        this.seat1.x = 120;
        this.seat1.y = 100;
        this.seat1.name = "0";
        this.seat2.x = 300;
        this.seat2.y = 100;
        this.seat2.name = "1";
        var cbbg = new egret.Bitmap();
        cbbg.texture = RES.getRes("qipan_png");
        this.chessboard.addChild(cbbg);
        this.chessboard.x = 10;
        this.chessboard.y = 180;
        //	    this.chessboard.touchEnabled=true;
    };
    p.getCB = function () {
        return this.chessboard;
    };
    p.getS1 = function () {
        return this.seat1;
    };
    p.getS2 = function () {
        return this.seat2;
    };
    p.getSD = function () {
        return this.sd;
    };
    p.drawSD = function () {
        this.sd = new egret.Bitmap();
        this.sd.texture = RES.getRes("shutdown_png");
        this.addChild(this.sd);
        this.sd.x = 410;
        this.sd.y = 10;
    };
    p.removeSD = function () {
        this.removeChild(this.sd);
    };
    return RoomView;
}(egret.Sprite));
egret.registerClass(RoomView,'RoomView');
