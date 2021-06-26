const COR_CONFIG = {
    origin              : ['http://localhost:4200'],
    methods             : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200
};
const app  = require('express')();
const http = require('http').Server(app);
const io   = require('socket.io')(http, {
    cors: COR_CONFIG
});
const port = process.env.PORT || 3000;
const cors = require('cors');
const uuid = require('uuid');

app.use(cors(COR_CONFIG));

app.get('/', (req, res) => {
    res.send('ok');
});

let live_users = {};
let live_rooms = {};

const SYMB_DATA = Symbol('data');

io.on('connection', (socket) => {
    console.log(`[${socket.id}]: connected ${socket.connected}`);
    live_users[socket.id] = socket;
    live_users[socket.id][SYMB_DATA] = Object.assign(live_users[socket.id][SYMB_DATA] || {}, {
        messages: []
    });

    // broadCast('user-changes');

    socket.once('set-data', data => {
        live_users[socket.id][SYMB_DATA] = Object.assign(live_users[socket.id][SYMB_DATA] || {}, data);
        console.log(`[${socket.id}]: Data set `, data);
        broadCast('user-changes');
    });

    socket.on('message', msg => {
        console.log(`[${socket.id}]: Message received: `, msg);
        live_users[socket.id][SYMB_DATA].messages.push(msg);
        live_users[msg.to][SYMB_DATA].messages.push(msg);
        msg['from_name'] = live_users[msg.from][SYMB_DATA] && live_users[msg.from][SYMB_DATA]['username'] || 'Anonymous';
        msg['to_name'] = live_users[msg.to][SYMB_DATA] && live_users[msg.to][SYMB_DATA]['username'] || 'Anonymous';
        if (live_users[msg.to] && live_users[msg.to].connected) {
            live_users[msg.to].emit('new-message', msg);
        }
    });

    socket.on('group-message', msg => {
        console.log(`[${socket.id}]: Group Message received: `, msg);
        msg['from_name'] = live_users[msg.from][SYMB_DATA] && live_users[msg.from][SYMB_DATA]['username'] || 'Anonymous';
        socket.to(msg['roomId']).emit('new-group-message', msg);
    });
    
    socket.on('get-old-messages', (id, type = 'chat') => {
        socket.emit('old-messages', live_users[socket.id][SYMB_DATA].messages.filter(msg => msg['to'] == id));
    });
    
    socket.on('create-room', data => {
        console.log(`[${socket.id}]: Creating room: `, data);
        
        let roomId = uuid.v4();
        // socket.join(roomId);

        data.users.push(socket.id);

        data.users.forEach(id => {
            live_users[id].join(roomId);
            live_users[id][SYMB_DATA]['rooms'] = live_users[id][SYMB_DATA]['rooms'] ? live_users[id][SYMB_DATA]['rooms'].push(roomId) : [roomId]; 
        });
        live_rooms[roomId] = {
            id   : roomId,
            name : data.name,
            users: data.users,
        };
        broadCast('user-changes');
    });

    socket.on('disconnect', () => {
        console.log(`[${socket.id}]: disconnected`);
        delete live_users[socket.id];
        broadCast('user-changes');
    });
});

const broadCast = function (event, message) {
    Object.keys(live_users).forEach(id => {
        live_users[id].emit(event, message);
    });
};

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
});

app.get('/live/user/:id/rooms', (req, res, next) => {
    try {
        let id = req.params.id;

        if (!live_users[id][SYMB_DATA]['rooms'] || !live_users[id][SYMB_DATA]['rooms'].length) {
            return res.json({
                code   : 200,
                message: 'Success',
                data   : []
            });
        }

        let rooms = Object.values(live_rooms)
            .filter(room => live_users[id][SYMB_DATA]['rooms'].includes(room['id']));

        let data = {
            code   : 200,
            message: 'Success',
            data   : rooms
        };
        return res.json(data);
    } catch (e) {
        res.json({
            code   : 500,
            message: 'Internal Server Error',
            error  : e && e.stack || e
        });
    }
});

app.get('/live/users', (req, res, next) => {
    try {
        let users = Object.keys(live_users).map(id => {
            return {
                id    : id,
                name  : live_users[id][SYMB_DATA] && live_users[id][SYMB_DATA]['username'] || 'Anonymous',
                status: live_users[id] && live_users[id].connected ? 'connected' : 'disconnected'
            };
        });
        let data = {
            code   : 200,
            message: 'Success',
            data   : users
        };
        return res.json(data);
    } catch (e) {
        res.json({
            code   : 500,
            message: 'Internal Server Error',
            error  : e && e.stack || e
        });
    }
});
