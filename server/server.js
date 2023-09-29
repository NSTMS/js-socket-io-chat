const IP = "192.168.88.67"
const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://localhost:5173", "http://192.168.88.67:5173","https://js-socket-io-chat.web.app/","http://127.0.0.1:5500"]
    }
});

let usrnames = new Map();
let enabled = true;
io.on("connection", (socket) => {r
    console.log("connected: ", socket.id);
    
    socket.on('end-of-round',()=>{
        enabled = false;
        io.emit('disable-messages')
    })
    socket.on('new-round',()=>{
        enabled = true;
        io.emit('enable-messages')
    })
    
    socket.on('change-name', (name)=>{
        usrnames.set(socket.id, name)
        io.emit('name-changed', name)
    })

    socket.on('send-message', message => {
        if(enabled)
        {
            io.emit('recive-message', usrnames.get(socket.id), message);
        }
    });
});

