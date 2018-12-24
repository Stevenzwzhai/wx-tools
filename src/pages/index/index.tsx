import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button, Text, Image, Picker, Video } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd, getGenerateInfo } from '../../actions/counter'
import youtu from '../../modules/youtu-api'
import { imgToBase64 } from '../../modules/utils'
import './index.scss'


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

interface Index {
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
class Index extends Component {
  config: Config = {
    navigationBarTitleText: '首页'
  }

  constructor() {
    super();
    this.state = {
      identifyList: [],
      currentPick: 0,
      resultList: []
    }
  }

  componentWillMount () {
    this.getYTInfo();
  }
  
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { 
    console.log('route;', this.$router)
    if (this.$router.params.imagePath) {
      this.setState({
        imageSrc: this.$router.params.imagePath
      })
    }
  }

  componentDidHide () { }

  getYTInfo = () => {
    youtu({
      type: 'youtuInfo',
      data: {},
      success: (ytRes) => {
        this.setState({
          identifyList: ytRes.result.identifyList
        })
      },
      fail: (err) => {
        console.log(33333, err)
      }
    })
  }
  takePhoto = () => {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setState({
          src: res.tempImagePath
        })
        wx.getFileSystemManager().readFile({
          filePath: res.tempImagePath	
          encoding: 'base64',
          success: (result) => {
            console.log('template-', result)
            // this.props.getGenerateInfo(result.data)
            
          }
        })
        
      }
    })
  }

  takePhoto = () => {
    wx.authorize({
      scope: 'scope.camera',
      success: (res) => {
        Taro.navigateTo({
          url: '/pages/camera/index'
        })
      },
      fail:() => {
        wx.showToast('授权失败')
      }
    })
    
  }

  pickerChangeHandler = (data) => {
    this.setState({
      currentPick: data.detail.value
    })
  }

  identifyPhoto = () => {
    if (this.state.imageSrc) {
      imgToBase64(this.state.imageSrc).then(base64Image => {
        youtu({
          type: this.state.identifyList[this.state.currentPick].type,
          data: {param: [base64Image]},
          success: (res) => {
            if (res.result && res.result.data && res.result.data.items) {
              res.result.data.items.forEach(item => {
                console.log(item.itemstring)
              })
              this.setState({
                resultList: res.result.data.items
              })
            }
          },
          fail: (err) => {
            console.log(33333, err)
          }
        })
      })
    }
    
  }

  previewImage() {
    if (this.state.imageSrc) {
      wx.previewImage({urls: [this.state.imageSrc]})
    }

  }
  test = () => {
    console.log(111)

    wx.cloud.downloadFile({ fileID: 'cloud://zzw-1f4041.7a7a-zzw-1f4041/HuaYang.app(1).zip', success:function(res){console.log(res)}, fail: function(err){console.log(err)}})

  }

  render () {
    return (
      <View className='index'>
        <View className="index-operation">
          {
            this.state.identifyList.length ? (
              <Picker onChange={this.pickerChangeHandler} value={this.state.currentPick} range-key="name" range={this.state.identifyList}>
                <View className="picker">
                  选择识别类型：{this.state.identifyList[this.state.currentPick].name}
                </View>
              </Picker>
            ) : null
          }
          <Button onClick={this.takePhoto}>获取照片</Button>
          <Button onClick={this.identifyPhoto}>开始识别</Button>
        </View>
        <View onClick={this.previewImage}>图片（点击预览）</View>
        <Image style="width: 100px;height: 100px;" src={this.state.imageSrc} onClick={this.previewImage}></Image>
        <View className="result">
          <View>识别结果</View>
          {
            this.state.resultList.map((item, index) => {
              return <View key={index}>{item.itemstring}</View>
            })
          }
        </View>
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

export default Index as ComponentClass<PageOwnProps, PageState>
