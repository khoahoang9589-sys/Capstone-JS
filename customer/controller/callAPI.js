// Dùng Export

export let getAll = () => {
    return axios({
        method: 'get',
        url: `https://svcy.myclass.vn/api/ProductApi/getall`,
    })
}