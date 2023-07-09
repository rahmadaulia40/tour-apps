
const TheStrom= {
    primary : '#006775',
    secondary : '#f9bf15',
    tertiary : '#2a9f29',
    fourth : '#ffffff',
    success : '#0BCAD4',
    error : '#E06379',
    title : '#555A54',
    
}
const color = TheStrom
export const Colors = {
    background : color.fourth,
    primary : color.primary,
    secondary : color.tertiary,
    tertiary : color.fourth,
    white : color.fourth,
    black : color.primary,
    disable : color.fourth,
    text : {
        primary : color.primary,
        secondary : color.fourth,
        menuInactive : color.title,
        menuActive : color.primary,
        subTitle: color.secondary
    },
    button : {
        primary :{
            background : color.primary,
            text : color.secondary
        },
        secondary : {
            background : color.secondary,
            text : color.primary
        },
        disable : {
            background : color.tertiary,
            text : color.fourth
        }
    },
    border : {
        onFocus : color.primary,
        onBlur : color.fourth
    },
    cardLight : color.secondary,
    loadingBackground : color.primary,
    success : color.success,
    error : color.error
};