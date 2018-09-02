
DATADIR = "/data/datasets"


class Dataset(object):
    name = ""
    splitted = True
    id = ""
    supervised = False
    filename = ""
    version = ""
    label = ""
    fullpath = ""

    def __init__(self, filename, name, supervised, version=1, label="default", splitted=True):
        self.name = name
        self.splitted = splitted
        self.supervised = supervised
        self.filename = filename
        self.version = version
        self.label = label
        self.fullpath = f"{DATADIR}/{name}/{version}/{filename}"

    def toDict(self):
        return {"name": self.name, "version": self.version, "label": self.label}
