
export async function getCurrentData(){
    let data: any = new Date(Date.now())
    const time = data.toLocaleTimeString().slice(0, 5)
    data = `date: ${data.toLocaleDateString()}, time: ${time}`

    return data
}