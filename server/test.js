/**
 * Created by Ronn on 2016/4/25.
 */
var MSG_ALL  = 0;//发送到所有用户
var MSG_TO   = 1;//发送指定用户
var MSG_ROOM = 2;//向指定桌发送消息

var STAT_NORMAL = 0;//无状态
var STAT_READY  = 1;//准备
var STAT_START  = 2;//游戏中

var COLOR_BLACK = 1;//黑色
var COLOR_WHITE = 2;//白色

var m_Connections = [];//用户管理
var m_Rooms = [];//房间管理
var m_RoomData = [];//房间内棋盘信息
var n_Clients = 0;
var self = this;

var m_Config = {
    "ListenPort" : 3000,
    "RoomTotal" :1,
    "MaxClientNum" :2
};

//初始化棋盘数据
var InitChessData = function(roomIdx){
    m_RoomData[roomIdx] = [];
    for(var i = 0; i < 15; i++){
        m_RoomData[roomIdx][i] = [];
        for(var j = 0; j < 15; j++){
            m_RoomData[roomIdx][i][j] = -1;
        }
    }
}
//重置棋盘数据
var ResetCheseData = function(roomIdx){
    for(var i =0 ; i < 15; i++){
        for(var j = 0; j < 15; j++){
            m_RoomData[roomIdx][i][j] = -1;
        }
    }
}
//获取用户列表
var GetUserList = function()
{
    var list = [];
    for(var sid in m_Connections)
    {
        list.push(GetUserInfo(sid));
    }
    return list;
}

//获取用户信息
var GetUserInfo = function(sid)
{
    return {
        "id" : m_Connections[sid].socket.id,
        "nickname" : m_Connections[sid].nickname,
        "status" : m_Connections[sid].status
    }
}

//检查落子是否合法

var checkValidChess = function (x, y) {
    if (m_RoomData[0][x][y] == 1) {
        return false;
    }
    return true;
}


//初始化房间
for (var i = 0; i < m_Config.RoomTotal; i++) {
    m_Rooms[i] = [0, 0];
    InitChessData(i);
    console.log("初始化房间");
}


var io=require('socket.io').listen(m_Config.ListenPort);
io.sockets.on('connection',function(socket){

    m_Rooms[0]=[0,0];//初始化房间

    console.log(socket.id);
    socket.on("disconnect",onClose);
    socket.on("login",onLogin);
    socket.on("joinPid",onJoinPid);
    socket.on("leavePid",onLeavePid);
    socket.on("ready",onReady);
    socket.on("message",onMessage);
    socket.on("drawChess",onDrawChess);
});

console.log("server start up.Port is "+m_Config.ListenPort);

var onClose=function(data){
    var sid = this.id;

    if(!m_Connections[sid]) return ;
    n_Clients--;
    //发送退出消息
    io.sockets.emit("close", {
        "id" : sid,
        "pid" : m_Connections[sid].pid
    });
   //删除元素
    delete m_Connections[sid];

    console.log(sid+"close");
}
var onLogin=function(data){
    var ret = 0;
    var sid = this.id;
    console.log("sid:"+sid+" name:"+data.nickname);
    console.log("login");
    if(n_Clients < m_Config.MaxClientNum){
        var client = {
            socket   : this,
            nickname : data.nickname,
            status   : STAT_NORMAL,//0-无状态, 1-准备, 2-游戏中
            // roomIdx  : -1, //所处房间号
            pid   : -1 //所处房间的位置
        };

        //更新客户端链接
        m_Connections[sid] = client;
        n_Clients++;

        //登陆成功
        this.emit("login", {
            "ret": 1
            });
        }else{
        //登陆失败
        this.emit("login", {"ret" : 0});
    }
}

var onJoinPid=function(data){
    var sid = this.id;
    console.log("joinpid:"+data.pid+"sid"+sid);
    var pid=data.pid;
    if(m_Connections[sid]&&m_Connections[sid].status!=STAT_START){

        m_Connections[sid].pid=data.pid;
        m_Connections[sid].status=STAT_NORMAL;
        m_Rooms[0][pid]=sid;

        io.sockets.emit("joinPid", {
            "pid"   : data.posIdx,
            "nickname" : m_Connections[sid].nickname,
            "id"       : sid
        });
    }
    console.log("sid"+this.id+" joinPid: "+data.pid);
}
var onLeavePid=function(data){
    console.log("leaveRoom data:"+data.pid);

}
var onReady=function(data){
    var sid = this.id;
    if(m_Connections[sid]&&m_Connections[sid].status!=STAT_START){
        var status = 1 - m_Connections[sid].status;
        m_Connections[sid].status = status;

        //发送准备信息到大厅
        io.sockets.emit("ready", {
            "id"      : sid,
            "posIdx"  : m_Connections[sid].pid,
            "nickname": m_Connections[sid].nickname,
            "status"  : status
        });

        //发送开始消息

        if(m_Rooms[0][0] && m_Rooms[0][1] &&
            m_Connections[m_Rooms[0][0]] &&
            m_Connections[m_Rooms[0][1]]&&
            m_Connections[m_Rooms[0][0]].status == STAT_READY &&
            m_Connections[m_Rooms[0][1]].status == STAT_READY
           )
        {
            // m_Connections[m_Rooms[0][0]].status = STAT_START;
            // m_Connections[m_Rooms[0][1]].status = STAT_START;
            m_Connections[m_Rooms[0][0]].socket.emit("start", {
                "color" : 0,//黑
                "allowDraw" : true,
                "id":m_Rooms[0][0]
            });
            m_Connections[m_Rooms[0][1]].socket.emit("start", {
                "color" : 1,//白
                "allowDraw" : false,
                "id":m_Rooms[0][1]
            });
        }
    }
    console.log("ready");
    console.log(m_Rooms);
}
var onMessage=function(data){
    console.log("send message");
}

var onDrawChess=function(data) {
    // console.log("drawChess" + data.color + ":" + data.x + ":" + data.y);
    var sid = this.id;

    if( checkValidChess(data.x, data.y) == true) {
        data.id = sid;
        m_RoomData[0][data.x][data.y] = data.color;
        for (var i = 0; i < 2; i++) {//向房间内所有成员发送落子信息
            m_Connections[m_Rooms[0][i]].socket.emit("drawChess", data);
        }

        if(checkGameOver(data.x, data.y) == true){
            var first  = m_Rooms[0][0];
            var second = m_Rooms[0][1];
            var winer  = (sid == first ? first : second);
            var loser  = (sid == second ? first : second);
            ResetCheseData(0);

            m_Connections[winer].socket.emit("winer", "");
            m_Connections[loser].socket.emit("loser", "");
        }

    }
}
//检查游戏是否结束
var checkGameOver = function (x, y) {
    var n;
    var cur = m_RoomData[0][x][y];

    //横
    n = 0;
    var startX = (x - 4) < 0 ? 0 : x - 4;
    var endX = (x + 4) > 14 ? 14 : x + 4;
    for (var i = startX; i <= endX; i++) {
        if (m_RoomData[0][i][y] == cur) {
            n++;
        } else {
            n = 0;
        }
        if (n >= 5) return true;
    }

    //竖
    n = 0;
    var startY = (y - 4) < 0 ? 0 : x - 4;
    var endY = (y + 4) > 14 ? 14 : y + 4;
    for (var i = startY; i <= endY; i++) {
        if (m_RoomData[0][x][i] == cur) {
            n++;
        } else {
            n = 0;
        }
        if (n >= 5) return true;
    }

    //正斜
    n = 0;
    var min = x < y ? (x - 4 < 0 ? x : 4) : (y - 4 < 0 ? y : 4);
    var max = x > y ? (x + 4 > 14 ? 14 - x : 4) : (y + 4 > 14 ? 14 - y : 4);
    var p1x = x - min;
    var p1y = y - min;
    var p2x = x + max;
    var p2y = y + max;
    for (var i = p1x, j = p1y; i <= p2x, j <= p2y; i++, j++) {
        if (m_RoomData[0][i][j] == cur) {
            n++;
        } else {
            n = 0;
        }
        if (n >= 5) return true;
    }

    //反斜
    n = 0;
    var min = (x + 4 > 14 ? 14 - x : 4) < (y - 4 < 0 ? y : 4) ?
        (x + 4 > 14 ? 14 - x : 4) : (y - 4 < 0 ? y : 4);
    var max = (x - 4 < 0 ? x : 4) < (y + 4 > 14 ? 14 - y : 4) ?
        (x - 4 < 0 ? x : 4) : (y + 4 > 14 ? 14 - y : 4);
    var p1x = x + min;
    var p1y = y - min;
    var p2x = x - max;
    var p2y = y + max;
    for (var i = p1x, j = p1y; i >= p2x; i--, j++) {
        if (m_RoomData[0][i][j] == cur) {
            n++;
        } else {
            n = 0;
        }
        if (n >= 5) return true;
    }

    return false;
}