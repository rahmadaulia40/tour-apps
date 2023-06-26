import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, fonts } from '../../../utils'
import LottieView from 'lottie-react-native'

const Loading = () => {
    return (
        <View style={styles.wrapper}>
            <LottieView source={require('../../../assets/json/dummy/search.json')} autoPlay loop style={styles.animation}/>
            <Text style={styles.text}>Loading...</Text>
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    wrapper : {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        width: '100%',
        height: '100%',
    },
    animation : {
        marginTop: -20
    },
    text : {
        fontSize: 18,
        color : colors.primary,
        fontFamily: fonts.primary[600],
        marginTop: 120
    }
})
