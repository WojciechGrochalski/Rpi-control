import asyncio
import datetime
import json
import requests
import websockets

from Rpi import Rpi
from myTools.ControlGpio import GpioControl

token = ""


def get_first_free_name(client, listOfClients):
    count = 1
    new_name = client
    if len(listOfClients) > 0:
        is_free = any(item['Name'] == client for item in listOfClients)
        while is_free:
            new_name = client + '_' + str(count)
            print(new_name)
            is_free = any(item['Name'] == new_name for item in listOfClients)
            count += 1
    return new_name


def check_it_not_equal(local_gpio, remote_gpio):
    if local_gpio == remote_gpio:
        print("equal")
        return False
    else:
        print("not equal")
        return True


async def Server(websocket, path):
    invalid_user = True
    # token
    msg = await websocket.recv()
    if msg == token:
        # hostname
        invalid_user = False
        local_gpio = requests.get("http://localhost:5000/local/gpio/websocket").json()
        await websocket.send(local_gpio)
    while True:
        if invalid_user:
            print("invalid token")
            break
        try:
            client = await websocket.recv()
            try:
                listOfClients = requests.get("http://localhost:5000/clients").json()
                print(type(listOfClients))
                print(listOfClients)
                name = get_first_free_name(str(client), json.loads(listOfClients))
                new_client = {"Name": name, "Lastactivity": str(datetime.datetime.now())}
                requests.post("http://localhost:5000/newClient", json=json.dumps(new_client))
            except Exception as e:
                new_client = {"Name": client, "Lastactivity": str(datetime.datetime.now())}
                requests.post("http://localhost:5000/newClient", json=json.dumps(new_client))
                print(str(e))
            remote_gpio = requests.get("http://localhost:5000/local/gpio/websocket").json()
            if check_it_not_equal(remote_gpio, local_gpio):
                diffrent_pins = GpioControl.get_diffrent_pins(json.loads(remote_gpio), json.loads(local_gpio))
                local_gpio = remote_gpio
                print("Send message to client")
                GpioControl.change_pin(diffrent_pins)
                await websocket.send(diffrent_pins)
            print(f"< {msg}")
        except websockets.exceptions.ConnectionClosed:
            print('Connection with client closed')
            break
        await asyncio.sleep(5)


def run(port, newtoken):
    global token
    token = newtoken
    start_server = websockets.serve(Server, "0.0.0.0", port)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
