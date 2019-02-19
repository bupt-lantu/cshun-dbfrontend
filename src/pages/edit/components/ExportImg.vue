<template>
    <v-app>
        <v-content>
            <v-toolbar
                color="teal"
                dense
                fixed
                clipped-left
                app
            >
            <v-layout align-center justify-center>
                <v-spacer></v-spacer>
                <v-btn
                    @click="goBack();"
                    flat
                >
                    <span class="title" style="color:white">返回编辑</span>
                </v-btn>
                <v-divider
                    class="mx-3"
                    vertical
                ></v-divider>
                <v-btn
                    @click="exportImg();"
                    flat
                >
                    <span class="title" style="color:white">确认导出</span>
                </v-btn>
                <v-spacer></v-spacer>
            </v-layout>
            </v-toolbar>
            <div id="cvsdiv" style="overflow-x:auto">
                <canvas id="e"></canvas>
            </div>
        </v-content>
    </v-app>
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
    },
    goBack()
    {
        sessionStorage.removeItem("savePack");
        this.$router.go(-1);
    }
  },
  watch:{
  },
  mounted()
  {
        document.getElementById('cvsdiv').width = document.body.clientWidth;
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

