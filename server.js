// Yahoo Chat Hồi Xưa — server chat thời gian thực
// Chat phòng + chat riêng 1-1 + BUZZ + typing indicator. Dữ liệu giữ trong RAM (không cần database).
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/manifest.webmanifest', (req, res) => {
  res.type('application/manifest+json');
  res.sendFile(path.join(__dirname, 'public', 'manifest.webmanifest'));
});
app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (req, res) => res.json({ ok: true, users: users.size }));

const ROOMS = [
  { id: 'viet-nam', name: 'Phòng Việt Nam', desc: 'Phòng chung cho mọi người' },
  { id: 'ca-phe', name: 'Cà Phê 8x 9x', desc: 'Tám chuyện, nhạc xưa, Audition, MU...' },
  { id: 'tam-su', name: 'Tâm Sự Đêm Khuya', desc: 'Thức khuya tâm sự nhẹ nhàng' },
];

const users = new Map(); // socketId -> { nick, avatar, status, statusMsg }
const history = new Map(ROOMS.map(r => [r.id, []])); // roomId -> last messages

function cleanText(s, max) {
  return String(s || '').replace(/[<>&"]/g, '').trim().slice(0, max);
}
function publicUsers() {
  return [...users.values()].map(u => ({ nick: u.nick, avatar: u.avatar, status: u.status, statusMsg: u.statusMsg }));
}
function socketByNick(nick) {
  for (const [id, u] of users) if (u.nick === nick) return id;
  return null;
}
function pushHistory(roomId, msg) {
  const h = history.get(roomId);
  if (!h) return;
  h.push(msg);
  while (h.length > 50) h.shift();
}

io.on('connection', (socket) => {
  socket.emit('rooms', ROOMS);

  socket.on('join', (data, cb) => {
    let nick = cleanText(data && data.nick, 24) || 'khach_moi';
    nick = nick.replace(/\s+/g, '_');
    const base = nick;
    let i = 2;
    while (socketByNick(nick)) nick = base + '_' + (i++);
    const user = {
      nick,
      avatar: cleanText(data && data.avatar, 4) || '😊',
      status: ['available', 'busy', 'away'].includes(data && data.status) ? data.status : 'available',
      statusMsg: cleanText(data && data.statusMsg, 60),
    };
    users.set(socket.id, user);
    socket.data.nick = nick;
    ROOMS.forEach(r => socket.join('room:' + r.id));
    if (cb) cb({ ok: true, nick });
    io.emit('users', publicUsers());
    ROOMS.forEach(r => socket.emit('history', { room: r.id, messages: history.get(r.id) }));
    io.emit('system', { text: `${user.avatar} ${nick} vừa online` });
  });

  socket.on('set_status', (data) => {
    const u = users.get(socket.id);
    if (!u) return;
    if (['available', 'busy', 'away'].includes(data && data.status)) u.status = data.status;
    if (data && typeof data.statusMsg === 'string') u.statusMsg = cleanText(data.statusMsg, 60);
    io.emit('users', publicUsers());
  });

  socket.on('room_message', (data) => {
    const u = users.get(socket.id);
    if (!u || !history.has(data && data.room)) return;
    const text = cleanText(data.text, 1000);
    if (!text) return;
    const msg = { from: u.nick, avatar: u.avatar, text, time: Date.now(), room: data.room };
    pushHistory(data.room, msg);
    io.to('room:' + data.room).emit('room_message', msg);
  });

  socket.on('private_message', (data) => {
    const u = users.get(socket.id);
    if (!u) return;
    const toId = socketByNick(cleanText(data && data.to, 24));
    const text = cleanText(data && data.text, 1000);
    if (!toId || !text) return;
    const msg = { from: u.nick, avatar: u.avatar, to: data.to, text, time: Date.now() };
    socket.to(toId).emit('private_message', msg);
    socket.emit('private_message', msg); // echo cho người gửi
  });

  socket.on('buzz', (data) => {
    const u = users.get(socket.id);
    if (!u) return;
    if (data && data.room && history.has(data.room)) {
      io.to('room:' + data.room).emit('buzz', { from: u.nick, room: data.room });
    } else if (data && data.to) {
      const toId = socketByNick(cleanText(data.to, 24));
      if (toId) socket.to(toId).emit('buzz', { from: u.nick, to: data.to });
      socket.emit('buzz', { from: u.nick, to: data.to, self: true });
    }
  });

  socket.on('typing', (data) => {
    const u = users.get(socket.id);
    if (!u) return;
    const payload = { from: u.nick, room: data && data.room, to: data && data.to, typing: !!(data && data.typing) };
    if (payload.room) socket.to('room:' + payload.room).emit('typing', payload);
    else if (payload.to) {
      const toId = socketByNick(cleanText(payload.to, 24));
      if (toId) socket.to(toId).emit('typing', payload);
    }
  });

  socket.on('disconnect', () => {
    const u = users.get(socket.id);
    if (u) {
      users.delete(socket.id);
      io.emit('users', publicUsers());
      io.emit('system', { text: `${u.nick} đã offline` });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Yahoo Chat Hồi Xưa đang chạy ở http://localhost:${PORT}`));
