FROM python:latest

RUN apt-get update && apt-get install -y \
        build-essential \
        wget \
        git \
        python3-dev \
        unixodbc-dev

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt
ADD . /usr/src/app
RUN redisreader.py