/**
 *
 * @author
 *
 */
var Chess = (function (_super) {
    __extends(Chess, _super);
    function Chess(col) {
        _super.call(this);
        this.col = col;
        if (col == 1) {
            this.texture = RES.getRes("w_png");
        }
        else {
            this.texture = RES.getRes("b_png");
        }
    }
    var d = __define,c=Chess,p=c.prototype;
    return Chess;
}(egret.Bitmap));
egret.registerClass(Chess,'Chess');
