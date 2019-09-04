import socketio


SOCKET_CONNECT_URL = 'http://localhost:4000'


def sendChat(message):
    sio.emit('chat', message)


if __name__ == "__main__":
    sio = socketio.Client()
    sio.connect(SOCKET_CONNECT_URL)
    sendChat('hello world')
    sio.disconnect()
