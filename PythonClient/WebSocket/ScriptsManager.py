import os
import platform
import subprocess


def startScript(mode, port):
    try:
        subprocess.Popen(f"python websocket.py {mode} {port}")
        pid = os.popen(f"netstat -ano | findstr :{port}").read()
        if pid:
            print("ok")
    except Exception as e:
        print(str(e))


def killScript(port):
    try:
        if platform.system() == 'Windows':
            pid = os.popen(f"netstat -ano | findstr :{port}").read()
            if pid:
                pid = pid.split()
                print(pid[4])
                output = subprocess.Popen(f"Taskkill /PID {pid[4]} /F  ", stdout=subprocess.PIPE)
                print(output.communicate()[0])
        else:
            output = subprocess.Popen("pkill - f websocket.py ", stdout=subprocess.PIPE)
            print(output.communicate()[0])
    except Exception as e:
        print(str(e))


class ScriptsManager:

    @staticmethod
    def RestartScript(mode, port):
        killScript(port)
        startScript(mode, port)
