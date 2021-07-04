
FROM node:16-alpine as build-step

RUN mkdir -p /app

WORKDIR /app

COPY front/package.json /app
COPY front/package-lock.json /app

RUN npm install

COPY front/. /app

RUN npm run build --prod


FROM python:3.8-alpine as finall

WORKDIR /server

COPY backend/requirements.txt /server 
RUN apk add --no-cache --update \
	    apache2 \
 		&& pip install  --no-cache-dir -r requirements.txt

RUN echo "ServerName localhost" >> /etc/apache2/httpd.conf

COPY backend/. /server
COPY --from=build-step /app/dist /var/www/localhost/htdocs
WORKDIR /server
COPY start.sh /server
RUN chmod +x start.sh
EXPOSE  80
EXPOSE 5000 
CMD ["sh", "start.sh"]