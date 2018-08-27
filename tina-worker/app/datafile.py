class datafile(object):
    name=""
    supervised=False
    filename=""
    version =""
    label = ""
    fullpath=""
    def __init__(self, filename, name, supervised, version =1,label="default" ):
        self.name= name
        self.supervised = supervised
        self.filename = filename
        self.version = version
        self.label= label
        self.fullpath = f"{DATADIR}/{name}/{version}/{filename}"