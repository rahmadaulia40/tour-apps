export const Currency =(nilai)=>{
    const formattedValue = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(nilai);
    return formattedValue
  }