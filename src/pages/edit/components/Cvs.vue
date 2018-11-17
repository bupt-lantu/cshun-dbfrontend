<template>
    <v-content>
        <v-layout
            justify-space-between 
            row 
            v-if="EditBtn"
        >
            <!-- <v-btn
                v-on:click="changeStateTo('move');"
                color="brown light-1"
            >
                移动画布
            </v-btn> -->
            <v-btn
                v-on:click="changeStateTo('editvert');"
                color="brown light-1"
            >
                选择 | 移动对象
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
                    label="线条形状"
                    color ='brown light-1'
                ></v-select>
            </v-flex>
            <v-flex md1>
                <v-select
                    :items="lineColorOptions"
                    label="线条颜色"
                    color ='brown light-1'
                ></v-select>
            </v-flex>
            <v-flex md1>
                <v-select
                    :items="lineWidthOptions"
                    label="线条宽度"
                    color ='brown light-1'
                ></v-select>
            </v-flex>
            <v-flex md1>
                <v-select
                    :items="lineColorOptions"
                    label="边缘颜色"
                    color ='brown light-1'
                ></v-select>
            </v-flex>
            <v-flex md1>
                <v-select
                    :items="lineWidthOptions"
                    label="边缘宽度"
                    color ='brown light-1'
                ></v-select>
            </v-flex>
            <v-btn
                v-on:click="undo();"
                color="blue-grey lighten-1"
            >
                <v-icon>undo</v-icon>
            </v-btn>
            <v-btn
                v-on:click="redo();"
                color="blue-grey lighten-1"
            >
                <v-icon>redo</v-icon>
            </v-btn>
            <v-btn
                v-on:click="save();"
                color="green lighten-1"
            >
                保存
            </v-btn>
            <v-btn
                v-on:click="exportImg();"
                color="green lighten-1"
            >
            导出图片
            </v-btn>
        </v-layout>
    <v-layout 
        justify-center
        align-space-around
        @dragover="dragOver($event)" @drop="dragFinished($event)"
    >
        <canvas id="c" ref="canvas"></canvas>
    </v-layout>
    </v-content>
</template>

<script>
import  vCanvas  from './cvs/vCanvas.js';
import {bus} from '../../../bus.js'
var cvs;
export default {
  name: 'Cvs',
  props: ['EditBtn'],
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
        }
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
    exportImg()
    {
        let savePack = cvs.save(0,false);  
        let routeData = this.$router.resolve({ name: 'exportImg'});
        sessionStorage.setItem("savePack",savePack);
        let wd = window.open(routeData.href,'_blank');
    }
  },
  watch:{
      EditBtn: function()
      {
          if(!this.EditBtn){cvs.changeStateTo("move");}
      },
      lineProp: function(val)
      {
          console.log(val);
          setLineProp(val);
      }
  },
  mounted()
  {
      let wZoom = 0.9,hZoom = 0.9;
      window.addEventListener('resize',function(event){
          let width = Math.round(document.body.clientWidth*wZoom);
          let height = Math.round((document.body.clientHeight-40)*hZoom);
          document.getElementById('c').width = width;
          document.getElementById('c').height = height;
          cvs.resize({x:width,y:height});
      });
      let width = Math.round(document.body.clientWidth*wZoom);
      let height = Math.round((document.body.clientHeight-40)*hZoom);
      document.getElementById('c').width = width;
      document.getElementById('c').height = height;
      cvs = new vCanvas({x:width,y:height},'c');
      window.addEventListener('addSVG',function(event){
          bus.$emit('showP',event.detail.id);
      });
      window.addEventListener('removeSVG',function(event){
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

