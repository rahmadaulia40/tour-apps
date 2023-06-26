import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native'
import { Button, Gap, Header, List } from '../../components'
import { Firebase, Midtrans } from '../../config'
import { getData, getNumber, showError } from '../../utils'
import { colors, fonts } from '../../utils'
//import axios from 'axios'
import { useDispatch } from 'react-redux';
import { IconMapsActive } from '../../assets'

const DetailHistory_user = ({navigation, route}) => {
    const data = route.params;
    const status = data.status
    const [profile, setProfile] = useState({fullName: ''})
    const [listOutlet, setListOutlet] = useState({})
    const dispatch = useDispatch();
    useEffect(()=> {
        getData('user').then(res => {setProfile(res)})
        getDataOutlet()
    }, [profile.uid])

    const month = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"]
    const tgl = [
      "00","01","02","03","04","05","06","07","08","09",
      "10","11","12","13","14","15","16","17","18","19",
      "20","21","22","23","24","25","26","27","28","29",
      "30","31","32","33","34","35","36","37","38","39",
      "40","41","42","43","44","45","46","47","48","49",
      "50","51","52","53","54","55","56","57","58","59","60"
    ]
    const date = new Date();
    const year = date.getFullYear().toString()

    const getDataOutlet = ()=>{
        const rootDB = Firebase.database().ref()
        const troliDB = rootDB.child(`outlet/`)
        troliDB.on('value', async snapshot => {
            if(snapshot.val()) {
                setListOutlet(snapshot.val())
            }
        })
    }

    const contactPerson =()=>{
        Linking.openURL('whatsapp://send?text=Hai, saya memiliki keluhan atas pelayanan anda !&phone=+62'+listOutlet.outletPhone)
        .catch(()=>{
            showError('Whatsapp tidak bisa di akses ! Pastikan Whatsapp sudah tersedia dan sudah aktif !')
        })
    }

    const button = () => {
        const onConfirmation=()=>{
            const sendData = {
                status : 'Transaksi Selesai',
                endDate : tgl[date.getDate()],
                endMonth : month[date.getMonth()],
                endYear : date.getFullYear(),
                statusPembayaran : 'Lunas'
            }
            Firebase.database().ref(`order/${data.uidOrder}/`).update(sendData)
            .then(()=>{
                Firebase.database().ref(`order/${data.uidOrder}/nameDriver`).remove()
                .then(()=>{
                    dispatch({type: 'SET_LOADING', value: false})
                    navigation.goBack()
                })
            })
        }
        if(status == 'Proses Konfirmasi Pembayaran'){
            return(
                <>
                <Button title='Konfirmasi Pembayaran' type='primary' onPress={()=> onConfirmation()}/>
                <Gap height={10}/>
                </>
            )
        }
        if(status == 'Kurir Telah Tiba Dilokasi'){
            if(data.paymentMethod == 'DS PayLater'){
                return(
                    <>
                    <Button title='Konfirmasi Pembayaran' type='primary' onPress={()=> onConfirmation()}/>
                    <Gap height={10}/>
                    </>
                )
            }
        }
    }

    return (
        <View style={styles.container}>
            <Header title='Rincian Pesanan' type='payment' onPress={()=> navigation.goBack()}/>
            <ScrollView style={styles.coloring} showsVerticalScrollIndicator={false}>

                <View style={styles.addressBox}>
                    <Gap width={10}/>
                    <View style={{flex: 1, paddingRight: 10}}>
                        <Text style={styles.addressText1}>Informasi Pesanan :</Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View>
                                <Text style={styles.addressText}>No. Pesanan</Text>
                                <Text style={styles.addressText}>Tanggal Pemesanan</Text>
                                {data.statusPembayaran == undefined ? <View/> : 
                                <>
                                    <Text style={styles.addressText}>Tanggal Selesai</Text>
                                    <Text style={styles.addressText}>Status Pembayaran</Text>
                                </>}
                            </View>
                            <View>
                                <Text style={styles.addressText}>:</Text>
                                <Text style={styles.addressText}>:</Text>
                                {data.statusPembayaran == undefined ? <View/> : 
                                <>
                                    <Text style={styles.addressText}>:</Text>
                                    <Text style={styles.addressText}>:</Text>
                                </>}
                            </View>
                            <View style={{alignItems: 'flex-end'}}>
                                <Text style={styles.addressText}>{data.NOTA}</Text>
                                <Text style={styles.addressText}>{`${data.startDate}-${data.startMonth}-${data.startYear}`}</Text>
                                {data.statusPembayaran == undefined ? <View/> : 
                                <>
                                    <Text style={styles.addressText}>{`${data.endDate}-${data.endMonth}-${data.endYear}`}</Text>
                                    <Text style={styles.addressText}>{data.statusPembayaran}</Text>
                                </>}
                            </View>
                        </View>
                        <Gap height={5}/>
                    </View>
                </View>

                <Gap height={10}/>

                <View style={styles.addressBox}>
                    <Gap width={10}/>
                    <View>
                        <Gap height={10}/>
                        <Text style={styles.addressText1}>Status : {`${data.nameDriver == undefined ? data.status : data.status+' ( '+data.nameDriver+' )'}`}</Text>
                        <Gap height={10}/>
                    </View>
                </View>

                <Gap height={10}/>

                <View style={styles.addressBox}>
                    <IconMapsActive/>
                    <View>
                        <Text style={styles.addressText1}>Alamat Pengiriman :</Text>
                        <Text style={styles.addressText}>{profile.storeName} | {profile.fullName}</Text>
                        <Text style={styles.addressText}>{profile.storeAddress} | {profile.ponsel}</Text>
                        <Gap height={5}/>
                    </View>
                </View>
                
                <Gap height={10}/>

                <View style={{backgroundColor: colors.white}}>
                <Gap height={10}/>
                <View style={{paddingLeft: 13, borderBottomWidth: 1, borderColor: colors.border.onBlur, paddingBottom: 10}}>
                    <Text style={styles.addressText1}>Pesanan saya :</Text>
                </View>
                {
                data.item.map(data => {
                return <List 
                    type ='showOnly' 
                    key = {data.uidItem}
                    name={data.namaBarang}
                    total={`Rp.${getNumber(Number(data.hargaJual)*Number(data.stock))},-`}
                    desc={`${getNumber(data.stock)} ${data.satuanBarang} x Rp.${getNumber(data.hargaJual)},-`}
                  />
                })
                }
                    <View style={styles.addressBox}>
                        <Gap width={10}/>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View>
                                <Text style={styles.addressText1}>Total Pesanan</Text>
                                {data.duitPelanggan == undefined ? <View/> :
                                <>
                                    <Text style={styles.addressText1}>Duit Pelanggan</Text>
                                    <Text style={styles.addressText1}>Kembalian</Text>
                                </>}
                            </View>
                            <View>
                                <Text style={styles.addressText1}>: Rp.</Text>
                                {data.duitPelanggan == undefined ? <View/> :
                                <>
                                <Text style={styles.addressText1}>: Rp.</Text>
                                <Text style={styles.addressText1}>: Rp.</Text>
                                </>}
                            </View>
                            <View style={{alignItems: 'flex-end', paddingRight: 10}}>
                                <Text style={styles.addressText1}>{getNumber(data.totalPrice)},-</Text>
                                {data.duitPelanggan == undefined ? <View/> :
                                <>
                                <Text style={styles.addressText1}>{getNumber(data.duitPelanggan)},-</Text>
                                <Text style={styles.addressText1}>{getNumber(Number(data.duitPelanggan)-Number(data.totalPrice))},-</Text>
                                </>}
                            </View>
                        </View>
                        <Gap height={30}/>
                    </View>
                </View>

                <Gap height={10}/>

                <View style={styles.addressBox}>
                    <Gap width={10}/>
                    <View>
                        <Text style={styles.addressText1}>Metode Pembayaran :</Text>
                        <Text style={styles.addressText}>{data.paymentMethod == 'COD' ? 'COD (Cash On Delivery)' : data.paymentMethod}</Text>
                        <Gap height={5}/>
                    </View>
                </View>

                <Gap height={10}/>
                {button()}
                <Button title='Hubungi Penjual' type='secondary' onPress={()=> contactPerson()}/>
                <Gap height={10}/>
            </ScrollView>
        </View>
    )
}

export default DetailHistory_user

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : colors.primary,
      },
      coloring:{
        backgroundColor : colors.secondary,
        flex : 1,
      },
    box: {
        flex: 1,
        backgroundColor: colors.white,
        padding: 20,
        marginHorizontal: 10,
        borderRadius: 10
      },
    dropdownStyle: {
        backgroundColor: colors.background,
        borderRadius: 10,
        width: '100%',
        borderWidth: 1
      },
      nameDropDown: {
        fontFamily: fonts.primary[700],
        color : colors.text.primary
      },
      title : {
        fontFamily: fonts.primary[700],
        color : colors.primary,
        alignSelf: 'center',
        fontSize: 20
      },
      modal: {
        backgroundColor: colors.background,
        borderRadius: 10,
        paddingVertical: 20,
        marginHorizontal: 20,
        paddingHorizontal: 20
      },
      addressBox: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        padding : 5,
      },
      addressText: {
        paddingLeft: 2,
        color: colors.text.menuInactive,
        fontFamily: fonts.primary[600],
        fontSize: 13
      },
      addressText1: {
        paddingLeft: 2,
        color: colors.text.primary,
        fontFamily: fonts.primary[600],
        fontSize: 15,
        fontWeight: '700'
      },
  })