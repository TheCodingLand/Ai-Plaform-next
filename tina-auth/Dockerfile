from python:latest


RUN apt-get update && apt-get install -y \
        build-essential \
        wget \
        git \
        python3-dev \
        libsasl2-dev python-dev libldap2-dev libssl-dev
ADD . .
RUN pip install -r requirements.txt

CMD [ "python3", "run.py" ]
