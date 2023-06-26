import React, { useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, RefreshControl, TouchableOpacity, Text} from 'react-native';
import { Button, Gap, Header, Input, List } from '../../components';
import { Firebase } from '../../config';
import { colors, fonts, getNumber, showError, showSuccess, useForm } from '../../utils';
import Modal from "react-native-modal";

const Data_DSPayLater = ({navigation}) => {
  const [refresh, setRefresh] = React.useState(false)
  const [limit, setLimit] = useState({
    namaLimit : '',
    totalBelanja : '',
    limitSaldo : '',
    uidLimit : ''
  })
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {setModalVisible(!isModalVisible);}
  const onResfresh = React.useCallback(()=>{
    getLimit()
    setRefresh(true)
    setTimeout(()=>{
      setRefresh(false)
    }, 2000)
  })

  useEffect(()=> {
    getLimit()
  },[])

  const getLimit =()=>{
    Firebase.database().ref().child('limitDSPayLater/0/').once('value')
    .then(res=>{
      if(res.val()) {
        setLimit(res.val())
      }
      else{
        setLimit('null')
      }
    })
  }
  const changeText = (key, value) => {
    setLimit({
        ...limit,
        [key]: value
    })
}

  const editLimit=()=>{
      toggleModal()
      Firebase.database().ref(`limitDSPayLater/0/`).update(limit)
      showSuccess('Data Telah Diubah !')
      getLimit()
  }

  return (
    <>
      <View style={styles.page}>
        <Header type='payment' title='List Limit DSPayLater' onPress={()=>{navigation.goBack()}}/>
        <View style={styles.coloring}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.container} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onResfresh}/>}>
            { limit == 'null' ? <Text style={{textAlign: 'center', paddingTop: 20, fontFamily: fonts.primary[800]}}>Data Belum Tersedia !</Text> :
                <List
                  key={limit.uidLimit}
                  name={`${limit.namaLimit} | Limit:  Rp.${getNumber(limit.limitSaldo)},-`}
                  desc={`Total Belanja : Rp.${getNumber(limit.totalBelanja)},-`}
                  type='edit'
                  onPress={()=>toggleModal()}
                />
            }
            <Gap height ={80}/>
          </ScrollView>
        </View>
      </View>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Input Limit DSPayLater</Text>
                <Gap height={10}/>
                <Input judul='Nama Limit' value={limit.namaLimit} onChangeText={(value)=> changeText('namaLimit',value)} type='komentar'/>
                <Gap height={10}/>
                <Input judul='Total Belanja (Rp)' keyboardType='numeric' value={limit.totalBelanja} onChangeText={(value)=> changeText('totalBelanja',value)} type='komentar'/>
                <Gap height={20}/>
                <Input judul='Limit Saldo (Rp)' keyboardType='numeric' value={limit.limitSaldo} onChangeText={(value)=> changeText('limitSaldo',value)} type='komentar'/>
                <Gap height={20}/>
            </ScrollView>
            <View style={styles.button}>
                <Button title='Ubah' type='primary' onPress={editLimit}/>
                <Gap height={10}/>
                <Button title='Close' type='secondary' onPress={toggleModal} />
            </View>
        </View>
     </Modal>
    </>
  )
}

export default Data_DSPayLater

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