FROM alpine:latest
ARG DOMAIN
ENV DOMAIN=$DOMAIN

# install zsign + other dependencies
RUN apk update && apk add git nodejs npm cmake make g++ openssl-dev zlib-dev zip && \
    git clone --depth=1 https://github.com/asdfzxcvbn/zsign.git && mkdir -p zsign/build && cd zsign/build && \
    cmake .. && make && cp zsign /usr/local/bin/zsign

# getting askuasign
RUN cd && git clone https://github.com/QuixThe2nd/AskuaSign.git && cd AskuaSign && git checkout 1987bb7 && \
    npm install && sed -i "3s|.*|JWTToken=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 39)|" .env && \
    sed -i "4s|.*|Domain=$DOMAIN|" .env && sed -i "1s|localhost|10.89.0.5|" .env

EXPOSE 3000
WORKDIR /root/AskuaSign
CMD [ "node", "." ]
