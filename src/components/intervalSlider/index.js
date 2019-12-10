import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import './index.scss'

export default class IntervalSlider extends Component {
  static defaultProps = {
    min: 0,  // 最小值
    max: 100, // 最大值
    minValue: 0, // 当前最小值
    maxValue: 100, // 当前最大值
    bgColor: '#eee', // 背景色
    selectedColor: '#0084FE', // 选中色
    marksArr: [], // 标记列表，不传此参则是普通的slider，该参数用来实现标记效果。
  }

  // 标记数组格式示例
  // marksArr = [{
  //   position: 0, // 必传参数，用来设置标记的位置，取值范围0-100
  //   label: '0元' //  理论必传参数，标记所在位置显示的值，不传则显示val值
  //   ... //  其他参数可选，因为会将目前圆点所处的标记的对应的对象emit出去，值由使用者决定
  // },  {
  //   position: 100,
  //   label: '1000元'
  // }]

  constructor(props) {
    super(props)
    this.state = {
      leftPos: 0,
      rightPos: 100,
    }
  }

  componentDidMount() {
    const query = Taro.createSelectorQuery().in(this.$scope)
    query
      .select('.slider-container')
      .boundingClientRect(rect => {
        this.containerLeft = rect.left
        this.containerRight = rect.right
        this.totalLength = rect.width

        this.initSlider()
      })
      .exec()
  }

  initSlider() {
    const { minValue, maxValue, min, max, marksArr } = this.props
    const allLen = max - min

    let leftPos = Math.round(minValue / allLen * 100)
    let rightPos = Math.round(maxValue / allLen * 100)

    this.allLen = allLen

    if (marksArr.length) {
      leftPos = this.setNearNum(leftPos)
      rightPos = this.setNearNum(rightPos)
    }

    this.setState({
      leftPos,
      rightPos
    })
  }

  // 设置相近的值
  setNearNum(num) {
    const arr = this.state.marksArr.map(item => item.position)
    return this.getNearNum(arr, num)
  }

  // 获取数组中最接近目标值的值
  getNearNum(arr, num) {
    return arr.sort((a, b) => {
      return Math.abs(a - num) - Math.abs(b - num);
    })[0]
  }

  onMinStart() {
    this.cacheRightPos = this.state.rightPos
  }

  onMaxStart() {
    this.cacheLeftPos = this.state.leftPos
  }

  onMinMove(e) {
    this.setPositionVal(e, positionVal => {
      this.commonMinDeal(positionVal)
    })
  }

  onMaxMove(e) {
    this.setPositionVal(e, positionVal => {
      this.commonMaxDeal(positionVal)
    })
  }

  onMinEnd(e) {
    this.commonEndDeal(e, positionVal => {
      this.commonMinDeal(positionVal)
      this.emitVal()
    })
  }

  onMaxEnd(e) {
    this.commonEndDeal(e, positionVal => {
      this.commonMaxDeal(positionVal)
      this.emitVal()
    })
  }

  // 通用处理最小值的计算
  commonMinDeal(positionVal) {
    const { cacheRightPos } = this

    // 如果当前移动位置比当前最大位置大时交换移动位置
    if (positionVal < cacheRightPos) {      
      this.setState({
        leftPos: positionVal
      })
    } else {
      this.setState({
        leftPos: cacheRightPos,
        rightPos: positionVal
      })
    }
  }

  // 通用处理最大值的计算
  commonMaxDeal(positionVal) {
    const { cacheLeftPos } = this

    // 如果当前移动位置比当前最小值小时，交换移动位置
    if (positionVal <= cacheLeftPos) {
      this.setState({
        leftPos: positionVal,
        rightPos: cacheLeftPos
      })
    } else {
      this.setState({
        rightPos: positionVal
      })
    }
  }

  // 通用处理滑动结束
  commonEndDeal(e, fn) {
    this.setPositionVal(e, positionVal => {
      if (this.state.marksArr.length) positionVal = this.setNearNum(positionVal) // 这一段只能放在这里，如果放在move函数中会导致圆点不能跟随手指移动
      fn && fn(positionVal)
    })
  }

  // 获取位置
  setPositionVal(e, fn) {
    e.stopPropagation()
    const { containerLeft, containerRight, totalLength } = this
    const { pageX } = e.changedTouches[0]
    let positionVal
    if (pageX < containerLeft) {
      positionVal = 0
    } else if (pageX > containerRight) {
      positionVal = 100
    } else {
      positionVal = Math.round((pageX - containerLeft) / totalLength * 100)
    }

    fn && fn(positionVal)
  }

  // 将数据传递出去
  emitVal() {
    const t = setTimeout(() => {
      const { allLen } = this
      const { leftPos, rightPos } = this.state
      let minValue = leftPos * allLen / 100
      let maxValue = rightPos * allLen / 100

      const { marksArr } = this.state
      if (marksArr.length) {
        const minData = this.getMarkData(leftPos)
        const maxData = this.getMarkData(rightPos)
        this.props.onChange({
          minValue,
          maxValue,
          minData,
          maxData
        })
      } else {
        this.props.onChange({
          minValue,
          maxValue
        })
      }

      clearTimeout(t)
    }, 0);
  }

  // 获取位置对应mark数据
  getMarkData(val) {
    const { marksArr } = this.state
    return marksArr.filter(item => item.position === val)[0]
  }

  render() {
    const { leftPos, rightPos } = this.state
    const { bgColor, selectedColor, marksArr } = this.props

    const SliderSteps = marksArr.map(item => {
      const activeColor = leftPos == item.position || rightPos == item.position ? selectedColor : ''
      const finalLabel = item.label || item.position
      return (
        <View
          className='step-item'
          style={`left: ${item.position}%; color: ${activeColor};`}
          key={item.position}
        >
          <Text>{finalLabel}</Text>
          <View
            className='line'
            style={`background: ${activeColor}`}
          ></View>
        </View>
      )
    })

    return (
      <View className='slider-container'>
        {marksArr.length && <View className='slider-step'>
          {SliderSteps}
        </View>}
        <View className='slider-body'>
          <View
            className='silder-item'
            onTouchStart={this.onMinStart.bind(this)}
            onTouchMove={this.onMinMove.bind(this)}
            onTouchEnd={this.onMinEnd.bind(this)}
            style={`left: ${leftPos}%; border-color: ${selectedColor}`}
          ></View>
          <View
            className='silder-item'
            onTouchStart={this.onMaxStart.bind(this)}
            onTouchMove={this.onMaxMove.bind(this)}
            onTouchEnd={this.onMaxEnd.bind(this)}
            style={`left: ${rightPos}%; border-color: ${selectedColor}`}
          ></View>
          <View
            className='slider-line not-choose'
            style={`background: ${bgColor}`}
          ></View>
          <View
            className='slider-line selected'
            style={`left: ${leftPos}%; width: ${rightPos - leftPos}%; background: ${selectedColor}`}
          ></View>
        </View>
      </View>
    )
  }
}