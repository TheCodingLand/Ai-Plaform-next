FROM python:latest

# set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app



# install requirements
ADD ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt


WORKDIR /usr/src/app
# run server
ADD . /usr/src/app/
CMD gunicorn -k flask_sockets.worker server:app
#CMD python manage.py runserver -h '0.0.0.0'
