let axios = require('./lib/axios')

axios.interceptors.request.use(
  function(config) {
    console.log(config);
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function(res) {
    console.log(res);
    return res
  },
  function(error) {
    console.log(error);
  }
)

console.log(axios.prototype);


console.log('请求开始前的准备个工作');
axios.Axios.prototype.request(
    'https://www.easy-mock.com/mock/5afc389de5c64d22cc1ca565/data/react-native-mock-one'
  )
  .then(res => {
    console.log(res)
  })
  .catch(res => {
    console.log(res)
  })
