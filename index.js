let axios = require('./lib/axios')
let url = './list.json'
axios.interceptors.request.use(
  function(config) {
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function(res) {
    return res
  },
  function(error) {
    console.log(error)
  }
)
// var CancelToken = axios.CancelToken
// var source = CancelToken.source()

console.log('请求开始前的准备个工作')
axios(url, 
//   {
//   cancelToken: source.token
// }
)
  .then(res => {
    console.log(res)
  })
  .catch(res => {
    console.log(res)
  })

// source.cancel('Operation canceled by the user.')
