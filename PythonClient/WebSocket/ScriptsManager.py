import os
import platform
import subprocess


def startScript(mode, port, device):
    try:
        os.system(f"python3 websocket.py {mode} {port} ")
        if device == "Windows":
            pid = os.popen(f"netstat -ano | findstr :{port}").read()
        if device == "Linux":
            pid = os.popen(f"lsof - i :{port}").read()
        if pid:
            print("ok")
    except Exception as e:
        print(str(e))


def killScript(port, device):
    try:
        if device == "Windows":
            pid = os.popen(f"netstat -ano | findstr :{port}").read()
            if pid:
                pid = pid.split()
                print(pid[4])
                output = subprocess.Popen(f"Taskkill /PID {pid[4]} /F  ", stdout=subprocess.PIPE)
                print(output.communicate()[0])
        if device == "Linux":
            pid = os.popen(f"lsof - i :{port}").read()
            output = subprocess.Popen(f"kill  -9 {pid} ", stdout=subprocess.PIPE)
            print(output.communicate()[0])
    except Exception as e:
        print(str(e))


class ScriptsManager:

    @staticmethod
    def RestartScript(mode, port):
        device = platform.system()
        killScript(port, device)
        startScript(mode, port, device)
