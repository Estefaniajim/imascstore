import React, {useState} from 'react';
import { Row, Modal, Button, TextInput } from 'react-materialize';
import axios from 'axios';

function ModalForm(props) {

    const [address, setAdress] = useState("")
    const [name, setName] = useState("")
    const [inventory, setInventory] = useState({"maskType": [],"quantity": [],"price":[]})
    const [inventorySize, setInventorySize] = useState(0);

    const inventorySizeChange = (ev)=>{
        setInventorySize(ev.target.value);
        let temp = []
        let temp2 = []
        for(let i = 0; i < ev.target.value; i++){
        temp.push("");
        temp2.push(0);
        }
        setInventory({"maskType": temp,"quantity": temp2,"price":temp2})
    }

    const updateInventory = (col, id)=>{
        return (ev) => {
            let copy = JSON.parse(JSON.stringify(inventory));
            copy[col][id] = ev.target.value;
            setInventory(copy);
        }
    }

    const submit = ()=>{
        if(inventorySize<=0){
            alert("please add inventory");
            return;
        }
        const data = {
            address: address,
            storeId: name,
            inventory
        }
        axios.post('/addstore', data)
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        });
    }

    return <Modal
        actions={[
          <Button flat modal="close" node="button" waves="green" onClick={()=>{props.setVisible(false)}}>Close</Button>
        ]}
        bottomSheet={false}
        fixedFooter={false}
        header="Add you store"
        id="Modal-0"
        open={props.visible}
        options={{
          dismissible: true,
          endingTop: '10%',
          inDuration: 250,
          onCloseEnd: null,
          onCloseStart: null,
          onOpenEnd: null,
          onOpenStart: null,
          opacity: 0.5,
          outDuration: 250,
          preventScrolling: true,
          startingTop: '4%'
        }}
      >
      <div>
        <TextInput
            label="Store name"
            value={name}
            onChange={(ev)=>{setName(ev.target.value)}}
            />
        <TextInput
          label="Address"
          value={address}
          onChange={(ev)=>{setAdress(ev.target.value)}}
        />

        <TextInput
          type="number"
          label="Number of items you want to add"
          value={inventorySize}
          onChange={inventorySizeChange}
        />
        </div>
        {inventory.price.map((item, pos)=>{
            return <Row key={pos}>

                <TextInput
                    label="Mask Type"
                    value={inventory.maskType[pos]}
                    onChange={updateInventory("maskType", pos)}
                    />
                <TextInput
                    label="Quantity"
                    type="number"
                    value={inventory.quantity[pos]}
                    onChange={updateInventory("quantity", pos)}
                    />
                <TextInput
                    label="Price"
                    type="number"
                    value={inventory.price[pos]}
                    onChange={updateInventory("price", pos)}
                    />
            </Row>
        })}
        <Button node="submit" waves="light" onClick={submit}>Submit</Button>
      </Modal>
}

export default ModalForm;
