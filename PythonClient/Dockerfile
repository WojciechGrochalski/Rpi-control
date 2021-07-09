
FROM node:14-buster as build-step

RUN mkdir -p /app
WORKDIR /app
COPY front/package.json /app
COPY front/package-lock.json /app
RUN npm install
COPY front/. /app
RUN npm run build --prod



FROM python:3.8-slim as pythonBuilder
WORKDIR /home/root/server
# any dependencies in python which requires a compiled c/c++ code (if any)
COPY backend/requirements.txt /home/root/server/
RUN apt-get update && apt-get install -y --no-install-recommends  gcc libc-dev  libusb-dev musl-dev 
RUN pip install --upgrade pip
RUN pip3 install --target=/home/root/server/dependencies  -r requirements.txt 
RUN pip3 install --target=/home/root/server/dependencies  RPi.GPIO 

FROM python:3.8.9-alpine3.13
WORKDIR /home/root/server
# include runtime libraries (if any)
RUN apk --no-cache update && apk add libusb-dev apache2
COPY --from=pythonBuilder   /home/root/server .
ENV PYTHONPATH="${PYTHONPATH}:/home/root/server/dependencies"
COPY start.sh /home/root/server/
RUN chmod +x start.sh
COPY backend/. .
RUN echo "ServerName localhost" >> /etc/apache2/httpd.conf
COPY --from=build-step /app/dist /var/www/localhost/htdocs
EXPOSE 5000
EXPOSE 8085
EXPOSE 80
CMD ["sh", "/home/root/server/start.sh"]

