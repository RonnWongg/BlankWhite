/**
 *
 * @author 
 *
 */
class FiveChess {
    public m_Events = [];
    public socket;
    public m_Error = "";
    public m_Host;
    public m_Port;
    public constructor(host,port) {       
       	this.m_Host = host;
        this.m_Port = port;      
        var self = this;
		  
    }
    public bindEvents(){
        for(var e in this.m_Events){
            this.socket.on(e,this.m_Events[e]);
        }
    }
    public setError(err) {
        this.m_Error = err;
    }
    
    public getError() {
        return this.m_Error;
    }
    
    public connect() {
        if(!("io" in window)) {
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
    }
    public login(nickname) {
        this.socket.emit("login",{
            "nickname": nickname
        });
    }
    public joinPid(pid) {
        this.socket.emit("joinPid",{"pid": pid });
    }
    
    
    public leavePid(pid) {
        this.socket.emit("leavePid",{
            "pid": pid
        });
    }
    public ready() {
        this.socket.emit("ready","");
    }
	
    public sendToMsg(body) {
        this.socket.emit("message",{
            "type": 0,
            "body": body
        });
    }    
    public sendAllMsg(to,body) {
        this.socket.emit("message",{
            "type": 1,
            "to": to,
            "body": body
        });
    }
	
    public sendRoomMsg(body) {
        this.socket.emit("message",{
            "type": 2,
            "body": body
        });
    }
    

    public drawChess(color,x,y) {
        this.socket.emit("drawChess",{
            "color": color,
            "x": x,
            "y": y
        });
    }
    
    public on(event,callback) {
        this.m_Events[event]=callback;
        return self;
    }
    
   
}
