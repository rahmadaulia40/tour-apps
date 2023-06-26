import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import { Button, Gap, Header, Input, ListBox, NewsItem, ReviewUser } from '../../components';
import { colors, fonts, getData, showError } from '../../utils';
import {Firebase} from '../../config';
import { useDispatch } from 'react-redux';
import { ILNullPhoto, ILTroli } from '../../assets';
import Modal from "react-native-modal";

const Home_administrator = ({navigation}) => {
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({fullName: ''})
  const [photo, setPhoto] = useState(ILNullPhoto)
  const [historyStock, setHistoryStock] = useState([])
  const [listItem, setListItem] = useState([])
  const [item, setItem] = useState({})
  const [stock, setStock] = useState('0')
  const toggleModal = () => {setModalVisible(!isModalVisible)}
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(()=> {
    getDataUser()
    getDataTroly()
    getStock()
  }, [profile.uid])

  const getDataUser=()=>{
    dispatch({type: 'SET_LOADING', value: true})
    getData('administrator')
    .then(res => {
      setProfile(res)
      setPhoto( res.photo == undefined ? ILNullPhoto : { uri: res.photo})
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

  const getStock =()=>{
    dispatch({type: 'SET_LOADING', value: true})
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
        dispatch({type: 'SET_LOADING', value: false})
      }
      else{
        setHistoryStock('null')
        dispatch({type: 'SET_LOADING', value: false})
      }
    })
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
      toggleModal(),
      setItem({}),
      setStock('0'),
      showError('Pembelian stock melebihi batas ketersediaan !!')
    }
    else{
      const pushData = Firebase.database().ref(`troli/${profile.uid}/`).push(newData)
      Firebase.database().ref(`troli/${profile.uid}/${pushData.key}/`).update({uidItem : pushData.key})
      .then(()=>{
          toggleModal(),
          getDataTroly(),
          setItem({}),
          setStock('0'),
          showSuccess('Berhasil Ditambahkan Ke-Keranjang Belanja !')
      })
    }
  }

  const addItem =(item) => {
    const uidProduct = listItem == 'null' ? 'null' : listItem.map(item=>{return item.uidProduct})
    if(item.uidProduct == uidProduct){
      showError('Barang sudah tersedia di Keranjang !')
    }
    else {
      toggleModal()
      setItem(item)
    }
  }

  const onConfirmation=()=>{
    toggleModal()
    navigation.navigate('Keranjang_admin',profile)
  }


  return (
    <>
      <View style={styles.page}>
        <View style={styles.content}>
            <Header type='home' title={profile.fullName} photo={photo}/>
            <Gap height ={10}/>

            <View style={{ flex: 1}}> 
              {historyStock == 'null' ? <Text style={{textAlign: 'center', paddingTop: 20, fontFamily: fonts.primary[800]}}>Data Belanja Belum Tersedia !</Text> :
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={historyStock}
                  keyExtractor={item => item.uidStock}
                  renderItem={({item})=> <ListBox item={item} onPress={()=> addItem(item)} key={item.uidStock}/>}
                  numColumns={2}
                  columnWrapperStyle={styles.flatlist}
                />
              }
            </View>
        </View>
      </View>
      <Modal isVisible={isModalVisible}>
          <View style={styles.modal}>
              <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.title}>Jumlah Stock</Text>
                  <Gap height={10}/>
                  <Input judul='Input Jumlah Stock' keyboardType='phone-pad' value={stock} onChangeText={(value)=> setStock(value)} type='komentar'/>
                  <Gap height={20}/>
              </ScrollView>
              <View style={styles.button}>
                <Button title="Input" onPress={onTotalStock}/>
                <Button title="Close" type='secondary' onPress={toggleModal} />
              </View>
          </View>
      </Modal>
      {listItem == 'null' ? <View/> :
      <TouchableOpacity style={styles.troli} onPress={()=> onConfirmation()}>
        <ILTroli/>
      </TouchableOpacity> 
    }
    </>
  )
}

export default Home_administrator

const styles = StyleSheet.create({
  page : {
    flex : 1,
    backgroundColor : colors.background,
  },
  content : {
    flex : 1,
    backgroundColor : colors.secondary,
  },
  flatlist: {
    justifyContent: 'space-between',
    marginBottom: 15
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
  button : {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
})