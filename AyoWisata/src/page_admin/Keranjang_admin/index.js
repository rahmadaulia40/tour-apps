import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, RefreshControl, TouchableOpacity, Text} from 'react-native';
import { Button, Gap, Header, Input, List } from '../../components';
import { Firebase } from '../../config';
import { colors, fonts, getNumber, showError, showSuccess, useForm } from '../../utils';
import Modal from "react-native-modal";
import { useDispatch } from 'react-redux';
import { ILDropDown, IconMapsActive } from '../../assets';

const Keranjang_admin = ({navigation, route}) => {
  const dispatch = useDispatch();
  const profile = route.params
  const [refresh, setRefresh] = React.useState(false)
  const [listItem, setListItem] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalModal, setTotalModal] = useState(0)
  const [pembayaran, setPembayaran] = useState('0')
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {setModalVisible(!isModalVisible);}
  const onResfresh = React.useCallback(()=>{
    setRefresh(true)
    getDataTroly()
    setTimeout(()=>{
      setRefresh(false)
    }, 2000)
  })

  useEffect(()=> {
    getDataTroly()
  },[profile.uid])

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
            let totalPrice = data.reduce((val, element)=>{return val + (Number(element.hargaJual)*Number(element.stock))},0)
            let totalModal = data.reduce((val, element)=>{return val + (Number(element.hargaModal)*Number(element.stock))},0)
            setTotalPrice(totalPrice)
            setTotalModal(totalModal)
            setListItem(data)
            dispatch({type: 'SET_LOADING', value: false})
        }
        else{
          dispatch({type: 'SET_LOADING', value: false})
          setListItem('null')
          setTotalPrice(0)
        }
    })
  }

  const deleteItem=(key)=>{
    Firebase.database().ref(`troli/${profile.uid}/${key}/`).remove()
    showError('Data Telah Dihapus !')
    getDataTroly()
  }

  const onOrder=()=>{
    const month = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"]
    const tgl = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60"]
    const date = new Date();
    const newData = {
      uidAdmin : profile.uid,
      item : listItem,
      paymentMethod : 'Cash',
      totalPrice : totalPrice,
      totalModal : totalModal,
      startDate : tgl[date.getDate()],
      startMonth : month[date.getMonth()],
      startYear : date.getFullYear(),
      endDate : tgl[date.getDate()],
      endMonth : month[date.getMonth()],
      endYear : date.getFullYear(),
      duitPelanggan : pembayaran,
      status : 'Transaksi Selesai',
      statusPembayaran : 'Lunas'

    }
    const onPush = Firebase.database().ref(`order/`).push(newData)
    Firebase.database().ref(`order/${onPush.key}/`).update({uidOrder : onPush.key, NOTA : `DS-${tgl[date.getDate()]}${month[date.getMonth()]}${date.getFullYear()}${onPush.key.slice(1,6)}`})
    .then(()=>{
      Firebase.database().ref(`troli/${profile.uid}/`).remove()
      .then(()=>{
        toggleModal()
        navigation.goBack()
        navigation.navigate('Pesanan')
        showSuccess('Transaksi Sukses dilakukan.')
      })
    })
  }

  return (
    <>
      <View style={styles.page}>
        <Header type='payment' title='Keranjang Saya' onPress={()=>{navigation.goBack()}}/>
        <Gap height={5}/>
        <View style={styles.coloring}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.container} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onResfresh}/>}>
            {listItem == 'null' ? <Text style={{textAlign: 'center', fontFamily: fonts.primary[800]}}>Data Pakaian Belum Tersedia !</Text> : 
            listItem.map(item => {
                return <List 
                    type ='delete' 
                    key = {item.uidItem}
                    name={`${item.namaBarang}`}
                    total={`Rp.${getNumber(Number(item.hargaJual)*Number(item.stock))},-`}
                    desc={`${getNumber(item.stock)} ${item.satuanBarang} x Rp.${getNumber(item.hargaJual)},-`}
                    onPress={()=>deleteItem(item.uidItem)}
                />
                })
            }
          </ScrollView>
          <View style={styles.orderBox}>
            <View>
              <Text style={styles.addressText}>Total Pembayaran :</Text>
              <Text style={styles.addressText}>{`Rp ${getNumber(totalPrice)},-`}</Text>
            </View>
            <TouchableOpacity onPress={()=>toggleModal()} style={styles.button}>
              <Text style={styles.textButton}>Buat Pesanan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Input Pembayaran</Text>
                <Gap height={10}/>
                <Input judul='Duit Pelanggan (Rp)' keyboardType='numeric' value={pembayaran} onChangeText={(value)=> setPembayaran(value)} type='komentar'/>
                <Gap height={10}/>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View>
                        <Text style={styles.addressText1}>Duit Pelanggan</Text>
                        <Text style={styles.addressText1}>Total Pesanan</Text>
                        <Text style={styles.addressText1}>Kembalian</Text>
                    </View>
                    <View>
                        <Text style={styles.addressText1}>: Rp.</Text>
                        <Text style={styles.addressText1}>: Rp.</Text>
                        <Text style={styles.addressText1}>: Rp.</Text>
                    </View>
                    <View style={{alignItems: 'flex-end', paddingRight: 10}}>
                        <Text style={styles.addressText1}>{pembayaran},-</Text>
                        <Text style={styles.addressText1}>{totalPrice},-</Text>
                        <Text style={styles.addressText1}>{Number(pembayaran)-Number(totalPrice)},-</Text>
                    </View>
                </View>
                <Gap height={20}/>
            </ScrollView>
            <View style={styles.button2}>
                <Button title='Bayar' type='primary' onPress={()=>onOrder()} disable={Number(totalPrice) <= pembayaran ? false : true}/>
                <Button title='Close' type='secondary' onPress={toggleModal} />
            </View>
        </View>
      </Modal>
    </>
  )
}

export default Keranjang_admin

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
  addressText: {
    paddingLeft: 2,
    color: colors.text.primary,
    fontFamily: fonts.primary[600],
    fontSize: 13
  },
  orderBox: {
    borderTopWidth: 1,
    borderColor: colors.border.onFocus,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: colors.white,
    elevation: 10,
    borderWidth: 1

  },
  button : {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 12
  },
  textButton: {
    color: colors.text.subTitle,
    fontFamily: fonts.primary[800],
    fontSize: 15,
    fontWeight: 'bold',
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
  addressText1: {
    paddingLeft: 2,
    color: colors.text.primary,
    fontFamily: fonts.primary[600],
    fontSize: 15,
    fontWeight: '700'
  },
  button2 : {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})