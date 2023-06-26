import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, RefreshControl, TouchableOpacity, Text} from 'react-native';
import { Button, Gap, Header, Input, List } from '../../components';
import { Firebase } from '../../config';
import { colors, fonts, getNumber, showError, showSuccess, useForm } from '../../utils';
import Modal from "react-native-modal";
import { useDispatch } from 'react-redux';
import { ILDropDown, IconMapsActive } from '../../assets';

const Keranjang = ({navigation, route}) => {
  const dispatch = useDispatch();
  const profile = route.params
  const [refresh, setRefresh] = React.useState(false)
  const [listItem, setListItem] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalModal, setTotalModal] = useState(0)
  const [totalBelanja, setTotalBelanja] = useState('0')
  const [totalHutang, setTotalHutang] = useState('0')
  const [DSPayLater, setDSPayLater] = useState([])
  const [payment, setPayment] = useState('COD')
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {setModalVisible(!isModalVisible);}
  const onResfresh = React.useCallback(()=>{
    setRefresh(true)
    getDataTroly()
    getDataTotalBelanja()
    getDataDSPayLater()
    setTimeout(()=>{
      setRefresh(false)
    }, 2000)
  })

  useEffect(()=> {
    getDataTroly()
    getDataTotalBelanja()
    getDataDSPayLater()
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

  const getDataDSPayLater=()=>{
    Firebase.database().ref(`limitDSPayLater/0/`)
    .on('value',async snapshot=>{
      if(snapshot.val()){
        const data = snapshot.val()
        setDSPayLater(data)
        setRefresh(false)
      }
    })
  }

  const getDataTotalBelanja=()=>{
    Firebase.database().ref(`order`)
    .on('value', async snapshot=>{
      if(snapshot.val()){
        const oldData = snapshot.val()
        const data = []
        const promises = await Object.keys(oldData).map(async key => {
          data.push({
            ...oldData[key]
          })
        })
        await Promise.all(promises)
        const filtering = data.filter(item =>{return item.uidUser == profile.uid})
        const totalBelanja = filtering.reduce((val, element)=>{return val + Number(element.totalPrice)},0)
        const totalHutang = filtering.reduce((val, element)=>{return val + Number(element.hutang == undefined ? '0' : element.hutang)},0)
        setTotalBelanja(totalBelanja)
        setTotalHutang(totalHutang)
        setRefresh(false)
      }
    })
  }

  const deleteItem=(key)=>{
    Firebase.database().ref(`troli/${profile.uid}/${key}/`).remove()
    showError('Data Telah Dihapus !')
    getDataTroly()
  }

  const onCash=()=>{
    setPayment('COD'),
    toggleModal()
  }
  const onPayLater=()=>{
    setPayment('DS PayLater'),
    toggleModal()
  }

  const onOrder=()=>{
    const dataSaldo = (Number(DSPayLater.limitSaldo)-Number(totalHutang))-Number(totalBelanja)
    const month = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"]
    const tgl = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60"]
    const date = new Date();
    const newData = {
      uidUser : profile.uid,
      item : listItem,
      paymentMethod : payment,
      totalPrice : totalPrice,
      totalModal : totalModal,
      startDate : tgl[date.getDate()],
      startMonth : month[date.getMonth()],
      startYear : date.getFullYear(),
      endDate : tgl[date.getDate()],
      endMonth : month[date.getMonth()],
      endYear : date.getFullYear(),
      DSPaylater : dataSaldo,
      status : 'Menunggu Konfirmasi'

    }
    const onPush = Firebase.database().ref(`order/`).push(newData)
    Firebase.database().ref(`order/${onPush.key}/`).update({uidOrder : onPush.key, NOTA : `DS-${tgl[date.getDate()]}${month[date.getMonth()]}${date.getFullYear()}${onPush.key.slice(1,6)}`})
    .then(()=>{
      Firebase.database().ref(`troli/${profile.uid}/`).remove()
      .then(()=>{
        navigation.goBack()
        navigation.navigate('Histori')
        showSuccess('Sukses membuat pesanan.')
      })
    })
  }

  return (
    <>
      <View style={styles.page}>
        <Header type='payment' title='Keranjang Saya' onPress={()=>{navigation.goBack()}}/>
        <View style={styles.coloring}>
          
          <View style={styles.addressBox}>
            <IconMapsActive/>
            <View>
              <Text style={styles.addressText}>Alamat Pengiriman</Text>
              <Text style={styles.addressText}>{profile.storeName} | {profile.fullName}</Text>
              <Text style={styles.addressText}>{profile.storeAddress} | {profile.ponsel}</Text>
              <Gap height={5}/>
            </View>
          </View>

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

          {payment == 'COD' ? <View/> :
          <>
            <Gap height={5}/>
            <View style={styles.paymentMethod}>
              <Text style={styles.addressText}>Saldo DS PayLater :</Text>
              <Text style={styles.addressText}>Rp.{getNumber(Number(DSPayLater.limitSaldo)-Number(totalHutang))},-</Text>
            </View>
          </>}

          <Gap height ={5}/>

          <View style={styles.paymentMethod}>
            <Text style={styles.addressText}>Metode Pembayaran :</Text>
            <TouchableOpacity onPress={toggleModal} style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.addressText}>{payment == 'COD' ? `${payment} (Cash On Delivery)` : payment}</Text>
              <Gap width={10}/>
              <ILDropDown/>
            </TouchableOpacity>
          </View>

          <Gap height ={5}/>

          <View style={styles.orderBox}>
            <View>
              <Text style={styles.addressText}>Total Pembayaran :</Text>
              <Text style={styles.addressText}>{`Rp ${getNumber(totalPrice)},-`}</Text>
            </View>
            <TouchableOpacity onPress={()=>onOrder()} style={styles.button}>
              <Text style={styles.textButton}>Buat Pesanan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modal}>
                <Text style={styles.title}>Metode Pembayaran</Text>
                <Gap height={15}/>

                <TouchableOpacity onPress={()=> onCash()} style={styles.buttonPayment}>
                  <Text style={styles.textPayment}>COD (Cash On Delivery)</Text>
                </TouchableOpacity>
                <Gap height={10}/>
                {totalBelanja >=DSPayLater.totalBelanja ?
                    totalPrice <=DSPayLater.limitSaldo ?
                      <TouchableOpacity onPress={()=> onPayLater()} style={styles.buttonPayment}>
                        <Text style={styles.textPayment}>DS PayLater</Text>
                        <Text style={styles.titlePayment}>Saldo : Rp.{getNumber(DSPayLater.limitSaldo)},-</Text>
                      </TouchableOpacity>
                      :
                      <View onPress={()=> onPayLater()} style={styles.buttonPayment2}>
                        <Text style={styles.textPayment2}>DS PayLater</Text>
                        <Text style={styles.titlePayment2}>Saldo Kurang ! (Rp.{getNumber(DSPayLater.limitSaldo)},-)</Text>
                      </View>
                  :
                <View onPress={()=> onPayLater()} style={styles.buttonPayment2}>
                  <Text style={styles.textPayment2}>DS PayLater</Text>
                  <Text style={styles.titlePayment2}>(Belum Terbuka)</Text>
                </View> }

        </View>
     </Modal>
    </>
  )
}

export default Keranjang

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
  modal: {
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 20,
    marginHorizontal: 20,
  },
  title : {
    fontFamily: fonts.primary[700],
    color : colors.primary,
    alignSelf: 'center',
    fontSize: 20
  },
  titleTotal : {
    fontFamily: fonts.primary[700],
    color : colors.primary,
    alignSelf: 'center',
    fontSize: 16
  },
  addressBox: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding : 5,
    elevation: 5
  },
  addressText: {
    paddingLeft: 2,
    color: colors.text.primary,
    fontFamily: fonts.primary[600],
    fontSize: 13
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderWidth: 1,
    alignItems: 'center',
    borderRadius: 5,
    borderColor: colors.border.onFocus,
    backgroundColor: colors.white,
    elevation: 5
  },
  orderBox: {
    borderTopWidth: 1,
    borderColor: colors.border.onFocus,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: colors.white,
    elevation: 5

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
    fontWeight: 'bold'
  },
  buttonPayment: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
    elevation: 10,
    marginHorizontal: 20
  },
  buttonPayment2: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: colors.secondary,
    borderRadius: 5,
    elevation: 10,
    marginHorizontal: 20
  },
  textPayment: {
    color: colors.text.subTitle,
    fontFamily: fonts.primary[600],
    fontWeight : 'bold'
  },
  titlePayment: {
    color: colors.text.subTitle,
    fontFamily: fonts.primary[600],
  },
  textPayment2: {
    color: colors.text.menuInactive,
    fontFamily: fonts.primary[600],
    fontWeight : 'bold'
  },
  titlePayment2: {
    color: colors.text.menuInactive,
    fontFamily: fonts.primary[600],
  },
})