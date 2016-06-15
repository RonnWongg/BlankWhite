/**
 *
 * @author 
 *
 */
class Chess extends egret.Bitmap{
    public col;
	public constructor(col) {
        super();
        this.col=col;
        if(col==1){
    	    this.texture=RES.getRes("w_png");
    	}else {
    	    this.texture=RES.getRes("b_png"); 
    	}
	}	
}
