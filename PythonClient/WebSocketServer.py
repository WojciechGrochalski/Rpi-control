import asyncio
import pickle

import websockets


def check_it_not_equal(actualgpios, gpios):
    if actualgpios == gpios:
        print("equal")
        return False
    else:
        print("not equal")
        return True


async def Server(websocket, path):
    with open("gpio.pkl", "rb") as fp:
        gpios = pickle.load(fp)
    await websocket.send(gpios)
    while True:
        try:
            with open("gpio.pkl", "rb") as fpc:
                newgpios = pickle.load(fpc)
            if check_it_not_equal(newgpios, gpios):
                print("Send message to client")
                await websocket.send(newgpios)
                gpios = newgpios
            msg = await websocket.recv()
            print(f"< {msg}")
        except websockets.exceptions.ConnectionClosed:
            print('Connection with client closed')
            break
        await asyncio.sleep(3)


def run():
    start_server = websockets.serve(Server, "localhost", 8085)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
