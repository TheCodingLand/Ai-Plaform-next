FROM python:latest

# set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
        build-essential \
        wget \
        git \
        python3-dev \
        libsasl2-dev python-dev libldap2-dev libssl-dev

# install requirements
ADD ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt


WORKDIR /usr/src/app
# run server
ADD . /usr/src/app/

CMD gunicorn -b 0.0.0.0:5000 manage:app --timeout 13600
#CMD python manage.py runserver -h '0.0.0.0'
