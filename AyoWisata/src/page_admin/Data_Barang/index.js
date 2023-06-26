import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, RefreshControl, Text} from 'react-native';
import { Button, Gap, Header, Input, List } from '../../components';
import { Firebase } from '../../config';
import { colors, fonts, getNumber, showError } from '../../utils';
import Modal from "react-native-modal";

const Data_Barang = ({navigation}) => {
  const [refresh, setRefresh] = React.useState(false)
  const [historyStock, setHistoryStock] = useState([])
  const [stock, setStock] = useState('0')
  const [uidStock, setUidStock] = useState('')
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {setModalVisible(!isModalVisible);}
  const onResfresh = React.useCallback(()=>{
    getStock()
    setRefresh(true)
    setTimeout(()=>{
      setRefresh(false)
    }, 2000)
  })

  useEffect(()=> {
    getStock()
  },[historyStock.uidStock])

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
            sort : oldData[key].stock,
            ...oldData[key],
            ...productDB.val()
          })
        })
        await Promise.all(promises)
        setHistoryStock(data.sort((a, b)=>{return a.sort - b.sort}))
      }
      else{
        setHistoryStock('null')
      }
    })
  }

  const addStock =() => {
    toggleModal()
    if(stock == '0'){
      showError('Anda belum mengisi data dengan benar !!!')
    }
    else{
        Firebase.database().ref(`stock/${uidStock}`).update({stock : stock})
        setStock('0')
    }
  }

  const viewModal=(data)=>{
    toggleModal();
    setUidStock(data.uidStock);
    setStock(data.stock)

  }

  return (
    <>
      <View style={styles.page}>
        <Header type='payment' title='Data Barang' onPress={()=>{navigation.goBack()}}/>
        <View style={styles.coloring}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.container} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onResfresh}/>}>
            { historyStock == 'null' ? <Text style={{textAlign: 'center', paddingTop: 20, fontFamily: fonts.primary[800]}}>Data Belum Tersedia !</Text> :
              historyStock.map(data=>{
                return (
                <List
                  key={data.uidStock}
                  name={data.namaBarang}
                  desc={`( ${data.satuanBarang} )`}
                  total={getNumber(data.stock)}
                  type='add'
                  onPress={()=> viewModal(data)}
                />
              )})
            }
            <Gap height ={80}/>
          </ScrollView>
          <View style={styles.button}>
            <Button title='Tambah Stock' type='primary' onPress={()=>navigation.navigate('Tambah_Barang')}/>
          </View>
          <Gap height={5}/>
        </View>
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Tambah Stock Barang</Text>

                <Gap height={10}/>
                <Input judul='Tambah Stock' keyboardType='numeric' value={stock} onChangeText={(value)=> setStock(value)} type='komentar'/>
                <Gap height={20}/>
            </ScrollView>
            <View style={styles.button}>
                <Button title='Tambah' type='primary' onPress={addStock}/>
                <Gap height={10}/>
                <Button title='Close' type='secondary' onPress={toggleModal} />
            </View>
        </View>
     </Modal>
    </>
  )
}

export default Data_Barang

const styles = StyleSheet.create({
  page : {
    flex : 1,
    backgroundColor : colors.primary,
  },
  coloring:{
    backgroundColor : colors.secondary,
    flex : 1,
    elevation: 20
  },
  container : {
    flex : 1,
    marginHorizontal: 10
  },
  button : {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modal: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 20,
    marginHorizontal: 20,
    paddingHorizontal: 20
  },
  title : {
    fontFamily: fonts.primary[700],
    color : colors.primary,
    alignSelf: 'center',
    fontSize: 20
  },
})