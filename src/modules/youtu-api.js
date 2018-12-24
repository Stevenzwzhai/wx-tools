import wxCloud from './cloud-api'

export default function youtu(data){
  return wxCloud('youtu', Object.assign({}, {type: data.type}, data.data), data.success, data.fail)
}