class prediction():
    name=""
    confidence=0
    success = False
    ignored = False
    correct = ""
    def __init__(self, prediction, correct,k):
        self.name = prediction[k][0]
        self.confidence = prediction[k][1]
        self.correct = correct
        