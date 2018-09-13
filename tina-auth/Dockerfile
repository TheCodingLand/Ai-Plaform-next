from python:latest


RUN apt-get update && apt-get install -y \
        build-essential \
        wget \
        git \
        python3-dev \
        libsasl2-dev python-dev libldap2-dev libssl-dev



COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

ADD . .


CMD [ "python3", "run.py" ]
