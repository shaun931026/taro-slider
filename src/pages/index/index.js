import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import IntervalSlider from '../../components/intervalSlider'
import './index.scss'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  constructor(props) {
    super(props)
    this.state = {
      marksArr: [{
        position: 0,
        label: '0元'
      }, {
        position: 25,
        label: '250元'
      }, {
        position: 50,
        label: '500元'
      }, {
        position: 75,
        label: '750元'
      }, {
        position: 100,
        label: '1000元'
      }]
    }
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onChange(data) {
    Taro.showToast({
      icon: 'none',
      title: `${data.minValue} - ${data.maxValue}`
    })
  }

  render() {
    const { marksArr } = this.state
    return (
      <View className='wrap'>
        <View className='item'>
          <IntervalSlider
            marksArr={marksArr}
            maxValue={87}
            minValue={20}
            max={200}
            selectedColor='green'
            onChange={this.onChange.bind(this)}
          />
        </View>
        <View className='item'>
          <IntervalSlider
            maxValue={87}
            minValue={20}
            max={200}
            selectedColor='red'
            onChange={this.onChange.bind(this)}
          />
        </View>
      </View>
    )
  }
}
