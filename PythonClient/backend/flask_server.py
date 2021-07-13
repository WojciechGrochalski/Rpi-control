import os
from flask import Flask, jsonify, request, abort
from flask_cors import CORS, cross_origin
import datetime
import json
import platform
import time
from datetime import datetime as dt
from Rpi import Rpi
from WebSocketScripts import WebSocketRemoteClient
from WebSocketScripts.ScriptsManager import ScriptsManager
from myTools import TokenManager
from myTools.ControlGpio import GpioControl

localurl = "ws://localhost:8085"
jwt_token = ""
RpiClients = []

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*", 'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'}})




def removeDisconnectedClients():
    global RpiClients
    for item in RpiClients:
        lastactivity = dt.strptime(item['Lastactivity'], '%Y-%m-%d %H:%M:%S.%f')
        diff = datetime.datetime.now() - lastactivity
        if diff.seconds > 60:
            print("removed ", item)
            RpiClients.remove(item)


def addClientToList(client):
    if len(RpiClients) > 0:
        for item in RpiClients:
            if item['Name'] == client['Name']:
                item.update({"Name": client['Name'], "Lastactivity": str(datetime.datetime.now())})
            else:
                RpiClients.append(client)
    else:
        RpiClients.append(client)


def change_pin(pins):
    gpio = json.loads(gpios)
    if type(pins) == dict:
        for i in range(len(gpio)):
            if gpio[i]["GPIONumber"] == pins["GPIONumber"]:
                gpio[i] = pins
    else:
        for i in range(len(gpio)):
            for j in range(len(pins)):
                if gpio[i]["GPIONumber"] == pins[j]["GPIONumber"]:
                    gpio[i] = pins[j]
    return json.dumps(gpio, indent=4)


@app.route('/', methods=['GET'])
def home():
    response = jsonify("RpiControllApp")
    return response


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
    new_client = request.json
    t = json.loads(new_client)
    client = {"Name": t['Name'], "Lastactivity": str(datetime.datetime.now())}
    addClientToList(client)
    return jsonify("ok")


@app.route('/clients', methods=['GET'])
def get_rpi_clients():
    global RpiClients
    print(RpiClients)
    if len(RpiClients) > 0:
        removeDisconnectedClients()
        return jsonify(RpiClients)
    else:
        return jsonify("No Clients")


@app.route('/gpio', methods=['GET'])
def get_gpio():
    return jsonify(WebSocketRemoteClient.get_gpio())


@app.route('/local/gpio', methods=['GET'])
def get_local_gpio():
    return jsonify(json.loads(gpios))


@app.route('/local/gpio/websocket', methods=['GET'])
def get_local_gpio_ws():
    global gpios
    if type(gpios) == type(list):
        gpios = json.dumps(gpios)
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
    try:
        result = ScriptsManager.RunWebsocketClient(ip, port, token)
        if result:
            response = jsonify(result)
            time.sleep(2)
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


# nie działa chyba
@app.route('/changeGPIO', methods=['POST'])
def post():
    data = request.json
    print(str(data))
    data = change_pin(data)
    global gpios
    gpios = data
    with open("AllPins.json", "w") as out_file:
        newGpio = json.loads(gpios)
        json.dump(newGpio, out_file, indent=4)
    return jsonify("ok")


@app.route('/changeLocalGPIO', methods=['POST'])
def ChangeLocalGPIO():
    data = request.json
    print(str(data))
    global gpios
    gpios = change_pin(data)
    newGpio = json.loads(gpios)
    #GpioControl.change_pin(newGpio)
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

    with open("LocalPins.json") as file:
        gpios = file.read()
    if platform.machine() == "armv7l":
        local_pins = json.loads(gpios)
        local_pins = GpioControl.get_local_status(local_pins)
        gpios = json.dumps(local_pins)
        with open("LocalPins.json", "w") as outfile:
            json.dump(local_pins, outfile, indent=4)
    # addres = str(os.environ['ip'])
    app.run(host='0.0.0.0', port=5000, threaded=True, debug=True)

    with open("LocalPins.json", "w") as outfile:
        gpios = json.loads(gpios)
        json.dump(gpios, outfile, indent=4)
