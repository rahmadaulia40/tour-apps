import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, ScrollView, Image, RefreshControl} from 'react-native';
import { Button, Gap, Header, List } from '../../components';
import { colors, fonts, getData, push_notification, storeData } from '../../utils';
import {Firebase} from '../../config';
import { useDispatch } from 'react-redux';
import { ILNullPhoto } from '../../assets';

const Home_kurir = ({navigation}) => {
  const [refresh, setRefresh] = React.useState(false)
  const [order, setOrder] = useState([])
  const onResfresh = React.useCallback(()=>{
    getDataUserOnFirebase()
    getDataOrder()
    getTotalOrder()
    setRefresh(true)
    setTimeout(()=>{
      setRefresh(false)
    }, 2000)
  })
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({fullName: ''})
  const [photo, setPhoto] = useState(ILNullPhoto)
  const [proses, setProses] = useState({
    pembayaran : '0',
    pencucian : '0',
    penjemputan : '0',
    selesai : '0'
  })
  useEffect(()=> {
    getData('kurir')
    .then(res => {
      setProfile(res)
      setPhoto( res.photo == undefined ? ILNullPhoto : { uri: res.photo})
      dispatch({type: 'SET_LOADING', value: false})
    })
    getDataUserOnFirebase()
    getDataOrder()
    getTotalOrder()
  }, [profile.uid])
  
  const getDataUserOnFirebase=()=>{
    Firebase.database()
    .ref(`account/${profile.uid}/`)
    .once('value')
    .then(resDB => {
      //save to localstorage
      if (resDB.val()) {
        const data = resDB.val()
        storeData('kurir',data)
      }
    })
  }

  const getDataOrder =()=>{
    Firebase.database().ref().child('order').orderByChild('status').equalTo('Pesanan Siap Dikirim')
    .on('value', async snapshot => {
      if(snapshot.val()) {
        const oldData = snapshot.val()
        const data = []
        const promises = await Object.keys(oldData).map(async key => {
          const reqDataUser = Firebase.database().ref().child(`account/${oldData[key].uidUser}`).once('value')
          const dataUser = (await reqDataUser).val()
          data.push({
            sorting : oldData[key].year+oldData[key].month+oldData[key].date,
            ...dataUser,
            ...oldData[key]
          })
        })
        await Promise.all(promises)
        setOrder(data.sort((a, b)=>{return b.sorting - a.sorting}))
      }
    else{
      setOrder('null')
    }
    })
  }

  const getTotalOrder=()=>{
    Firebase.database().ref().child('order').orderByChild('uidDriver').equalTo(`${profile.uid}`)
    .on('value', async snapshot => {
      if(snapshot.val()) {
        const oldData = snapshot.val()
        const data = []
        const promises = await Object.keys(oldData).map(async key => {
          data.push({
            ...oldData[key]
          })
        })
        const filtering1 = data.filter(item =>{return item.status == 'Kurir Telah Tiba Dilokasi'})
        const filtering2 = data.filter(item =>{return item.status == 'Pesanan Siap Dikirim'})
        const filtering4 = data.filter(item =>{return item.status == 'Transaksi Selesai'})
        setProses({
          'pembayaran' : filtering1.length,
          'pengiriman' : filtering2.length,
          'selesai' : filtering4.length,
        })
        await Promise.all(promises)
      }
    })
  }

  const month = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"]
  const tgl = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60"]
  const date = new Date();

  const onConfirmation =(data)=>{
    Firebase.database().ref(`order/${data.uidOrder}/`).update({
        status : 'Pesanan Dibawa oleh',
        endDate : tgl[date.getDate()],
        endMonth : month[date.getMonth()],
        endYear : date.getFullYear(),
        uidDriver : profile.uid,
        nameDriver : profile.fullName
    })
    .then(()=>{
        navigation.navigate('Histori')
        push_notification(`Pesanan Dibawa oleh : ${profile.fullName}`, data.token)
    })
  }

  const viewBox =(title, number)=>{
    return (
      <>
        <Gap height ={10}/>
        <View style={styles.buttonBox}>
          <Text style={styles.buttonTeksBox}>{title}</Text>
          <Text style={styles.buttonTeksBox}>{number}</Text>
        </View>
      </>
    )
  }

  return (
    <>
      <View style={styles.page}>
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false} style={{marginHorizontal: 0}} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onResfresh}/>}>
          <Header type='home' title={profile.fullName} photo={photo}/>
            <Gap height ={10}/>
                {
                  order == 'null' ? 
                  <View>
                    {viewBox('Proses Pengiriman', proses.pengiriman)}
                    {viewBox('Proses Pembayaran', proses.pembayaran)}
                    {viewBox('Telah Selesai', proses.selesai)}
                  </View> 
                  : order.map(data=>{
                    return (
                      <>
                      <View style={styles.box}>
                        <Gap height ={20}/>
                        <Text style={styles.titleNotif}>{data.status}</Text>
                        <Gap height ={10}/>
                        <Image source={data.photo == undefined ? ILNullPhoto : {uri : data.photo}} style={styles.photo}/>
                        <Gap height ={10}/>

                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20}}>
                          <View>
                            <Text style={styles.text2}>NOTA</Text>
                            <Text style={styles.text2}>Tanggal</Text>
                            <Text style={styles.text2}>Nama</Text>
                            <Text style={styles.text2}>Nama Toko</Text>
                            <Text style={styles.text2}>Ponsel</Text>
                            <Text style={styles.text2}>Total Pesanan</Text>
                            <Text style={styles.text2}>Metode Pembayaran</Text>
                          </View>
                          <View>
                            <Text style={styles.text2}>:</Text>
                            <Text style={styles.text2}>:</Text>
                            <Text style={styles.text2}>:</Text>
                            <Text style={styles.text2}>:</Text>
                            <Text style={styles.text2}>:</Text>
                            <Text style={styles.text2}>:</Text>
                            <Text style={styles.text2}>:</Text>
                          </View>
                          <View>
                            <Text style={styles.text2}>{data.NOTA}</Text>
                            <Text style={styles.text2}>{data.endDate}-{data.endMonth}-{data.endYear}</Text>
                            <Text style={styles.text2}>{data.fullName}</Text>
                            <Text style={styles.text2}>{data.storeName}</Text>
                            <Text style={styles.text2}>{data.ponsel}</Text>
                            <Text style={styles.text2}>Rp.{data.totalPrice},-</Text>
                            <Text style={styles.text2}>{data.paymentMethod}</Text>
                          </View>
                        </View>
                        <View style={{flex: 1, paddingHorizontal: 20, paddingTop: 5}}>
                            <Text style={styles.text2}>Alamat :</Text>
                            <Text style={styles.text2}>{data.storeAddress}</Text>
                        </View>

                        <View style={styles.btnConf}>
                          <Button title='Antar Pesanan' onPress={()=> onConfirmation(data)}/>
                        </View>
                        <Gap height ={20}/>
                      </View>
                      <Gap height ={20}/>
                      </>
                  )})
                }

            <Gap height ={80}/>
          </ScrollView>
        </View>
      </View>
    </>
  )
}

export default Home_kurir

const styles = StyleSheet.create({
  page : {
    flex : 1,
    backgroundColor : colors.secondary,
  },
  category : {
    flexDirection : 'row',
    justifyContent : 'space-around',
    flex: 1
  },
  wrapperSection : {
    marginHorizontal:16
  },
  wrapperScroll : {
    marginHorizontal : -16
  },
  content : {
    flex : 1,
    backgroundColor : colors.secondary,
  },
  sectionlabel : {
    fontSize : 16,
    fontFamily : fonts.primary[600],
    color : colors.text.primary,
    marginTop : 30,
    marginBottom : 16
  },
  title : {
    color : colors.white,
    marginLeft: 10,
    fontFamily : fonts.primary[600],
    fontSize: 18
  },
  titleNotif : {
    color : colors.text.primary,
    fontFamily : fonts.primary[800],
    fontSize: 18,
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  text : {
    color : colors.text.primary,
    fontFamily : fonts.primary[800],
    fontSize: 14,
    alignSelf: 'center'
  },
  text2 : {
    color : colors.text.primary,
    fontFamily : fonts.primary[800],
    fontSize: 14,
  },
  titleName : {
    color : colors.white,
    marginLeft: 10,
    fontFamily : fonts.primary[700],
    fontSize: 28
  },
  photo : {
    width : 80,
    height : 80,
    borderRadius : 80/2,
    alignSelf : 'center'
  },
  box : {
    marginHorizontal: 10,
    elevation: 20,
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingHorizontal: 10
  },
  btnConf : {
    paddingTop: 15,
    marginHorizontal: 10
  },
  buttonBox: {
    backgroundColor: colors.primary,
    elevation: 15,
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    justifyContent: 'space-between',
    borderWidth: 3,
    borderColor: colors.background
  },
  buttonTeksBox: {
    color: colors.text.subTitle,
    fontFamily: fonts.primary[700],
    fontSize: 18,
    fontWeight: 'bold',
  },

})