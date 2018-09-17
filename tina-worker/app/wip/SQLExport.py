import pyodbc
import json
import collections
import os
from datetime import datetime

USER = os.environ.get('SQL_USER')
PASSWORD = os.environ.get('SQL_PASSWORD')
SERVER = os.environ.get('SQL_SQLSERVER')
DB = os.environ.get('SQL_DATABASE')
ROWS = os.environ.get('ROWS')
TABLE = os.environ.get('TABLE')

USER = "rcsl.lu\\adminctg"
PASSWORD = "Ctgsup*0322"
SERVER = "sqlrcsl01"
DB = "OmniProd"
TABLE = "dbo.incidents"
ROWS="Subject;Body_Plain_Text"
FILENAME = "EMAILS"
SELECT_ROWS = ROWS.split(';')

connstr = f'DRIVER={{SQL Server}};SERVER={SERVER};DATABASE={DB};user Id={USER}; Password={PASSWORD}'
conn = pyodbc.connect(connstr)
cursor = conn.cursor()
query = "SELECT"

for ROW in SELECT_ROWS:
    query = f"{query!s} {ROW!s},"
query = query[:-1] #remove last comma
query = f"{query} FROM {TABLE!s}"

print (query)
cursor.execute(query)
rows = cursor.fetchall()

# Convert query to objects of key-value pairs
objects_list = []
for row in rows:
    d = collections.OrderedDict()
    for key in SELECT_ROWS:
        value = getattr(row, key)
        if isinstance(value, datetime):
            value = f"{value!s}"
        d[key] = value
        
    
    objects_list.append(d)

j = json.dumps(objects_list)
objects_file = f'{FILENAME}.json'
f = open(objects_file,'w')
print (j,end="\n", file=f)
conn.close()



