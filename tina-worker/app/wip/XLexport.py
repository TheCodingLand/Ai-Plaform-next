import xlrd
from collections import OrderedDict
import simplejson as json
# Open the workbook and select the first worksheet
wb = xlrd.open_workbook('tickets.xlsx')
sh = wb.sheet_by_index(1)
# List to hold dictionaries
cars_list = []
titles = sh.row_values(0)

print(titles)

# Iterate through each row in worksheet and fetch values into dict
for rownum in range(1, sh.nrows):
    cars = OrderedDict()
    row_values = sh.row_values(rownum)
    cars[titles[0]] = row_values[0]
    cars[titles[1]] = row_values[1]
    cars[titles[2]] = row_values[2]
    cars[titles[3]] = row_values[3]
    cars[titles[4]] = row_values[4]
    cars[titles[5]] = row_values[5]
    cars[titles[6]] = row_values[6]
    cars[titles[7]] = row_values[7]
   
  
    
    cars_list.append(cars)
# Serialize the list of dicts to JSON
j = json.dumps(cars_list)
# Write to file
with open('data.json', 'w') as f:
    f.write(j)