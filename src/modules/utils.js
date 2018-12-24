export function imgToBase64(path) {
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath: path,
      encoding: 'base64',
      success: (result) => {
        console.log(1999)
        resolve(result.data)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}