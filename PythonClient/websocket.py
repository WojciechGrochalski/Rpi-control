import sys
import WebSocketServer as ws
import WebSocketClient
import asyncio


url = "ws://localhost:5001/ws/wojtek"
localurl = "ws://localhost:8085"
url2 = "wss://dockerinz.azurewebsites.net/ws"

mode = sys.argv[1]
if sys.argv[2:]:
    auth = sys.argv[2]
    url += "/" + auth
else:
    url = localurl
exit_signal = False
if mode == "Server":
    print("Server Up")
    ws.run()
    if exit_signal:
        sys.exit()
if mode == "Client":
    print("Connecting to dotnet server...")
    print(url)
    client = WebSocketClient.WebSocket(url)
    loop = asyncio.get_event_loop()
    connection = loop.run_until_complete(client.connect())
    tasks = [
        asyncio.ensure_future(client.receiveMessage(connection)),
        asyncio.ensure_future(client.heartbeat(connection))

    ]
    loop.run_until_complete(asyncio.wait(tasks))
    if exit_signal:
        sys.exit()
#
