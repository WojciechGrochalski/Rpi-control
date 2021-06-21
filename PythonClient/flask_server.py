import asyncio
import json
import os
import platform
from threading import Thread
import subprocess
import requests
from flask import Flask, jsonify, request

import WebSocketRemoteClient


url = "http://localhost:5001/ws/dc/wojtek/123"
localurl = "ws://localhost:8085"
url2 = "wss://dockerinz.azurewebsites.net/ws"
shutdown = False

def connect_to_dotnetServer():
    url = "ws://localhost:5001/ws/wojtek" + "/" + "123"
    print("Connecting to dotnet server...")
    try:
        client = WebSocketRemoteClient.WebSocket(url)
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        connection = loop.run_until_complete(client.connect())
        tasks = [
            asyncio.ensure_future(client.receiveMessage(connection)),
            asyncio.ensure_future(client.heartbeat(connection))

        ]
        loop.run_until_complete(asyncio.wait(tasks))
    except Exception as e:
        print(str(e))
        print("Cannot connect to remote server")


app = Flask(__name__)
app.config["DEBUG"] = True

with open('AllPins.json', ) as file:
    gpios = file.read()


def change_pin(pin):
    gpio = json.loads(gpios)
    for i in range(len(gpio)):
        if gpio[i]["GPIONumber"] == pin["GPIONumber"]:
            gpio[i] = pin
    print(gpio[2])

    return json.dumps(gpio, indent=4)



@app.route('/', methods=['GET'])
def home():
    return jsonify("RpiControllApp")


@app.route('/gpio', methods=['GET'])
def get_gpio():
    return jsonify(WebSocketRemoteClient.get_gpio())


@app.route('/local/gpio', methods=['GET'])
def get_local_gpio():
    return jsonify(gpios)


@app.route('/run_server', methods=['GET'])
def run_server():
    thread = Thread(target=connect_to_dotnetServer)
    thread.daemon = True
    thread.start()
    return jsonify("Server is starting up ...")


@app.route('/reload_server', methods=['GET'])
def reload_server():
    try:
        response = requests.get(url)
        if response.status_code == 200:
            thread = Thread(target=connect_to_dotnetServer)
            thread.daemon = True
            thread.start()
            return jsonify("Server is starting up ...")
        else:
            return jsonify("Socket cant be disconnected")
    except Exception as e:
        print(str(e))


@app.route('/setMode', methods=['POST'])
def set_mode():
    mode = request.json
    mode = mode["mode"]
    try:
        if platform.system() == 'Windows':
            pid = os.popen("netstat -ano | findstr :8085").read()
            if pid:
                pid = pid.split()
                print(pid[4])
                output = subprocess.Popen(f"Taskkill /PID {pid[4]} /F  ",  stdout=subprocess.PIPE)
                print(output.communicate()[0])
        else:
            output = subprocess.Popen("pkill - f websocket.py ",  stdout=subprocess.PIPE)
            print(output.communicate()[0])
    except Exception as e:
        print(str(e))
    try:
        subprocess.Popen(f"python websocket.py {mode}")
        pid = os.popen("netstat -ano | findstr :8085").read()
        if pid:
            print("ok")
    except Exception as e:
        print(str(e))

    return jsonify(f"Start websocket in {mode=}")


@app.route('/changeGPIO', methods=['POST'])
def post():
    data = request.json
    global gpios
    gpios = change_pin(data)
    return jsonify(data)


if __name__ == '__main__':
    app.run(port=8080, threaded=True)
