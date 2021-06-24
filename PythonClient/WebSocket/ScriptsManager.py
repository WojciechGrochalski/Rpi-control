import os
import platform
import subprocess


def startScript(mode):
    try:
        subprocess.Popen(f"python websocket.py {mode}")
        pid = os.popen("netstat -ano | findstr :8085").read()
        if pid:
            print("ok")
    except Exception as e:
        print(str(e))


def killScript():
    try:
        if platform.system() == 'Windows':
            pid = os.popen("netstat -ano | findstr :8085").read()
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
    def RestartScript(mode):
        killScript()
        startScript(mode)
