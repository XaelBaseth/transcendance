#BUILD FRONT
FROM node:lts-alpine as build

RUN mkdir app
WORKDIR /app/

COPY frontend/package*.json ./
RUN npm install
COPY ./frontend /app/frontend

RUN npm run build --prefix ./frontend

#BUILD NGINX
FROM nginx:1.22.1

# Install necessary packages for building ModSecurity module
RUN apt update && apt upgrade  -y
RUN apt-get install -y libmaxminddb-dev \
					bison \
					libperl-dev  \        
					build-essential \
					ca-certificates \
					curl \
					dh-autoreconf \
					doxygen \
					flex \
					gawk \
					git \
					make \
					iputils-ping \
					libcurl4-gnutls-dev \
					libexpat1-dev \
					libgeoip-dev \
					liblmdb-dev \
					libpcre3-dev \
					libssl-dev \
					libtool \
					libxml2 \
					libxml2-dev \
					libyajl-dev \
					locales \
					lua5.3-dev \
					pkg-config \
					wget \
					yajl-tools \
					zlib1g-dev \
					libxslt-dev \
					libgd-dev \
					systemctl

# Clone ModSecurity repository && install it
WORKDIR /tmp
RUN git clone https://github.com/SpiderLabs/ModSecurity
WORKDIR /tmp/ModSecurity
RUN git submodule init 
RUN git submodule update
RUN ./build.sh
RUN ./configure
RUN make -j16
RUN make install

#Clone and setup ModSecurity-nginx
WORKDIR /opt
RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git
RUN wget http://nginx.org/download/nginx-1.22.1.tar.gz
RUN tar -xvzmf nginx-1.22.1.tar.gz
WORKDIR /opt/nginx-1.22.1
RUN ./configure --with-compat --add-dynamic-module=../ModSecurity-nginx
RUN make modules
RUN mkdir -p /etc/nginx/modules && cp objs/ngx_http_modsecurity_module.so /etc/nginx/modules

#Custom Rules
WORKDIR /app
RUN mkdir -p /opt/modsecurity/var/log/
RUN rm -rf /etc/nginx/nginx.conf
RUN git clone https://github.com/coreruleset/coreruleset /usr/local/modsecurity-crs
RUN mv /usr/local/modsecurity-crs/crs-setup.conf.example \
	/usr/local/modsecurity-crs/crs-setup.conf
RUN mv /usr/local/modsecurity-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf.example \
	/usr/local/modsecurity-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf
COPY ./nginx/modsecurity/modsec /etc/nginx/modsec
RUN rm -rf /etc/nginx/sites-available/default
RUN cp /opt/nginx-1.22.1/objs/*.so /etc/nginx/modules/
COPY ./nginx/modsecurity/modules/test.conf /etc/nginx/modules-enabled/test.conf

#Nginx classic
WORKDIR /app
RUN rm -rf /var/www/html
RUN mkdir -p /etc/nginx/ssl
COPY --from=build /app/frontend/dist /var/www/html
COPY ./nginx/default.conf /etc/nginx/default.conf
#COPY ./nginx/nginx_start.sh /etc/nginx/nginx_start.sh
#RUN chmod +x /etc/nginx/nginx_start.sh

EXPOSE 8000

COPY ./nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]


