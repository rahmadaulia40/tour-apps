import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, RefreshControl, TouchableOpacity, Text} from 'react-native';
import { Gap, Header, List } from '../../components';
import { Firebase } from '../../config';
import { colors, fonts, getNumber } from '../../utils';
import { useDispatch } from 'react-redux';

const Data_Kas = ({navigation}) => {
  const dispatch = useDispatch();
  const [refresh, setRefresh] = React.useState(false)
  const onResfresh = React.useCallback(()=>{
    getListPendapatan()
    getListPengeluaran()
    setRefresh(true)
    setTimeout(()=>{
      setRefresh(false)
    }, 2000)
  })
  const [totalPendapatan, setTotalPendapatan] = useState(0)
  const [totalPengeluaran, setTotalPengeluaran] = useState(0)
  const [totalHutang, setTotalHutang] = useState(0)
  const calender = new Date()
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'November', 'Desember']
  const month = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"]

  useEffect(()=> {
    getListPendapatan()
    getListPengeluaran()
  },[])

  const getListPendapatan = () =>{
    dispatch({type: 'SET_LOADING', value: true})
    Firebase.database().ref('order').orderByChild('endYear').equalTo(calender.getFullYear())
    .once('value', async snapshot => {
      if(snapshot.val()) {
        const oldData = snapshot.val()
        const data = []
        const promises = await Object.keys(oldData).map(async key => {
          data.push({
            ...oldData[key]
          })
        })
        const filtering = data.filter(a =>{ return a.endMonth == month[calender.getMonth()]})
        const hitung = filtering.reduce((a,b)=>{return a+Number(b.totalPrice)}, 0)
        const filteringHutang = filtering.filter(item =>{return item.paymentMethod == 'DS PayLater'})
        const hitungHutang = filteringHutang.reduce((a,b)=>{return a+Number(b.totalPrice)}, 0)
        await Promise.all(promises)
        setTotalPendapatan(hitung)
        setTotalHutang(hitungHutang)
      }
    })
  }
  const getListPengeluaran = () =>{
    dispatch({type: 'SET_LOADING', value: true})
    Firebase.database().ref('pengeluaran').orderByChild('year').equalTo(calender.getFullYear())
    .once('value', async snapshot => {
      if(snapshot.val()) {
          const oldData = snapshot.val()
          const data = []
          const promises = await Object.keys(oldData).map(async key => {
            data.push({
              ...oldData[key]
            })
          })
          const filtering = data.filter(a =>{ return a.month == month[calender.getMonth()]})
          const hitung = filtering.reduce((a,b)=>{return a+Number(b.price)}, 0)
          await Promise.all(promises)
          setTotalPengeluaran(hitung)
          dispatch({type: 'SET_LOADING', value: false})
      }
      else {
        dispatch({type: 'SET_LOADING', value: false})
      }
      })
  }

  return (
      <View style={styles.page}>
        <Header type='dark-only' title='Data Kas'/>
        <View style={styles.coloring}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.container} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onResfresh}/>}>
            <Gap height ={10}/>

            <TouchableOpacity style={styles.box} onPress={()=> {navigation.navigate('Kas_admin')}}>
              <View style={styles.tableBox}>
              <View style={styles.tableLeftBox}>
                  <Text style={styles.buttonTeksBox}>Data Keuangan : </Text>
                </View>
                <View style={styles.tableRightBox}>
                  <Text style={styles.buttonTeksBox}>{`${bulan[calender.getMonth()]} ${calender.getFullYear()}`}</Text>
                </View>
              </View>
              <Gap height={20}/>
              <View style={styles.tableBox}>
                <View style={styles.tableLeftBox}>
                  <Text style={styles.buttonTeksBox}>Pemasukan</Text>
                  <Text style={styles.buttonTeksBox}>Pengeluaran</Text>
                </View>
                <View style={styles.tableCenterBox}>
                  <Text style={styles.buttonTeksBox}>Rp</Text>
                  <Text style={styles.buttonTeksBox}>Rp</Text>
                </View>
                <View style={styles.tableRightBox}>
                  <Text style={styles.buttonTeksBox}>{`${getNumber(totalPendapatan)},-`}</Text>
                  <Text style={styles.buttonTeksBox}>{`${getNumber(Number(totalPengeluaran)+Number(totalHutang))},-`}</Text>
                </View>
              </View>
              <Gap height={10}/>
              <View style={styles.tableBoxLine}>
                <View style={styles.tableLeftBox}>
                  <Text style={styles.buttonTeksBox}>Total</Text>
                </View>
                <View style={styles.tableCenterBox}>
                  <Text style={styles.buttonTeksBox}>Rp</Text>
                </View>
                <View style={styles.tableRightBox}>
                  <Text style={styles.buttonTeksBox}>{`${getNumber(Number(totalPendapatan)-(Number(totalPengeluaran)+Number(totalHutang)))},-`}</Text>
                  <Gap height={20}/>
                  <Text style={styles.buttonTeksBox}>{`Detail >>`}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <Gap height ={20}/>
          </ScrollView>
        </View>
      </View>
  )
}

export default Data_Kas

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

  box : {
    marginHorizontal : 10,
    borderRadius: 10,
    elevation: 5,
    padding: 20,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.background
  },
  tableBox :{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tableBoxLine :{
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: colors.border.onBlur
  },
  tableLeftBox: {
    flex: 1,
    alignItems: 'flex-start'
  },
  tableCenterBox: {
    width: 25
  },
  tableRightBox: {
    flex: 1,
    alignItems: 'flex-end'
  },
  buttonTeksBox: {
    color: colors.text.subTitle,
    fontFamily: fonts.primary[700],
    fontSize: 14,
    fontWeight: 'bold'
  },
})