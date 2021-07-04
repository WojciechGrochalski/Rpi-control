#!/bin/sh

/usr/sbin/httpd -d FOREGROUND
python flask_server.py