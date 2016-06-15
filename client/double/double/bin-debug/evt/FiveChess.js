/**
 *
 * @author
 *
 */
var FiveChess = (function () {
    function FiveChess(host, port) {
        this.m_Events = [];
        this.m_Error = "";
        this.m_Host = host;
        this.m_Port = port;
        var self = this;
    }
    var d = __define,c=FiveChess,p=c.prototype;
    p.bindEvents = function () {
        for (var e in this.m_Events) {
            this.socket.on(e, this.m_Events[e]);
        }
    };
    p.setError = function (err) {
        this.m_Error = err;
    };
    p.getError = function () {
        return this.m_Error;
    };
    p.connect = function () {
        if (!("io" in window)) {
            this.setError("io not defined");
            return false;
        }
        this.socket = io.connect('http://' + this.m_Host + ':' + this.m_Port);
        /*if(socket.socket.open == false){
            setError("connect http://" + m_Host + ":" + m_Port + " failed");
            return false;
        }*/
        this.bindEvents();
        return true;
    };
    p.login = function (nickname) {
        this.socket.emit("login", {
            "nickname": nickname
        });
    };
    p.joinPid = function (pid) {
        this.socket.emit("joinPid", { "pid": pid });
    };
    p.leavePid = function (pid) {
        this.socket.emit("leavePid", {
            "pid": pid
        });
    };
    p.ready = function () {
        this.socket.emit("ready", "");
    };
    p.sendToMsg = function (body) {
        this.socket.emit("message", {
            "type": 0,
            "body": body
        });
    };
    p.sendAllMsg = function (to, body) {
        this.socket.emit("message", {
            "type": 1,
            "to": to,
            "body": body
        });
    };
    p.sendRoomMsg = function (body) {
        this.socket.emit("message", {
            "type": 2,
            "body": body
        });
    };
    p.drawChess = function (color, x, y) {
        this.socket.emit("drawChess", {
            "color": color,
            "x": x,
            "y": y
        });
    };
    p.on = function (event, callback) {
        this.m_Events[event] = callback;
        return self;
    };
    return FiveChess;
}());
egret.registerClass(FiveChess,'FiveChess');
