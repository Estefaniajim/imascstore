from mongoDB import data
import requests, json 
from dotenv import load_dotenv
import json
from pprint import pprint
import os
api_key = os.getenv("ONLINE_KEY")
#import MongoEngineJSONEncoder

load_dotenv()

print("modeling")
url2 = "https://maps.googleapis.com/maps/api/place/textsearch/json?"
url = 'https://maps.googleapis.com/maps/api/geocode/json?'


#https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=api_key
#https://maps.googleapis.com/maps/api/place/textsearch/json?query=farmacias+near+zapopan&key=api_key

def nearStores(api_key,direction="patria"):#semi-hardcoded
  Stores = []
  address = []
  query = "farmacias+near+"+direction
  request = requests.get(url2 + 'query=' + query + '&key=' + api_key)
  listRequest = request.json()
  results = listRequest['results']
  for i in range(len(results)):
    address.append(results[i]["formatted_address"])
  for add in address:
    add2=add.split(" ")
    x = data.stores.find_one({"address": { "$regex": add2[3] }})#hardcoded
    if(x!=None):#improvised code
      eq=False
      for y in Stores:
        if y == x:
          eq=True
          break
      if eq==False:
        Stores.append(x)
  Stores = [g for parte in partir(Stores,6) for g in parte]
  for x in Stores:
    x["_id"]=str(x["_id"])
  return json.dumps(Stores)


def getCordenates (name, api_key):
  codenates = []
  place = requests.get(url + 'address=' + name + '&key=' + api_key)
  listRequest = place.json()
  results = listRequest['results'] 
  geometry = results[0]["geometry"]
  location = geometry["location"]
  codenates.append(location["lat"]) #lat
  codenates.append(location["lng"]) #lng
  return codenates

def partir(Stores,n):
  print(len(Stores))
  for i in range (0, len(Stores), n):
    yield Stores[i:i+n]



