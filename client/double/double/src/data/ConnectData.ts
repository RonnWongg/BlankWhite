/**
 *
 * @author 
 *
 */
class ConnectData {
    public static g_Connected = false;
	public static host:string="127.0.0.1";
	public static port:number=3000;
	
	public static RoomNum=3;
	
    public static MSG_ALL = 0;//发送到所有用户
    public static MSG_TO = 1;//发送指定用户
    public static MSG_ROOM = 2;//向指定桌发送消息
	
    public static STAT_NORMAL = 0;//无状态
    public static STAT_READY = 1;//准备
    public static STAT_START = 2;//游戏中
	
    public static COLOR_BLACK = 1;//黑色
    public static COLOR_WHITE = 2;//白色
	
    public static g_Info = {
        "id": 0,
        "nickname": "",
        "status": 0,
        "roomIdx": -1,
        "posIdx": -1
    };
   
}
