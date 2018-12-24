function request (data) {
    const defaultHeader = {
        Authorization: wx.getStorageSync('auth'),
        'content-type': 'text/json'
    }
    const defaultData = {
        app_id: '10151589'
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.youtu.qq.com/youtu' + data.url,
        data: Object.assign({}, defaultData, data.data),
        header: Object.assign({}, defaultHeader, data.header || {}),
        method: data.method,
        dataType: data.dataType,
        responseType: data.responseType,
        success: function(res) {
          resolve(res)
        },
        fail: function(err) {
          reject(err)
        },
        complete: function() {

        }
      })
    })
  }
const STATUS = 'status'
export default store => next => action => {
  const opts = action['api'];
  if (opts === undefined) {
      return next(action)
  }
  const [requestType, successType, failureType] = opts.types;
  console.log(4444, opts.types)
//   opts.url = ~url.indexOf(API_ROOT) ? url : (API_PROTOCOL + API_ROOT + url);
  function actionWith(_action) {
      console.log(_action)
      _action = Object.assign(action, _action);
      let status = 'fetching';
      switch (_action.type) {
          case successType:
              status = 'success';
              break;
          case failureType:
              status = 'fail';
              break;
      }


      if (status !== 'fetching') {
          _action.data = Object.assign(_action.data || {}, {
              [STATUS]: status
          });
      } else {
          _action.data = {
              [STATUS]: status
          };
      }

      const finalAction = _action;

      delete finalAction['api'];

      // action传给reducer的附加数据
      finalAction.ext = opts.actionExt || {};
      console.log(222, finalAction)
      return finalAction;
  }
  next(actionWith({
      type: requestType,
      data: Object.assign({}, opts.data)
  }));
  console.log(1111)
  return request(opts)
      // ajax error
      .then((res) => {
          let data = res.data;
          opts.success && opts.success(data, next);
          const finalAction = actionWith({
              type: successType,
              data: data
          });
          next(finalAction);
          return finalAction;
      }, (data) => {
          if (data instanceof Error) {
          }
          opts.fail && opts.fail(data, next);
          const finalAction = actionWith({
              type: failureType,
              error: data
          });
          next(finalAction);
          return Promise.reject(finalAction);
      })
}