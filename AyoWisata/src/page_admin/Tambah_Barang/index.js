import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, RefreshControl, TouchableOpacity, Text} from 'react-native';
import { Button, Gap, Header, Input, List } from '../../components';
import { Firebase } from '../../config';
import { colors, fonts, getNumber, showError, showSuccess, useForm } from '../../utils';
import Modal from "react-native-modal";

const Tambah_Barang = ({navigation}) => {
  const [refresh, setRefresh] = React.useState(false)
  const [historyProduct, setHistoryProduct] = useState([]);
  const [form, setForm] = useForm({
    namaBarang : '',
    satuanBarang : '',
    hargaModal : '',
    hargaJual : ''
  })
  const [isModalVisible, setModalVisible] = useState(false);
  const onResfresh = React.useCallback(()=>{
    getProduct()
    setRefresh(true)
    setTimeout(()=>{
      setRefresh(false)
    }, 2000)
  })

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  }

  useEffect(()=> {
    getProduct()
  },[historyProduct.uidProduct])

  const getProduct =()=>{
    Firebase.database().ref().child('product')
    .on('value', async snapshot => {
      if(snapshot.val()) {
        const oldData = snapshot.val()
        const data = []
        const promises = await Object.keys(oldData).map(async key => {
          data.push({
            ...oldData[key]
          })
        })
        await Promise.all(promises)
        setHistoryProduct(data)
      }
      else{
        setHistoryProduct('null')
      }
    })
  }

  const addProduct =() => {
    toggleModal()
    if(form.namaBarang == ''){
      showError('Anda belum mengisi data dengan benar !!!')
    }
    else{
        const product = Firebase.database().ref('product/').push(form)
        Firebase.database().ref(`product/${product.key}`).update({uidProduct : product.key})
        .then(()=>{
          const stock = Firebase.database().ref('stock/').push({stock : '0'})
          Firebase.database().ref(`stock/${stock.key}`).update({uidStock : stock.key, uidProduct : product.key})
          setForm('reset')
        })
    }
  }

  const deleteProduct=(uid)=>{
      Firebase.database().ref(`product/${uid}/`).remove()
      showSuccess('Data Telah Dihapus !')
  }

  return (
    <>
      <View style={styles.page}>
        <Header type='payment' title='List Nama Barang' onPress={()=>{navigation.goBack()}}/>
        <View style={styles.coloring}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.container} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onResfresh}/>}>
            { historyProduct == 'null' ? <Text style={{textAlign: 'center', paddingTop: 20, fontFamily: fonts.primary[800]}}>Data Belum Tersedia !</Text> :
              historyProduct.map(data=>{
                return (
                <List
                  key={data.uidProduct}
                  name={`${data.namaBarang} ( ${data.satuanBarang} )`}
                  desc={`Modal : Rp.${getNumber(data.hargaModal)} | Jual : Rp.${getNumber(data.hargaJual)}`}
                  type='delete'
                  onPress={()=>deleteProduct(data.uidProduct)}
                />
              )})
            }
            <Gap height ={80}/>
          </ScrollView>
          <View style={styles.button}>
            <Button title='Tambah Barang' type='primary' onPress={toggleModal}/>
          </View>
          <Gap height={5}/>
        </View>
      </View>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Input Nama Barang</Text>
                <Gap height={10}/>
                <Input judul='Nama Barang' value={form.namaBarang} onChangeText={(value)=> setForm('namaBarang',value)} type='komentar'/>
                <Gap height={10}/>
                <Input judul='Satuan Barang' value={form.satuanBarang} onChangeText={(value)=> setForm('satuanBarang',value)} type='komentar'/>
                <Gap height={20}/>
                <Input judul='Harga Modal (Rp)' keyboardType='numeric' value={form.hargaModal} onChangeText={(value)=> setForm('hargaModal',value)} type='komentar'/>
                <Gap height={20}/>
                <Input judul='Harga Jual (Rp)' keyboardType='numeric' value={form.hargaJual} onChangeText={(value)=> setForm('hargaJual',value)} type='komentar'/>
                <Gap height={20}/>
            </ScrollView>
            <View style={styles.button}>
                <Button title='Tambah' type='primary' onPress={addProduct}/>
                <Gap height={10}/>
                <Button title='Close' type='secondary' onPress={toggleModal} />
            </View>
        </View>
     </Modal>
    </>
  )
}

export default Tambah_Barang

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