export const EuclideanDistance = (location1,location2) => {
    if (location1.length !== location2.length) {
        throw new Error('Vectors must be of equal length');
    }
    let distance = 0;
    for (let i = 0; i < location1.length; i++) {
        distance += Math.pow(location1[i] - location2[i], 2);
    }
    return Math.sqrt(distance)*100;
}