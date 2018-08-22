from flask_socketio import SocketIO, emit
from flask import Flask, current_app, request, render_template

import os, uuid, json
from threading import Lock
thread = None
thread_lock = Lock()
async_mode=None
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)

def background_thread():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        socketio.sleep(10)
        count += 1
        socketio.emit('my_response',
                      {'data': 'Server generated event', 'count': count},
                      namespace='/test')

@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)

@socketio.on('connect', namespace='/test')
def test_connect():
    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(target=background_thread)
    emit('my_response', {'data': 'Connected', 'count': 0})

@socketio.on('connected')
def connected():
    print ("%s connected" % (request.sid))


@socketio.on('disconnect')
def disconnect():
    print ( "%s disconnected" % (request.sid))


@socketio.on('message')
def onmessage(origin, message):
    """analyzes message rom client"""
    socketio.emit("test")
    print(message)
    print(origin)
    return message  # allow the upload


@socketio.on('write-chunk')
def write_chunk(filename, offset, data):
    """Write a chunk of data sent by the client."""
    if not os.path.exists(current_app.config['FILEDIR'] + filename):
        return False
    try:
        with open(current_app.config['FILEDIR'] + filename, 'r+b') as f:
            f.seek(offset)
            f.write(data)
    except IOError:
        return False
    return True