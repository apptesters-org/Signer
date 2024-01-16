FROM alpine:latest
ARG DOMAIN
ENV DOMAIN=$DOMAIN

# install zsign + other dependencies
RUN apk update && apk add git nodejs npm cmake make g++ openssl-dev zlib-dev zip && \
    git clone --depth=1 https://github.com/asdfzxcvbn/zsign.git && mkdir -p zsign/build && cd zsign/build && \
    cmake .. && make && cp zsign /usr/local/bin/zsign

# getting askuasign
RUN cd && git clone --depth=1 https://github.com/Athenua/AskuaSign.git && cd AskuaSign && \
    npm install && sed -i "3s|.*|JWTToken=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 39)|" .env && \
    sed -i "4s|.*|Domain=$DOMAIN|" .env && sed -i "1s|localhost|mongo|" .env

EXPOSE 3000
WORKDIR /root/AskuaSign
CMD [ "node", "." ]
