/**
 *
 * @author
 *
 */
var ConnectData = (function () {
    function ConnectData() {
    }
    var d = __define,c=ConnectData,p=c.prototype;
    ConnectData.g_Connected = false;
    ConnectData.host = "127.0.0.1";
    ConnectData.port = 3000;
    ConnectData.RoomNum = 3;
    ConnectData.MSG_ALL = 0; //发送到所有用户
    ConnectData.MSG_TO = 1; //发送指定用户
    ConnectData.MSG_ROOM = 2; //向指定桌发送消息
    ConnectData.STAT_NORMAL = 0; //无状态
    ConnectData.STAT_READY = 1; //准备
    ConnectData.STAT_START = 2; //游戏中
    ConnectData.COLOR_BLACK = 1; //黑色
    ConnectData.COLOR_WHITE = 2; //白色
    ConnectData.g_Info = {
        "id": 0,
        "nickname": "",
        "status": 0,
        "roomIdx": -1,
        "posIdx": -1
    };
    return ConnectData;
}());
egret.registerClass(ConnectData,'ConnectData');
