import { ComponentClass } from 'react'
import Taro, { Component, Config, switchTab } from '@tarojs/taro'
import { View, Button, Text, Image, Camera, CoverView, CoverImage } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd, getGenerateInfo } from '../../actions/counter'
import youtu from '../../modules/youtu-api'
import './index.scss'

// #region 书写注意
// 
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  counter: {
    num: number
  }
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
  getGenerateInfo: () => any
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Camera {
  props: IProps;
}

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  },
  getGenerateInfo (data) {
    dispatch(getGenerateInfo(data))
    .then(res => {
      console.log(123123, res.data)
    })
  }
}))
const systemInfo = wx.getSystemInfoSync()

class CameraCom extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarcTitleText: '拍照'
  }

  constructor() {
    super();
    this.state = {
      cameraInfo: {
        mode: 'normal',
        devicePos: 'back',
        flash: 'off',

      },
      cmBg: 'data:image/png;base64,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'
    }
  }

  componentWillMount () {
    this.setState({
      cameraHeight: systemInfo.windowHeight - 46 + 'px'
    })
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  takePhoto = () => {
    
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setState({
          src: res.tempImagePath
        })
        Taro.redirectTo({url: '/pages/index/index?imagePath=' + res.tempImagePath})
      }
    })
  }

  changeCameraInfo = (type) => {
    let cameraInfo = this.state.cameraInfo
    switch(type) {
      case 0: cameraInfo.devicePos = cameraInfo.devicePos == 'back' ? 'front' : 'back';
        break;
      case 1: cameraInfo.flash = cameraInfo.flash == 'off' ? 'on' : 'off';
        break;
      case 2: cameraInfo.mode = cameraInfo.mode == 'normal' ? 'scanCode' : 'normal';
        break;
    }

    this.setState({cameraInfo: cameraInfo});
  }

  render () {
    const { cameraInfo } = this.state

    return (
      <View className="camera">
        <View className="camera-operate">
          <Button type="primary" onClick={this.changeCameraInfo.bind(this, 0)}></Button>
          <Button type="primary" onClick={this.changeCameraInfo.bind(this, 2)}>扫码</Button>
          <Button type="primary" className={`flash-${cameraInfo.flash}`} onClick={this.changeCameraInfo.bind(this, 1)}></Button>
        </View>
        {/* style={{height:this.state.cameraHeight}} */}
        <Camera device-position={cameraInfo.devicePos} flash={cameraInfo.flash} mode={cameraInfo.mode} className="camera-body" style="height: 100vh;width: 100vw;">
          <CoverView className="take-photo"onClick={this.takePhoto}>
            <CoverImage src="cloud://zzw-1f4041.7a7a-zzw-1f4041/take-photo.png"></CoverImage>
          </CoverView>
        </Camera>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default CameraCom as ComponentClass<PageOwnProps, PageState>
