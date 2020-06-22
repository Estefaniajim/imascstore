from mongoDB import data
import model

print("asdfghjAv ")
inventory = [["sketchers","nikoni"],["211","31"],["10","999"]]
storeID = "Farmacias Benavides"
adress = "Av. Adolfo López Mateos Sur, Plaza del Sol, 45050 Guadalajara, Jal.."
20.6354779,-103.4141443
c = model.getCordenates(adress,model.api_key)
lat = c[0]
lon = c[1]
data.agregarTienda(storeID, adress, lat, lon, inventory)