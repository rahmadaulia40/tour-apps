import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, RefreshControl, Text} from 'react-native';
import { Gap, Header, List } from '../../components';
import { Firebase } from '../../config';
import { colors, fonts, getData } from '../../utils';

const History_kurir = ({navigation}) => {
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
  const getDataUserFromLocal =()=> {
    getData('kurir')
    .then(res=>{
        setUser(res)
    })
}

  useEffect(()=> {
    getDataUserFromLocal()
    getDataHistory()
  },[user.uid])

  const getDataHistory=()=>{
    const rootDB = Firebase.database().ref('order').orderByChild('uidDriver').equalTo(`${user.uid}`)
    rootDB.on('value', async snapshot => {
      if(snapshot.val()) {
        const oldData = snapshot.val()
        const data = []
        const promises = await Object.keys(oldData).map(async key => {
          const reqDataUser = Firebase.database().ref().child(`account/${oldData[key].uid_user}`).once('value')
          const dataUser = (await reqDataUser).val()
          data.push({
            sorting : oldData[key].year+oldData[key].month+oldData[key].date,
            ...dataUser,
            ...oldData[key]
          })
        })
        await Promise.all(promises)
        setHistoryOrder(data.sort((a, b)=>{return b.sorting - a.sorting}))
        setRefresh(false)
      }
      else {
        setHistoryOrder('null')
      }
    })
  }

  const onAction=(data)=>{
      navigation.navigate('detailHistory_kurir', data)
  }

  return (
      <View style={styles.page}>
        <Header type='dark-only' title='Histori Pengantaran'/>
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
                  stock={stock[0]}
                  satuanBarang={satuanBarang[0]}
                  hargaJual={hargaJual[0]}
                  desc={`${data.nameDriver == undefined ? data.status : data.status+' ( '+data.nameDriver+' )'}`}
                  total={data.totalPrice}
                  type={data.status == 'Transaksi Selesai' ? 'next-3' : 'next-2'}
                  onPress={()=>onAction(data)}
                />
              )})
            }
          </ScrollView>
          <Gap height ={80}/>
        </View>
      </View>
  )
}

export default History_kurir

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
    marginHorizontal: 10
  },
})