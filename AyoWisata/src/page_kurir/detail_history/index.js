import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native'
import { Button, Gap, Header, Input, List } from '../../components'
import { Firebase, Midtrans } from '../../config'
import { getData, showError } from '../../utils'
import { colors, fonts } from '../../utils'
import { useDispatch } from 'react-redux';
import { IconMapsActive } from '../../assets'
import Modal from "react-native-modal";

const DetailHistory_kurir = ({navigation, route}) => {
    const data = route.params;
    const status = data.status
    const [profile, setProfile] = useState({fullName: ''})
    const [listUser, setListUser] = useState({})
    const [pembayaran, setPembayaran] = useState('0')
    const dispatch = useDispatch()
    const [isModalVisible, setModalVisible] = useState(false)
    const toggleModal = () => {setModalVisible(!isModalVisible)}
    useEffect(()=> {
        getData('kurir').then(res => {setProfile(res)})
        getDataUser()
    }, [profile.uid])

    const month = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24"]
    const tgl = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53","54","55","56","57","58","59","60"]
    const date = new Date();

    const getDataUser = ()=>{
        const rootDB = Firebase.database().ref()
        const troliDB = rootDB.child(`account/${data.uidUser}/`)
        troliDB.on('value', async snapshot => {
            if(snapshot.val()) {
                setListUser(snapshot.val())
            }
        })
    }

    const contactPerson =()=>{
        Linking.openURL('whatsapp://send?text=Hai, saya memiliki keluhan atas pelayanan anda !&phone=+62'+listUser.ponsel)
        .catch(()=>{
            showError('Whatsapp tidak bisa di akses ! Pastikan Whatsapp sudah tersedia dan sudah aktif !')
        })
    }

    const button = () => {
        if (status === 'Pesanan Dibawa oleh'){
            const sendData = {
                status : 'Kurir Telah Tiba Dilokasi',
                endDate : tgl[date.getDate()],
                endMonth : month[date.getMonth()],
                endYear : date.getFullYear(),
                uidDriver : profile.uid,
                nameDriver : profile.fullName

            }
            const onConfirmation=()=>{
                Firebase.database().ref(`order/${data.uidOrder}/`).update(sendData)
                .then(()=>{
                    dispatch({type: 'SET_LOADING', value: false})
                    navigation.goBack()
                })
            }
            return(
                <>
                    <Button title='Konfirmasi Telah Tiba' onPress={()=> onConfirmation()}/>
                    <Gap height={10}/>
                </>
            )
        }
        if (status === 'Kurir Telah Tiba Dilokasi'){
            return(
                <>
                    <Button title='Input Pembayaran' onPress={()=> toggleModal()}/>
                    <Gap height={10}/>
                </>
            )
        }
    }
    const onPay=()=>{
        toggleModal()
        const sendData = {
            status : 'Proses Konfirmasi Pembayaran',
            endDate : tgl[date.getDate()],
            endMonth : month[date.getMonth()],
            endYear : date.getFullYear(),
            uidDriver : profile.uid,
            nameDriver : profile.fullName,
            duitPelanggan : pembayaran

        }
        Firebase.database().ref(`order/${data.uidOrder}/`).update(sendData)
        .then(()=>{
            dispatch({type: 'SET_LOADING', value: false})
            navigation.goBack()
        })
    }
    return (
        <>
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
                        <Text style={styles.addressText}>{listUser.storeName} | {listUser.fullName}</Text>
                        <Text style={styles.addressText}>{listUser.storeAddress} | {listUser.ponsel}</Text>
                        <Gap height={5}/>
                    </View>
                </View>
                
                <Gap height={10}/>

                <View style={{backgroundColor: colors.white}}>
                <Gap height={10}/>
                <View style={{paddingLeft: 13, borderBottomWidth: 1, borderColor: colors.border.onBlur, paddingBottom: 10}}>
                    <Text style={styles.addressText1}>Pesanan {listUser.fullName} :</Text>
                </View>
                {
                data.item.map(data => {
                return <List 
                    type ='showOnly' 
                    key = {data.uidItem}
                    name={data.namaBarang}
                    total={`Rp.${Number(data.hargaJual)*Number(data.stock)},-`}
                    desc={`${data.stock} ${data.satuanBarang} x Rp.${data.hargaJual},-`}
                  />
                })
                }
                    <View style={styles.addressBox}>
                        <Gap width={10}/>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between',flex: 1, alignItems: 'center', paddingRight: 15}}>
                            <Text style={styles.addressText1}>Total Pesanan :</Text>
                            <Text style={styles.addressText1}>Rp.{data.totalPrice},-</Text>
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
                <Button title='Hubungi Customer' type='secondary' onPress={()=> contactPerson()}/>
                <Gap height={10}/>
            </ScrollView>
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
                        <Text style={styles.addressText1}>{data.totalPrice},-</Text>
                        <Text style={styles.addressText1}>{Number(pembayaran)-Number(data.totalPrice)},-</Text>
                    </View>
                </View>
                <Gap height={20}/>
            </ScrollView>
            <View style={styles.button}>
                <Button title='Bayar' type='primary' onPress={()=>onPay()} disable={Number(data.totalPrice) <= pembayaran ? false : true}/>
                <Button title='Close' type='secondary' onPress={toggleModal} />
            </View>
        </View>
     </Modal>
        </>
    )
}

export default DetailHistory_kurir

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
      button : {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
  })