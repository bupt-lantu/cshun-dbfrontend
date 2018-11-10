<template>
  <div class="hello">
    <v-btn v-on:click="changeStateTo('move');"></v-btn>
    <button v-on:click="changeStateTo('move');">移动画布</button>
    <button v-on:click="changeStateTo('editvert');">移动控制点</button>
    <button v-on:click="changeStateTo('addvert');">添加控制点</button>
    <button v-on:click="changeStateTo('connect');">连接</button>
    <button v-on:click="changeStateTo('delete');">移除边</button>
    <button v-on:click="undo();">撤销</button>
    <button v-on:click="redo();">重做</button>
    <button v-on:click="save();">保存</button>
    <br/>
    <span>
        线形
        <select v-model="lineProp.linetp">
            <option v-for="option in linetpOptions" v-bind:value="option.value">
                {{option.text}}
            </option>
        </select>
        颜色
        <input v-model="lineProp.lineColor">
        线条粗细
        <select v-model="lineProp.lineWidth">
            <option v-for="option in lineWidthOptions" v-bind:value="option.value">
                {{option.text}}
            </option>
        </select>
    </span>
    <br />
    <canvas id="c" width="1000" height="1000"></canvas>
  </div>
</template>

<script>
import  vCanvas  from './cvs/vCanvas.js';
var cvs;
export default {
  name: 'Cvs',
  data () {
    return {
        linetpOptions:[
            {text: '曲线', value: 'curve'},
            {text: '直线', value: 'line'}
        ],
        lineWidthOptions:[
            {text: '1px', value: 1},
            {text: '2px', value: 2},
            {text: '3px', value: 3},
            {text: '4px', value: 4},
            {text: '5px', value: 5},
            {text: '6px', value: 6},
            {text: '7px', value: 7},
            {text: '8px', value: 8},
            {text: '9px', value: 9},
        ],
        lineProp:{
            linetp: "curve",
            lineColor: "red",
            lineWidth: 5
        }
    }
  },
  methods:{
    changeStateTo(sta)
    {
        cvs.changeStateTo(sta);
    },
    undo()
    {
        cvs.undo();
    },
    redo()
    {
        cvs.redo();
    },
    save()
    {
        cvs.saveToServer();
    },
  },
  watch:{
      lineProp: function(val)
      {
          console.log(val);
          setLineProp(val);
      }
  },
  mounted()
  {
      cvs = new vCanvas({x:1000,y:1000});
  }
}
</script>
<style type="text/css">
    canvas {
        border: 1px solid black;
    }
</style>

