const request = options => {
  return new Promise((resolve, reject) => {
    const { data, method, uri } = options
		let head = {}
    if(data && method !== 'get') {
			head = {
				'authorization': 'Bearer ' + uni.getStorageSync('token'),
				'Content-type': 'application/x-www-form-urlencoded'
			}
			if (uri) {
				options.url = 'https://mini.hosiyi.com/' + uri
			}
			
    }
    uni.request({
      header: head,
      ...options,
      success: function(res) {
        if(res.data.code === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: function(res) {
        reject(res.data)
      }
    })
  })
}
export default request