export default function wxCloud(name, data, success, fail) {
  console.log(data)
  return wx.cloud.callFunction({
    // 云函数名称
    name: name,
    // 传给云函数的参数
    data: data,
    success: success || function(res) {
      console.log(res.result) // 3
    },
    fail: fail || console.error
  })
}