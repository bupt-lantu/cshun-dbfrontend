<template>
    <v-content>
        <v-layout justify-space-between row>
            <v-btn
                v-on:click="changeStateTo('move');"
                color="brown light-1"
            >
                移动画布
            </v-btn>
            <v-btn
                v-on:click="changeStateTo('editvert');"
                color="brown light-1"
            >
                移动控制点
            </v-btn>
            <v-btn
                v-on:click="changeStateTo('addvert');"
                color="brown light-1"
            >
                添加控制点
            </v-btn>
            <v-btn
                v-on:click="changeStateTo('connnect');"
                color="brown light-1"
            >
                连接
            </v-btn>
            <v-btn
                v-on:click="changeStateTo('delete');"
                color="brown light-1"
            >
                移除边
            </v-btn>
            <v-flex md1>
                <v-select
                    :items="linetpOptions"
                    label="选择线形"
                    color ='brown light-1'
                ></v-select>
            </v-flex>
            <v-flex md1>
                <v-select
                    :items="lineColorOptions"
                    label="选择颜色"
                    color ='brown light-1'
                ></v-select>
            </v-flex>
            <v-flex md1>
                <v-select
                    :items="lineWidthOptions"
                    label="选择线宽"
                    color ='brown light-1'
                ></v-select>
            </v-flex>
            <v-btn
                v-on:click="undo();"
                color="blue-grey lighten-1"
            >
                撤销
            </v-btn>
            <v-btn
                v-on:click="redo();"
                color="blue-grey lighten-1"
            >
                重做
            </v-btn>
            <v-btn
                v-on:click="save();"
                color="green lighten-1"
            >
                保存
            </v-btn>
        </v-layout>
    <v-layout justify-center>
        <canvas id="c" width=1100 height=450></canvas>
    </v-layout>
    
    </v-content>
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
        lineColorOptions:[
            {text: '红色', value: 'red'},
            {text: '黄色', value: 'yellow'}
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
        },
        items: [
          {
            action: 'local_activity',
            title: 'Attractions',
            items: [
              { title: 'List Item' }
            ]
          },
          {
            action: 'restaurant',
            title: 'Dining',
            // active: true,
            items: [
              { title: 'Breakfast & brunch' },
              { title: 'New American' },
              { title: 'Sushi' }
            ]
          },
        ]
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

