export default function init() {
  !function initYt() {
    if (!wx.getStorageSync('auth')) {
      wx.cloud.callFunction({
        name: 'youtu',
        data: {
        }
      }).then(res => {
        wx.setStorageSync('auth', res.result.auth)
        wx.setStorageSync('ytAppid', res.result.ytAppid)
      })
    }
  }
}