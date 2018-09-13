from python


RUN apt-get update && apt-get install -y \
        build-essential \
        wget \
        git \
        python3-dev

ADD . .
RUN pip install -r requirements.txt

CMD [ "python3", "run.py" ]
