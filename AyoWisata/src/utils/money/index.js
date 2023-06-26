export const getNumber = price => {
    const number = Number(price).toString()
    const length = Number(price).toString().length
    const a = number.slice(length-3 >=0 ? length-3 : length-2 >=0 ? length-2 : length-1,length)
    const b = number.slice(length-6 >=0 ? length-6 : length-5 >=0 ? length-5 : length-4,length-3)
    const c = number.slice(length-9 >=0 ? length-9 : length-8 >=0 ? length-8 : length-7,length-6)
    const d = number.slice(length-12 >=0 ? length-12 : length-11 >=0 ? length-11 : length-10,length-9)
    const e = number.slice(length-15 >=0 ? length-15 : length-14 >=0 ? length-14 : length-13,length-12)

    if(length > 12){
        return `${e}.${d}.${c}.${b}.${a}`
    }
    else if(length > 9){
        return `${d}.${c}.${b}.${a}`
    }
    else if(length > 6){
        return `${c}.${b}.${a}`
    }
    else if(length > 3){
        return `${b}.${a}`
    }
    else {
        return `${price}`
    }
}