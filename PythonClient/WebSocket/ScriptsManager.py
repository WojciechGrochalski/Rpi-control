import os
import platform
import subprocess


def getPID(pid, device):
    if device == "Windows":
        pid = pid.split()
        print(pid[4])
        return pid[4]
    if device == "Linux":
        pid = pid.split()
        print(pid[1])
        return pid[10]


def startScript(port, mode, token,  device, ip='127.0.0.1'):
    try:
        if device == "Windows":
            os.system(f"start /b python websocket.py {mode} {ip} {port} {token} ")
            pid = os.popen(f"netstat -ano | findstr :{port}").read()
        if device == "Linux":
            os.system(f"python3 websocket.py {mode} {ip} {port} {token} & ")
            pid = os.popen(f"lsof -i :{port}").read()
        if pid:
            print("ok websocket is runnig")
            return True
        return False
    except Exception as e:
        print(str(e))
        return False


def killScript(port, device):
    try:
        if device == "Windows":
            pid = os.popen(f"netstat -ano | findstr :{port}").read()
            if pid:
                pid = getPID(pid, device)
                output = subprocess.Popen(f"Taskkill /PID {pid} /F  ", stdout=subprocess.PIPE)
                print(output.communicate()[0])
        if device == "Linux":
            pid = os.popen(f"lsof -i :{port}").read()
            pid = getPID(pid, device)
            output = subprocess.Popen(f"kill  -9 {pid} ", stdout=subprocess.PIPE)
            print(output.communicate()[0])
    except Exception as e:
        print(str(e))


class ScriptsManager:

    @staticmethod
    def RestartScript(mode, port, token):
        device = platform.system()
        killScript(port, device)
        return startScript(port, mode, token, device)

    @staticmethod
    def RunWebsocketClient(ip, port, token):
        device = platform.system()
        return startScript(port, "Client", token, device, ip)
