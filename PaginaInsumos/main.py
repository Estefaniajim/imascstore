from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from mongoDB import data
import model
load_dotenv()
import os
import json

webApp = Flask(__name__, static_folder="front/build/static", template_folder="front/build")
api_key = os.getenv("ONLINE_KEY")
@webApp.route('/')
def index():
  return render_template("index.html")

@webApp.route('/stores',methods=['GET']) #tiendas cercanas a algun area
def stores():
  if request.method=='GET':
    if 'area' in request.args:
      nearStores = model.nearStores(api_key,request.args['area'])
    else:
      print("NO EXISTE AREAAAAAA")
      nearStores = model.nearStores(api_key)
    return nearStores

@webApp.route('/mapspoint',methods=['GET']) #endpoint de llave de maps?
def maps():
  if request.method=='GET':
    return jsonify({"key":api_key}) #o json.dumps

@webApp.route('/addstore',methods=['POST']) #añadir nueva tienda
def addtostore():
  if request.method=='POST':
    #ifs
    storeID=request.json['storeId']
    adress=request.json['address']
    inv=request.json['inventory']
    inventory=[inv["maskType"],inv["quantity"],inv["price"]]
    data.agregarTienda(storeID,adress,inventory)
    return  jsonify({"ok":True})

@webApp.route('/addtoinv',methods=['POST']) #añadir nuevo producto
def addtoinv():
  if request.method=='POST':
    #ifs
    storeID=request.form['storename']
    inv=request.json['inventory']
    inventory=[inv["maskType"],inv["quantity"],inv["price"]]
    data.agregarInventario(storeID,inventory)
    return jsonify({"ok":True})

@webApp.route('/removestore',methods=['POST']) #quitar alguna tienda
def rmvstore():
  if request.method=='POST':
      #ifs
      storeID=request.form['storename']
      return  data.quitarTienda(storeID)

webApp.run(host='0.0.0.0', port=8080, debug=True)

# src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap">


