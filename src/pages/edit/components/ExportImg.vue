<template>
    <v-content>
        预览
        <v-btn
            v-on:click="exportImg();"
            color="brown light-1"
        >
        导出图片
        </v-btn>
        <canvas id="e"></canvas>
    </v-content>
</template>

<script>
import  vCanvas  from './cvs/vCanvas.js';
import exportSupport from './cvs/exportSupport.js';

var exportCvs;
export default {
  name: 'ExportImg',
  props: ['savePack'],
  methods:{
      exportImg: function(){
          exportCvs.export();
    } 
  },
  watch:{
  },
  mounted()
  {
        let width = 2000,height = 2000;
        let savePack = sessionStorage.getItem("savePack");
        document.getElementById('e').width = width;
        document.getElementById('e').height = height;
        exportCvs = new vCanvas({x:width,y:height},'e',savePack);
        exportSupport.init();
  }
}
</script>
<style type="text/css">
    canvas {
        border: 1px solid black;
    }
</style>

