/**
 *
 * @author
 *
 */
var ChessBoard = (function (_super) {
    __extends(ChessBoard, _super);
    function ChessBoard() {
        _super.call(this);
        this.init();
    }
    var d = __define,c=ChessBoard,p=c.prototype;
    p.init = function () {
        this.chessboard = new egret.Sprite();
        this.addChild(this.chessboard);
        var cbbg = new egret.Bitmap();
        cbbg.texture = RES.getRes("qipan_png");
        this.chessboard.addChild(cbbg);
        this.chessboard.x = 10;
        //        this.chessboard.touchEnabled = true;
    };
    return ChessBoard;
}(egret.Sprite));
egret.registerClass(ChessBoard,'ChessBoard');
