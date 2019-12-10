# taro-slider
基于taro开发的双向滑动slider，可用于区间选择

< img  src = “ https://fileserver.paat.com/2da/2daf73c15f599f37da1d28cd43971576.png ”  宽度 = “ 376”  高度 = “ 813” >
<br><br>
### 引入
```
import IntervalSlider from '../../components/intervalSlider'
```

### 使用
无标记的
```
<IntervalSlider
  maxValue={87}
  minValue={0}
  max={200}
  selectedColor='red'
  onChange={this.onChange.bind(this)}
/>
```

有标记的
```
<IntervalSlider
  marksArr={marksArr}
  maxValue={87}
  minValue={0}
  max={200}
  selectedColor='green'
  onChange={this.onChange.bind(this)}
/>

// marksArr 结构
[{
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
```

###参数说明
```
min: Number 最小值
max: Number 最大值
minValue: Number 当前最小值
maxValue: Number 当前最大值
bgColor: String 背景色
selectedColor: String 选中色
marksArr: Array 标记列表，不传此参则是普通的slider，该参数用来实现标记效果。
```