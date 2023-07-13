import {
    KA_1, KA_360_1,
    KA_2, KA_360_2,
    KA_3, KA_360_3,
    KA_4, KA_360_4,
    KA_5, KA_360_5,
    MABAR_1, MABAR_360_1,
    MABAR_2, MABAR_360_2,
    MABAR_3, MABAR_360_3,
    MABAR_4, MABAR_360_4,
    MABAR_5, MABAR_360_5,
    MABAR_6, PAS_360_1,
    PAS_1, PAS_360_2,
    PAS_2, PAS_360_3,
    PAS_3, PAS_360_4,
    SUNGLO_1, PAS_360_5,
    SUNGLO_2, SUNGLO_360_1,
    SUNGLO_3, SUNGLO_360_2,
    SUNGLO_360_3
} from "../../Assets"
import { KA_360_1_Base64, KA_360_2_Base64, KA_360_3_Base64, KA_360_4_Base64, KA_360_5_Base64 } from "./KA_360_Base64"
import { MABAR_360_1_Base64, MABAR_360_2_Base64, MABAR_360_3_Base64, MABAR_360_4_Base64, MABAR_360_5_Base64 } from "./MABAR_360_Base64"
import { PAS_360_1_Base64, PAS_360_2_Base64, PAS_360_3_Base64, PAS_360_4_Base64, PAS_360_5_Base64 } from "./PAS_360_Base64"
import { SUNGLO_360_1_Base64, SUNGLO_360_2_Base64, SUNGLO_360_3_Base64 } from "./SUNGLO_360_Base64"

export const Images =(image)=>{
    if(image == 'KA_1') return KA_1
    else if(image == 'KA_2') return KA_2
    else if(image == 'KA_3') return KA_3
    else if(image == 'KA_4') return KA_4
    else if(image == 'KA_5') return KA_5
    else if(image == 'MABAR_1') return MABAR_1
    else if(image == 'MABAR_2') return MABAR_2
    else if(image == 'MABAR_3') return MABAR_3
    else if(image == 'MABAR_4') return MABAR_4
    else if(image == 'MABAR_5') return MABAR_5
    else if(image == 'MABAR_6') return MABAR_6
    else if(image == 'PAS_1') return PAS_1
    else if(image == 'PAS_2') return PAS_2
    else if(image == 'PAS_3') return PAS_3
    else if(image == 'SUNGLO_1') return SUNGLO_1
    else if(image == 'SUNGLO_2') return SUNGLO_2
    else if(image == 'SUNGLO_3') return SUNGLO_3
    else return KA_1
}



export const Images360=(image)=>{
    if(image == 'KA_360_1') return KA_360_1_Base64
    else if(image == 'KA_360_2') return KA_360_2_Base64
    else if(image == 'KA_360_3') return KA_360_3_Base64
    else if(image == 'KA_360_4') return KA_360_4_Base64
    else if(image == 'KA_360_5') return KA_360_5_Base64
    else if(image == 'MABAR_360_1') return MABAR_360_1_Base64
    else if(image == 'MABAR_360_2') return MABAR_360_2_Base64
    else if(image == 'MABAR_360_3') return MABAR_360_3_Base64
    else if(image == 'MABAR_360_4') return MABAR_360_4_Base64
    else if(image == 'MABAR_360_5') return MABAR_360_5_Base64
    else if(image == 'PAS_360_1') return PAS_360_1_Base64
    else if(image == 'PAS_360_2') return PAS_360_2_Base64
    else if(image == 'PAS_360_3') return PAS_360_3_Base64
    else if(image == 'PAS_360_4') return PAS_360_4_Base64
    else if(image == 'PAS_360_5') return PAS_360_5_Base64
    else if(image == 'SUNGLO_360_1') return SUNGLO_360_1_Base64
    else if(image == 'SUNGLO_360_2') return SUNGLO_360_2_Base64
    else if(image == 'SUNGLO_360_3') return SUNGLO_360_3_Base64
    else return KA_360_1_Base64
}