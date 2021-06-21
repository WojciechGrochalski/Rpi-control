import asyncio

import requests

import flask_server
import websockets


def check_it_not_equal(actualgpios, gpios):
    if actualgpios == gpios:
        print("equal")
        return False
    else:
        print("not equal")
        return True


async def Server(websocket, path):
    gpios = requests.get("http://localhost:8080/local/gpio").json()
    await websocket.send(gpios)
    while True:
        try:
            newgpios = requests.get("http://localhost:8080/local/gpio").json()
            if check_it_not_equal(newgpios, gpios):
                print("Send message to client")
                await websocket.send(newgpios)
                gpios = newgpios
            msg = await websocket.recv()
            print(f"< {msg}")
        except websockets.exceptions.ConnectionClosed:
            print('Connection with client closed')
            break
        await asyncio.sleep(5)


def run():
    start_server = websockets.serve(Server, "localhost", 8085)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
