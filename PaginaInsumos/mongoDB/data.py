import pymongo
import dns
import json
import model

print("dataing!")
client = pymongo.MongoClient("mongodb+srv://tec:100@cluster0-rmunm.mongodb.net/dataBase?retryWrites=true&w=majority")
dataBase = client.insumos
stores = dataBase.store



def agregarTienda(storeID, adress, inventory):
  ad=adress.replace(' ','+')
  cordenadas = model.getCordenates(ad,model.api_key)
  lat = cordenadas[0]
  lng = cordenadas[1]
  stores.insert_one({
    "storeId": storeID , 
    "address" : adress, 
    "lat": lat,
    "long" : lng,
    "inventory" : {"maskType": inventory[0],"quantity": inventory[1],"price":inventory[2]}
    })

def agregarInventario(storeID,inventario):
  #inventario es llaves {maskType:[],quantity:[],price:[]} 
  #storeID es el nombre de la farmacia "Farmacias Guadalajara"
  tienda = tiendaInfo(storeID)
  if(tienda==None):
    return
  idObject = tienda[0]
  pastInv=tienda["inventory"]
  pastInv["maskType"]+=(inventario["maskType"])
  pastInv["quantity"]+=(inventario["quantity"])
  pastInv["price"]+=(inventario["price"])
  stores.update_one({"_id":idObject},{ "$set": { "inventory":{ "maskType":pastInv["maskType"],"quantity":pastInv["quantity"], "price":pastInv["price"]}}})

def quitarInventario(storeID,inventarioNombre):
  tienda = tiendaInfo(storeID)
  if(tienda==None):
    return
  idObject = tienda[0]
  pastInv=tienda["inventory"]
  for x in range(len(pastInv["maskType"])):
    if pastInv["maskType"][x]==inventarioNombre:
      pastInv["maskType"]=pastInv["maskType"][:x]+pastInv["maskType"][x+1:]
      pastInv["quantity"]=pastInv["quantity"][:x]+pastInv["quantity"][x+1:]
      pastInv["price"]=pastInv["price"][:x]+pastInv["price"][x+1:]
      stores.update_one({"_id":idObject},{ "$set": { "inventory":{ "maskType":pastInv["maskType"],"quantity":pastInv["quantity"], "price":pastInv["price"]}}})
      break

def quitarTienda(name):
  tienda = tiendaInfo(name)
  idObject = tienda[0]
  return stores.delete_one({"_id" : idObject})

def tiendaInfo(name):
  return json.dump(stores.find_one({"storeID": "name"}))#lo cambie de find a find_one


