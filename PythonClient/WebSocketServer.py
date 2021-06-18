import asyncio
import websockets

pin = "xd"
async def Server(websocket, path):
    while True:
        try:
            msg = await websocket.recv()
            print(f"< {msg}")
            await websocket.send("msg from server")
            if pin == "xd":
                await websocket.send(pin)

        except websockets.exceptions.ConnectionClosed:
            print('Connection with client closed')
            break
        await asyncio.sleep(1)




def run():
    start_server = websockets.serve(Server, "localhost", 8085)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
