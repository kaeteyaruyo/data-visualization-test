const fs = require('fs');
const path = require('path');
const { env } = require('process');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = env.PORT || 8080;

const result = JSON.parse(fs.readFileSync('result.json', 'utf8'));

app.get('/', (req, res) => {
    res.redirect('/vote/1')
})

app.get('/vote/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'vote.html'));
})

app.get('/graph', (req, res) => {
    res.sendFile(path.join(__dirname, 'graph.html'));
})

app.get('/data', (req, res) => {
    res.json(result);
})

setInterval(() => {
    fs.writeFileSync('result.json', JSON.stringify(result, null, 4));
}, 30 * 1000)

io.on('connection', (socket) => {
    socket.on('default', (data) => {
        result.default.push(data);
        io.emit('default', data);
    });
    socket.on('bold', (data) => {
        result.bold.push(data);
        io.emit('bold', data);
    });
    socket.on('color', (data) => {
        result.color.push(data);
        io.emit('color', data);
    });
});

server.listen(port, () => {
    console.log(`Server is now listening on port ${port}`);
});
