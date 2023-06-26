import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, ScrollView, Image, RefreshControl} from 'react-native';
import { WashingCategory, Gap, NewsItem, ReviewUser, Header, List } from '../../components';
import { colors, fonts, getData, getNumber, push_notification, showError, storeData } from '../../utils';
import {Firebase} from '../../config';
import { useDispatch } from 'react-redux';
import { ILLogo2, ILNullPhoto } from '../../assets';

const Home_user = ({navigation}) => {
  const [refresh, setRefresh] = React.useState(false)
  const onResfresh = React.useCallback(()=>{
    getDataTotalBelanja()
    getDataUser()
    getDataUserOnFirebase()
    getDataDSPayLater()
    setRefresh(true)
    setTimeout(()=>{
      setRefresh(false)
    }, 2000)
  })
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({fullName: ''})
  const [DSPayLater, setDSPayLater] = useState([])
  const [detailHutang, setDetailHutang] = useState([])
  const [totalBelanja, setTotalBelanja] = useState('0')
  const [totalHutang, setTotalHutang] = useState('0')
  const [photo, setPhoto] = useState(ILNullPhoto)
  useEffect(()=> {
    getDataTotalBelanja()
    getDataUser()
    getDataUserOnFirebase()
    getDataDSPayLater()
  }, [profile.uid])
  
  const getDataDSPayLater=()=>{
    dispatch({type: 'SET_LOADING', value: true})
    Firebase.database().ref(`limitDSPayLater/0/`)
    .on('value',async snapshot=>{
      if(snapshot.val()){
        const data = snapshot.val()
        setDSPayLater(data)
        setRefresh(false)
        dispatch({type: 'SET_LOADING', value: false})
      }
      else{
        dispatch({type: 'SET_LOADING', value: false})
      }
    })
  }

  const getDataTotalBelanja=()=>{
    dispatch({type: 'SET_LOADING', value: true})
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
        const totalBelanja = filtering.reduce((val, element)=>{return val + Number(element.totalPrice == undefined ? '0' : element.totalPrice)},0)
        const filteringHutang = filtering.filter(item =>{return item.paymentMethod == 'DS PayLater'})
        const totalHutang = filteringHutang.reduce((val, element)=>{return val + Number(element.totalPrice == undefined ? '0' : element.totalPrice)},0)
        setTotalBelanja(totalBelanja)
        setTotalHutang(totalHutang)
        setDetailHutang(filteringHutang)
        setRefresh(false)
      }
    })
  }

  const getDataUser=()=>{
    dispatch({type: 'SET_LOADING', value: true})
    getData('user')
    .then(res => {
      setProfile(res)
      setPhoto( res.photo == undefined ? ILNullPhoto : { uri: res.photo})
    })
  }
  const getDataUserOnFirebase=()=>{
    Firebase.database()
    .ref(`account/${profile.uid}/`)
    .once('value')
    .then(resDB => {
      //save to localstorage
      if (resDB.val()) {
        const data = resDB.val()
        storeData('user',data)
      }
    })
  }

  const view =()=>{
    if(totalBelanja >=DSPayLater.totalBelanja){
      return(
        <View style={styles.limitBox}>
          <View style={styles.image}>
            <Image source={ILLogo2} style={styles.logo}/>
          </View>
          <View>
            <Gap height ={15}/>
            <Text style={styles.titleLimit}>Limit DS-PayLater</Text>
            <Gap height ={5}/>
            <Text style={styles.titleLimit}>Rp.{DSPayLater.totalBelanja == undefined ? '0' : getNumber(DSPayLater.limitSaldo)},-</Text>
            <Gap height ={15}/>
          </View>
        </View>
      )
    }
    else{
      return(
        <View style={styles.limitBox}>
          <View style={styles.image}>
            <Image source={ILLogo2} style={styles.logo}/>
          </View>
          <View>
            <Gap height ={15}/>
            <Text style={styles.titleLimit}>DS-PayLater</Text>
            <Gap height ={5}/>
            <Text style={styles.titleLimit2}>Capai Total Belanja</Text>
            <Text style={styles.titleLimit2}>Rp.{DSPayLater.totalBelanja == undefined ? '0' : getNumber(DSPayLater.totalBelanja)},-</Text>
            <Text style={styles.titleLimit2}>Agar Terbuka</Text>
            <Gap height ={15}/>
          </View>
        </View>
      )
    }
  }

  return (
    <>
      <View style={styles.page}>
        <View style={styles.content}>
          <ScrollView showsVerticalScrollIndicator={false} style={{marginHorizontal: 0}} refreshControl={<RefreshControl refreshing={refresh} onRefresh={onResfresh}/>}>
            
            <Header type='home' title={profile.fullName} photo={photo}/>
            
            
            <Gap height ={10}/>

              {view()}

            
            <Gap height ={10}/>
            <View style={styles.hutangBox}>
              <View>
                <Gap height ={15}/>
                <Text style={styles.titleLeft}>Total Belanja Saya :</Text>
                <Gap height ={5}/>
                <Text style={styles.titleLeft}>Rp.{getNumber(totalBelanja)},-</Text>
                <Gap height ={20}/>
              </View>
            </View>

            <Gap height ={10}/>
            <View style={styles.hutangBox}>
              <View>
                <Gap height ={15}/>
                <Text style={styles.titleLeft}>Hutang :</Text>
                <Gap height ={5}/>
                {totalBelanja >=DSPayLater.totalBelanja ? 
                  <Text style={styles.titleLeft}>Rp.{getNumber(totalHutang)},-</Text> :
                  <Text style={styles.titleLeft}>Belum Terbuka</Text>
                }
                <Gap height ={15}/>
              </View>
              <View>
                <Gap height ={15}/>
                <Text style={styles.titleRight}>Sisa Saldo :</Text>
                <Gap height ={5}/>
                {totalBelanja >=DSPayLater.totalBelanja ? 
                  <Text style={styles.titleRight}>Rp.{getNumber(Number(DSPayLater.limitSaldo)-Number(totalHutang))},-</Text> :
                  <Text style={styles.titleRight}>Belum Terbuka</Text>
                }
                <Gap height ={15}/>
              </View>
            </View>

            <Gap height ={10}/>
            <View style={styles.detailHutangBox}>
              <View>
                <Gap height ={15}/>
                <Text style={styles.titleLeft}>Detail Hutang :</Text>
              </View>
              <View style={styles.titleBoxDetailHutang}>
                <View>
                  <Gap height ={12}/>
                  {totalBelanja >=DSPayLater.totalBelanja ? 
                    detailHutang.map(data=>{
                      return(
                        <Text key={data.uidOrder} style={styles.titleLeft}>{data.endDate}-{data.endMonth}-{data.endYear}</Text>
                      )
                    }) :
                    <Text style={styles.titleLeft}>Belum Terbuka</Text>
                  }
                  <Gap height ={15}/>
                </View>
                <View>
                  <Gap height ={12}/>
                  {totalBelanja >=DSPayLater.totalBelanja ? 
                    detailHutang.map(data=>{
                      return(
                        <Text key={data.uidOrder} style={styles.titleRight}>Rp.{getNumber(data.totalPrice)},-</Text>
                      )
                    }) :
                    <Text style={styles.titleRight}>Belum Terbuka</Text>
                  }
                  <Gap height ={15}/>
                </View>
              </View>
            </View>

            <Gap height ={40}/>
          </ScrollView>
        </View>
      </View>
    </>
  )
}

export default Home_user

const styles = StyleSheet.create({
  page : {
    flex : 1,
    backgroundColor : colors.background,
  },
  content : {
    flex : 1,
    backgroundColor : colors.background,
  },
  limitBox: {
    marginHorizontal: 10,
    backgroundColor: colors.primary,
    elevation: 15,
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 3,
    borderColor: colors.secondary
  },
  titleLimit: {
    fontFamily: fonts.primary[900],
    color: colors.text.subTitle,
    fontSize: 18,
    alignSelf: 'flex-end',
    paddingRight: 20
  },
  titleLimit2: {
    fontFamily: fonts.primary[900],
    color: colors.text.subTitle,
    fontSize: 16,
    alignSelf: 'flex-end',
    paddingRight: 20
  },
  hutangBox: {
    marginHorizontal: 10,
    backgroundColor: colors.secondary,
    elevation: 15,
    borderRadius: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: colors.primary
  },
  titleLeft: {
    fontFamily: fonts.primary[900],
    color: colors.text.menuActive,
    fontSize: 16,
    alignSelf: 'flex-start',
    paddingLeft: 20
  },
  titleRight: {
    fontFamily: fonts.primary[900],
    color: colors.text.menuActive,
    fontSize: 16,
    alignSelf: 'flex-end',
    paddingRight: 20
  },
  logo: {
    height: '130%',
    width: '100%',
    
  },
  image: {
    aspectRatio: 1 * 1,
  },
  detailHutangBox: {
    marginHorizontal: 10,
    backgroundColor: colors.secondary,
    elevation: 15,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.primary
  },
  titleBoxDetailHutang: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }

})