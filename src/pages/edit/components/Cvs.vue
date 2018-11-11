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
                v-on:click="changeStateTo('connect');"
                color="brown light-1"
            >
                连接
            </v-btn>
            <v-btn
                v-on:click="changeStateTo('remove');"
                color="brown light-1"
            >
                移除
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
    <v-layout justify-center @dragover="dragOver($event)" @drop="dragFinished($event)">
        <canvas id="c" width=1500 height=750 ref="canvas"></canvas>
    </v-layout>
    </v-content>
</template>

<script>
import  vCanvas  from './cvs/vCanvas.js';
import {bus} from '../../../bus.js'
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
    getScrollTop(){
        let scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
          scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
          scrollTop = document.body.scrollTop;
        }
        return scrollTop;
      },

   canvasMousePos(canvas, event){
        let x = (document.documentElement.scrollLeft || document.body.scrollLeft) + (event.clientX || event.pageX);
        let y = (event.clientY || event.pageY) + this.getScrollTop();
        return {
          x: x - cvs.canvas._offset.left,
          y: y - cvs.canvas._offset.top
        }
    },

   dragOver(event){
        event.preventDefault();
    },

  dragFinished(event){
    event.preventDefault();
    let p=this.canvasMousePos(this.$refs.canvas,event);
    let id = event.dataTransfer.getData("text");
    let div=document.getElementById(id);
    let svg_xml=new XMLSerializer().serializeToString(div.childNodes[0]).toString();
    /*
    fabric.loadSVGFromString(svg_xml, function(objects, options) {
          let obj = fabric.util.groupSVGElements(objects, options);
          obj.set({
            left:p.x,
            top:p.y,
          });
      bus.$emit('showP',id);
      */
      cvs.createSVG(svg_xml,p,id);
      bus.$emit('showP',id);
      //});
  },
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
      window.addEventListener('addSVG',function(event){
          console.log(event.detail);
          bus.$emit('showP',event.detail.id);
      });
      window.addEventListener('removeSVG',function(event){
          console.log(event.detail);
          bus.$emit('removeP',event.detail.id);
      });
  }
}
</script>
<style type="text/css">
    canvas {
        border: 1px solid black;
    }
</style>

