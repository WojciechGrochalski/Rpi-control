import asyncio
import datetime
import json
import platform
import time
from datetime import datetime as dt
from threading import Thread
import requests
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from Rpi import Rpi
from WebSocketScripts import WebSocketRemoteClient
from WebSocketScripts.ScriptsManager import ScriptsManager
from myTools import TokenManager
from pythonScript.myTools.GpioControl import GpioControl


localurl = "ws://localhost:8085"
jwt_token = ""
RpiClients = []


def removeDisconnectedClients():
    for item in RpiClients:
        lastactivity = dt.strptime(item.Lastactivity, '%Y-%m-%d %H:%M:%S.%f')
        diff = datetime.datetime.now() - lastactivity
        if diff.seconds > 25:
            RpiClients.remove(item)


def addClientToList(client):
    if len(RpiClients) > 0:
        for item in RpiClients:
            if item.Name == client.Name:
                item = client
            else:
                RpiClients.append(client)
    else:
        RpiClients.append(client)




app = Flask(__name__)
app.config["DEBUG"] = True
cors = CORS(app, resources={
    r"/*": {"origins": ["http://localhost:4200/*", "http://localhost:80/*", "http://localhost:8080/*"]}})


def change_pin(pin):
    gpio = json.loads(gpios)
    for i in range(len(gpio)):
        if gpio[i]["GPIONumber"] == pin["GPIONumber"]:
            gpio[i] = pin
    return json.dumps(gpio, indent=4)


@app.route('/', methods=['GET'])
def home():
    return jsonify("RpiControllApp")


@app.route('/getToken', methods=['GET'])
def getToken():
    token = TokenManager.decode_token(jwt_token)
    if token:
        return jsonify(jwt_token)
    else:
        abort(404)


@app.route('/createToken', methods=['GET'])
def createToken():
    global jwt_token
    jwt_token = TokenManager.create_token(platform.node())
    response = jsonify(jwt_token)
    response.status_code = 201
    return response


@app.route('/newClient', methods=['POST'])
def get_new_client():
    client = request.json
    print(client['name'])
    print(client['lastactivity'])
    name = client['name']
    new_client = Rpi(name, client['lastactivity'])
    addClientToList(new_client)
    return jsonify("ok")


@app.route('/clients', methods=['GET'])
def get_rpi_clients():
    removeDisconnectedClients()
    json_string = json.dumps([ob.__dict__ for ob in RpiClients])
    return json_string


@app.route('/gpio', methods=['GET'])
def get_gpio():
    return jsonify(WebSocketRemoteClient.get_gpio())


@app.route('/local/gpio', methods=['GET'])
def get_local_gpio():
    return jsonify(json.loads(gpios))


@app.route('/local/gpio/websocket', methods=['GET'])
def get_local_gpio_ws():
    return jsonify(gpios)





@app.route('/shutdown_server', methods=['GET'])
def shutdown_server():
    ScriptsManager.KillScript(8085)
    return jsonify("Server is shutdown")




@app.route('/setMode', methods=['POST'])
def set_mode():
    data = request.json
    mode = data["mode"]
    port = data["port"]
    token = data["token"]
    ScriptsManager.RestartScript(mode, port, token)
    response = jsonify(f"Start websocket in {mode}")
    return response


@app.route('/connect', methods=['POST'])
def connect_to_server():
    data = request.json
    ip = data["ip"]
    port = data["port"]
    token = data["token"]
    print(f"{ip=} {port=} {token=}")
    try:
        result = ScriptsManager.RunWebsocketClient(ip, port, token)
        if result:
            response = jsonify(result)
            time.sleep(3)
            if ScriptsManager.CheckWebsocketStatus(port):
                response.status_code = 200
            else:
                response.status_code = 409
        else:
            response = jsonify(result)
            response.status_code = 409
    except Exception as e:
        print(str(e))
        response = jsonify(result)
        response.status_code = 409

    return response


@app.route('/changeGPIO', methods=['POST'])
def post():
    data = request.json
    print(str(data))
    global gpios
    gpios = change_pin(data)
    with open("AllPins.json", "w") as out_file:
        newGpio = json.loads(gpios)
        json.dump(newGpio, out_file, indent=4)
    return jsonify(data)


@app.route('/disconnect', methods=['POST'])
def disconnect():
    data = request.json
    port = data["port"]
    ScriptsManager.KillScript(port)
    response = jsonify("disconnected")
    response.status_code = 200
    return response


if __name__ == '__main__':

    with open('AllPins.json') as file:
        gpios = file.read()
    if platform.machine() == "armv7l":
        local_pins = GpioControl.get_local_status(json.loads(gpios))
        with open("LocalPins.json", "w") as outfile:
            json.dump(local_pins, outfile, indent=4)
        gpios = json.dumps(gpios)
    app.run(host="0.0.0.0", port=5000, threaded=True)
    # with open("AllPins.json", "w") as outfile:
    #     gpios = json.loads(gpios)
    #     json.dump(gpios, outfile, indent=4)
