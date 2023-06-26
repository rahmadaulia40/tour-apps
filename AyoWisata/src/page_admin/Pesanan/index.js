import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, RefreshControl, Text} from 'react-native';
import { Gap, Header, List } from '../../components';
import { Firebase } from '../../config';
import { colors, fonts, getData, getNumber } from '../../utils';
import { useDispatch } from 'react-redux';

const Pesanan = ({navigation}) => {
  const dispatch = useDispatch();
  const [refresh, setRefresh] = React.useState(false)
  const onResfresh = React.useCallback(()=>{
    getDataHistory()
    setRefresh(true)
    setTimeout(()=>{
      setRefresh(false)
    }, 2000)
  })
  const [user, setUser] = useState({})
  const [historyOrder, setHistoryOrder] = useState([])
  useEffect(()=> {
    getDataUserFromLocal()
    getDataHistory()
  },[user.uid])

  const getDataUserFromLocal =()=> {
    dispatch({type: 'SET_LOADING', value: true})
    getData('administrator')
    .then(res=>{
        setUser(res)
    })
}

  const getDataHistory=()=>{
    dispatch({type: 'SET_LOADING', value: true})
    const rootDB = Firebase.database().ref(`order/`)
    rootDB.on('value', async snapshot => {
      if(snapshot.val()) {
        const oldData = snapshot.val()
        const data = []
        const promises = await Object.keys(oldData).map(async key => {
            data.push({
              sorting : oldData[key].year+oldData[key].month+oldData[key].date,
              ...oldData[key]
            })
        })
        await Promise.all(promises)
        setHistoryOrder(data.sort((a, b)=>{return b.sorting - a.sorting}))
        dispatch({type: 'SET_LOADING', value: false})
        setRefresh(false)
      }
      else {
        setHistoryOrder('null')
        dispatch({type: 'SET_LOADING', value: false})
      }
    })
  }

  const onAction=(data)=>{
    dispatch({type: 'SET_LOADING', value: true})
    navigation.navigate('Detail_Pesanan_Admin', data)
  }

  return (
      <View style={styles.page}>
        <Header type='dark-only' title='Pesanan Costumer'/>
        <View style={styles.coloring}>
          <Gap height ={10}/>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.container} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onResfresh}/>}>
          {historyOrder == 'null' ? <Text style={{textAlign: 'center', paddingTop: 20, fontFamily: fonts.primary[800]}}>Data Pesanan Belum Tersedia !</Text> : 
          historyOrder.map(data => {
                const namaBarang = data.item.map(item=>{return item.namaBarang})
                const stock = data.item.map(item=>{return item.stock})
                const satuanBarang = data.item.map(item=>{return item.satuanBarang})
                const hargaJual = data.item.map(item=>{return item.hargaJual})
                return (
                <List
                  key={data.uidOrder}
                  date={`${data.endDate}/${data.endMonth}`}
                  year={`${data.endYear}`}
                  name={namaBarang[0]}
                  stock={getNumber(stock[0])}
                  satuanBarang={satuanBarang[0]}
                  hargaJual={getNumber(hargaJual[0])}
                  desc={`${data.nameDriver == undefined ? data.status : data.status+' ( '+data.nameDriver+' )'}`}
                  total={getNumber(data.totalPrice)}
                  type={data.status == 'Transaksi Selesai' ? 'next-3' : 'next-2'}
                  onPress={()=>onAction(data)}
                />
              )})
            }
          </ScrollView>
        </View>
      </View>
  )
}

export default Pesanan

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
  container : {
    flex : 1,
    marginHorizontal: 10,
    backgroundColor: colors.secondary
  },
})