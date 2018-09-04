FROM python:latest
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ADD ./requirements.txt .
RUN pip install -r requirements.txt
ADD . .
CMD python main.py
