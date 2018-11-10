## 注意事项
* new vCanvas(siz,savepack=null,mapprop=null) siz={x:,y:}为canvas大小，savepack为之前的存档，mapprop为地图属性
* 向canvas中add务必使用vCanvas的add(obj)方法，不要直接在canvas上添加，否则移动地图时坐标无法更新
* 向canvas中添加SVG务必使用addSVG(obj,id)方法，id不能为0
* 初始化canvas中的SVG时不改变外部状态
* 存档时vCanvas的saveToServer方法会触发saveToServer事件

## 事件
* 添加SVG：'addSVG', detail:{id:} id表示已加入canvas的id 
* 移除SVG：'removeSVG', detail:{id:} id表示已从canvas移除的id
* 保存：'saveToServer', detail:{savePack:} savePack为存档的字符串