import asyncio
import json

import requests
import websockets
from tools.GpioControl import GpioControl
token = ""


def change_pin(pin):
    print(f"new pin is {pin}")


def check_it_not_equal(local_gpio, remote_gpio):
    if local_gpio == remote_gpio:
        print("equal")
        return False
    else:
        print("not equal")
        return True


async def Server(websocket, path):
    invalid_user = True
    msg = await websocket.recv()
    print(f"{msg=} {token=}")
    if msg == token:
        invalid_user = False
        local_gpio = requests.get("http://localhost:8080/local/gpio/websocket").json()
        await websocket.send(local_gpio)
    while True:
        if invalid_user:
            print("invalid token")
            break
        try:
            remote_gpio = requests.get("http://localhost:8080/local/gpio/websocket").json()
            if check_it_not_equal(remote_gpio, local_gpio):
                diffrent_pins = GpioControl.get_diffrent_pins(json.loads(remote_gpio), json.loads(local_gpio))
                local_gpio = remote_gpio
                print("Send message to client")
                await websocket.send(json.dumps(diffrent_pins))

            msg = await websocket.recv()
            print(f"< {msg}")
        except websockets.exceptions.ConnectionClosed:
            print('Connection with client closed')
            break
        await asyncio.sleep(5)


def run(port, newtoken):
    global token
    token = newtoken
    start_server = websockets.serve(Server, "localhost", port)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
