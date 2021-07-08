
FROM node:14-buster as build-step

RUN mkdir -p /app

WORKDIR /app

COPY front/package.json /app
COPY front/package-lock.json /app

RUN npm install

COPY front/. /app

RUN npm run build --prod


# FROM python:3.8-slim as finall

# WORKDIR /server

# COPY backend/requirements.txt /server 
# RUN apt-get update && \
# 		apt-get install -y  gcc musl-dev \
# 	    apache2 \
#  		&& pip install  --no-cache-dir -r requirements.txt \
# 		  && pip install --no-cache-dir RPi.GPIO 


# FROM python:3.8-slim as end

# # RUN apk add --no-cache --update \
# # 	    apache2 

# #RUN echo "ServerName localhost" >> /etc/apache2/httpd.conf

# COPY backend/. /server
# WORKDIR /python
# COPY --from=finall  /usr/local/lib/python3.8/site-packages /usr/local/lib/python3.8/site-packages
# ENV PATH=/root/.local/bin:$PATH
# #COPY --from=build-step /app/dist /var/www/localhost/htdocs
# WORKDIR /server
# COPY start.sh /server
# RUN chmod +x start.sh
# EXPOSE  80
# EXPOSE 5000 
# EXPOSE 8085
# CMD ["sh", "start.sh"]

FROM python:3.8.9-alpine3.13 as pythonBuilder
WORKDIR /home/root/server
# any dependencies in python which requires a compiled c/c++ code (if any)
COPY backend/app/requirements.txt /home/root/server/
RUN apk update && apk add --update gcc libc-dev linux-headers libusb-dev
RUN pip3 install --target=/home/root/server/dependencies  -r requirements.txt RPi.GPIO 

FROM python:3.8.9-alpine3.13
WORKDIR /home/root/server
# include runtime libraries (if any)
RUN apk --no-cache update && apk add libusb-dev apache2
COPY --from=pythonBuilder   /home/root/server .
ENV PYTHONPATH="${PYTHONPATH}:/home/root/server/dependencies"
COPY start.sh /home/root/server/
RUN chmod +x start.sh
COPY backend/app/. .
RUN echo "ServerName localhost" >> /etc/apache2/httpd.conf
COPY --from=build-step /app/dist /var/www/localhost/htdocs
EXPOSE 5000
EXPOSE 8085
EXPOSE 80
CMD ["sh", "/home/root/server/start.sh"]

