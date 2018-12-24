import {
  ADD,
  MINUS,
  GET_GENERATOR,
  GET_GENERATOR_SUCCESS,
  GET_GENERATOR_FAIL,
  GET_IDENTIFYCARD,
  GET_IDENTIFYCARD_SUCCESS,
  GET_IDENTIFYCARD_FAIL,
  GET_BANKCARD,
  GET_BANKCARD_SUCCESS,
  GET_BANKCARD_FAIL
} from '../constants/counter'

export const add = () => {
  return {
    type: ADD
  }
}
export const minus = () => {
  return {
    type: MINUS
  }
}

// 异步的action
export function asyncAdd () {
  return dispatch => {
    setTimeout(() => {
      dispatch(add())
    }, 2000)
  }
}

//正常文字识别
export function getGenerateInfo(data) {
  return {
    'api': {
      types: [GET_GENERATOR,
        GET_GENERATOR_SUCCESS,
        GET_GENERATOR_FAIL]
      url: '/ocrapi/generalocr',
      method: 'POST',
      data: {
        image: data
      }
    }
  }
}

//身份证信息识别
export function getIdentifyCardInfo(data) {
  return {
    'api': {
      types: [GET_IDENTIFYCARD,
        GET_IDENTIFYCARD_SUCCESS,
        GET_IDENTIFYCARD_FAIL],
      url: '/ocrapi/idcardocr',
      method: 'POST',
      data: {
        image: data,
        card_type: 0
      }
    }
  }
}

//银行卡信息识别
export function getBankCardInfo(data) {
  return {
    'api': {
      types: [],
      url: '/ocrapi/creditcardocr',
      method: 'POST',
      data: {
        image: data
      }
    }
  }
}

export function getYTInfo() {
  
}
