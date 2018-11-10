## 注意事项
* new vCanvas(siz,savepack=null,mapprop=null) siz={x:,y:}为canvas大小，savepack为之前的存档，mapprop为地图属性
* 向canvas中add务必使用vCanvas的add(obj)方法，不要直接在canvas上添加，否则移动地图时坐标无法更新
* 存档时vCanvas的save()方法会返回存档