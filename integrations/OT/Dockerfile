FROM python:latest
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ADD ./requirements.txt .
ADD ./main.py .
RUN pip install -r requirements.txt
CMD python main.py
