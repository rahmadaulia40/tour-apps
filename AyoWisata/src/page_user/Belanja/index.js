import React, { useEffect, useState } from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {Button, Gap, Header, Input, ListBox} from '../../components';
import { Firebase } from '../../config';
import { colors, fonts, getData, showError, showSuccess } from '../../utils';
import Modal from "react-native-modal";
import { ILTroli } from '../../assets';

const Belanja = ({navigation}) => {
  const [profile, setProfile] = useState({})
  const [item, setItem] = useState({})
  const [listItem, setListItem] = useState([])
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [historyStock, setHistoryStock] = useState([])
  const [stock, setStock] = useState('0')
  const toggleModal = () => {setModalVisible(!isModalVisible)}
  const toggleModal2 = () => {setModalVisible2(!isModalVisible2)}

  useEffect(()=> {
    getDataUser()
    getStock()
    getDataTroly()
  }, [profile.uid])

  const getDataUser =()=>{
    getData('user')
    .then(res => {
      setProfile(res)
    })
  }

  const getStock =()=>{
    const rootDB = Firebase.database().ref()
    const stockDB = rootDB.child('stock')
    stockDB.on('value', async snapshot => {
      if(snapshot.val()) {
        const oldData = snapshot.val()
        const data = []
        const promises = await Object.keys(oldData).map(async key => {
          const productDB = await rootDB.child(`product/${oldData[key].uidProduct}`).once('value')
          data.push({
            ...oldData[key],
            ...productDB.val()
          })
        })
        await Promise.all(promises)

        setHistoryStock(data.sort((a, b)=>{return b.stock - a.stock}))
      }
      else{
        setHistoryStock('null')
      }
    })
  }

  const getDataTroly = ()=>{
    const rootDB = Firebase.database().ref()
    const troliDB = rootDB.child('troli/'+profile.uid+'/')
    troliDB.on('value', async snapshot => {
        if(snapshot.val()) {
            const oldData = snapshot.val()
            const data = []
            const promises = await Object.keys(oldData).map(async key=>{
                data.push({
                    ...oldData[key]
                  })
            })
            await Promise.all(promises)
            setListItem(data)
        }
        else{
          setListItem('null')
        }
    })
  }

  const addItem =(item) => {
      const uidProduct = listItem == 'null' ? 'null' : listItem.map(item=>{return item.uidProduct})
      if(item.uidProduct == uidProduct){
        showError('Barang sudah tersedia di Keranjang !')
      }
      else {
        toggleModal2()
        setItem(item)
      }
  }

  const onTotalStock=()=>{
    const newData = {
      namaBarang : item.namaBarang,
      satuanBarang : item.satuanBarang,
      hargaModal : item.hargaModal,
      hargaJual : item.hargaJual,
      stock : stock,
      uidProduct : item.uidProduct,
      uidStock : item.uidStock
    }
    if( Number(stock) > Number(item.stock)){
      toggleModal2(),
      setItem({}),
      setStock('0'),
      showError('Pembelian stock melebihi batas ketersediaan !!')
    }
    else{
      const pushData = Firebase.database().ref(`troli/${profile.uid}/`).push(newData)
      Firebase.database().ref(`troli/${profile.uid}/${pushData.key}/`).update({uidItem : pushData.key})
      .then(()=>{
          toggleModal2(),
          getDataTroly(),
          setItem({}),
          setStock('0'),
          showSuccess('Berhasil Ditambahkan Ke-Keranjang Belanja !')
      })
    }
  }

  const onConfirmation=()=>{
    toggleModal()
    navigation.navigate('Keranjang',profile)
  }
  
  return (
    <>
      <View style={styles.page}>
        <Header title='Saatnya Belanja' type='dark-only'/>
        <View style={styles.coloring}>
          <View style={{ flex: 1}}> 
            {historyStock == 'null' ? <Text style={{textAlign: 'center', paddingTop: 20, fontFamily: fonts.primary[800]}}>Data Belanja Belum Tersedia !</Text> :
            <FlatList
              showsVerticalScrollIndicator={false}
              data={historyStock}
              keyExtractor={item => item.uidStock}
              renderItem={({item})=> <ListBox item={item} onPress={()=> addItem(item)} key={item.uidStock}/>}
              numColumns={2}
              columnWrapperStyle={styles.flatlist}
            />}
            <Gap height={20}/>
          </View>

            <Modal isVisible={isModalVisible2}>
                <View style={styles.modal}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.title}>Jumlah Stock</Text>
                        <Gap height={10}/>
                        <Input judul='Input Jumlah Stock' keyboardType='phone-pad' value={stock} onChangeText={(value)=> setStock(value)} type='komentar'/>
                        <Gap height={20}/>
                    </ScrollView>
                    <View style={styles.button}>
                      <Button title="Input" onPress={onTotalStock}/>
                      <Button title="Close" type='secondary' onPress={toggleModal2} />
                    </View>
                </View>
            </Modal>

        </View>
      </View>
      {listItem == 'null' ? <View/> :
      
        <TouchableOpacity style={styles.troli} onPress={()=> onConfirmation()}>
          <ILTroli/>
        </TouchableOpacity> 
      }
    </>
  )
}

export default Belanja

const styles = StyleSheet.create({
  page : {
    flex : 1,
    backgroundColor : colors.primary,
  },
  coloring:{
    backgroundColor : colors.secondary,
    flex : 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
    borderTopWidth: 5,
    borderColor: colors.border.onBlur
  },
  modal: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title : {
    fontFamily: fonts.primary[700],
    color : colors.primary,
    alignSelf: 'center',
    fontSize: 20
  },
  dropdownStyle: {
    backgroundColor: colors.background,
    borderRadius: 10,
    width: '100%',
    borderWidth: 1
  },
  nameDropDown: {
    fontFamily: fonts.primary[700],
    color : colors.text.primary,
    fontSize: 14
  },
  troli:{
    position: 'absolute',
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    left: 15,
    elevation: 10
  },
  confDelete : {
    height: 30,
    width: 50, 
    right: 0,
    backgroundColor: colors.primary
  },
  titleTotal : {
    fontFamily: fonts.primary[700],
    color : colors.primary,
    alignSelf: 'center',
    fontSize: 18
  },
  button : {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flatlist: {
    justifyContent: 'space-between',
    marginBottom: 15
  }
})