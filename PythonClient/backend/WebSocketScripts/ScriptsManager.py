import os
import platform
import subprocess
import time


def disconnect(port, device):
    try:
        while CheckStatus(port, device):
            killScript(port, device)
            time.sleep(1)
    except Exception as e:
        print(str(e))


def getPID(pid, device):
    if device == "Windows":
        pid = pid.split()
        print(pid[4])
        return pid[4]
    if device == "Linux":
        pid = pid.split()
        print(pid[1])
        #linux_pid = pid[6]
        return pid[1]
    if device == "Darwin":
        pid = pid.split()
        print(pid[1])
        return pid[1]


def startScript(port, mode, token, device, ip='127.0.0.1'):
    pid = None
    try:
        if device == "Windows":
            os.system(f"python websocket.py {mode} {ip} {port} {token} ")
            pid = os.popen(f"netstat -ano | findstr :{port}").read()
        if device == "Linux":
            os.system(f"python3 websocket.py {mode} {ip} {port} {token} & ")
            time.sleep(1)
            pid = os.popen(f"lsof -i 4 | grep {port}").read()
        if device == "Darwin":
            os.system(f"python3 websocket.py {mode} {ip} {port} {token} & ")
            pid = os.popen(f"lsof -nP -i4TCP:${port} | grep LISTEN").read()
        if pid:
            print("ok websocket is runnig")
            return True
        return False
    except Exception as e:
        print(str(e))
        return False


def CheckStatus(port, device) -> bool:
    pid = None
    try:
        if device == "Windows":
            pid = os.popen(f"netstat -ano | findstr :{port}").read()
        if device == "Linux":
            pid = os.popen(f"lsof -i 4 | grep {port}").read()
        if device == "Darwin":
            pid = os.popen(f"lsof -nP -i4TCP:${port} | grep LISTEN").read()
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
            pid = os.popen(f"lsof -i 4 | grep {port}").read()
            if pid:
                pid = getPID(pid, device)
                os.kill(int(pid), 9)
        if device == "Darwin":
            pid = os.popen(f"lsof -nP -i4TCP:${port} | grep LISTEN").read()
            if pid:
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
        print("ok websocket is runnig")
        return startScript(port, mode, token, device)

    @staticmethod
    def KillScript(port):
        device = platform.system()
        disconnect(port, device)

    @staticmethod
    def CheckWebsocketStatus(port):
        device = platform.system()
        return CheckStatus(port, device)

    @staticmethod
    def RunWebsocketClient(ip, port, token):
        device = platform.system()
        return startScript(port, "Client", token, device, ip)




