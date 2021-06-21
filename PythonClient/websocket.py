import sys
from threading import Thread
from time import sleep

import WebSocketServer as ws
import WebSocketClient
import asyncio

import flask_server

url = "ws://localhost:5001/ws/wojtek"
localurl = "ws://localhost:8085"
url2 = "wss://dockerinz.azurewebsites.net/ws"

mode = sys.argv[1]
if sys.argv[2:]:
    auth = sys.argv[2]
    url += "/" + auth
else:
    url = localurl


def shutdown():
    while True:
        exit_signal = flask_server.shutdown
        if exit_signal:
            sys.exit()
        sleep(2)


thread = Thread(target=shutdown)
thread.daemon = True

if mode == "Server":
    print("Server Up")
    thread.start()
    ws.run()
if mode == "Client":
    print("Connecting to  server...")
    print(url)
    thread.start()
    client = WebSocketClient.WebSocket(url)
    loop = asyncio.get_event_loop()
    connection = loop.run_until_complete(client.connect())
    tasks = [
        asyncio.ensure_future(client.receiveMessage(connection)),
        asyncio.ensure_future(client.heartbeat(connection))

    ]
    loop.run_until_complete(asyncio.wait(tasks))
