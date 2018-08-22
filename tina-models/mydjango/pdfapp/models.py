from django.db import models


class Dataset(models.Model):
    name = models.CharField(max_length=250, unique=True)
    size = models.CharField(max_length=150, unique=False, blank=True, null=True)
    filepath =models.CharField(max_length=200, null = True,unique=False)
    filename =models.CharField(max_length=200, null = True,unique=False)
        
    def __str__(self):
        return "%s" % self.name

class Language(models.Model):
    name = models.CharField(max_length=2000, null = True)  
    def __str__(self):
        return "%s" % self.name

 

class Model(models.Model):
    name =models.CharField(max_length=200, null = True,unique=False) 
    version = models.CharField(max_length=2000, unique=True, null = True)
    epoch = models.CharField(max_length=2000, unique=False, null = True)
    dataset = models.ManyToManyField(Dataset, related_name='models')
    languages = models.ManyToManyField(Language, related_name='models')      
    def __str__(self):
        return "%s" % self.text


class Event(models.Model):

    title = models.CharField(max_length=2000, null = True)  
    text = models.CharField(max_length=2000, null = True)
    error = models.CharField(max_length=2000, null = True)
    def __str__(self):
        return "%s" % self.title

