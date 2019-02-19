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
                <v-btn color="green darken-3" id = "uploadMap">
                    <span style="color:white">上传图片</span>
                    <form>
                        <input type="file" id = "upMap" @change = "uploadMap($event);"/>
                    </form>
                </v-btn>
                <v-btn color="green darken-3" @click = "clearMap();">
                    <span style="color:white">清除地图</span>
                </v-btn>
                <v-btn color="green darken-3" @click = "confirmMap();">
                    <span style="color:white">确认</span>
                </v-btn>
                <v-btn color="green darken-3" @click = "dismiss();">
                    <span style="color:white">取消</span>
                </v-btn>
                <v-spacer></v-spacer>
            </v-layout>
            </v-toolbar>
            <v-layout 
                justify-center
                align-space-around
            >
                <canvas id="f"></canvas>
            </v-layout>
        </v-content>
    </v-app>
</template>

<script>
import  vCanvas  from './cvs/vCanvas.js';

var importCvs;
export default {
  name: 'ImportImg',
  props: ['savePack'],
  methods:{
    clearMap()
    {
      importCvs.setMap(null);
    },
    uploadMap(e)
    { 
      if(!e.target.files[0]) return;
      let imgfile = e.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(imgfile[0]);
      reader.onload = (e)=>{
        if(e){importCvs.setMap(e.target.result);}
      }
    },
    confirmMap()
    {
      importCvs.changeStateTo("move");
      let savePack = importCvs.saveToOuter();
      sessionStorage.setItem("historyStack",JSON.stringify(importCvs.history));
      sessionStorage.setItem("savePack",savePack);
      this.$router.go(-1);
    },
    dismiss()
    {
      this.$router.go(-1);
    }
  },
  watch:{
  },
  mounted()
  {
      let wZoom = 1.0,hZoom = 1.0;
      window.addEventListener('resize',function(){
          let width = Math.round(document.body.clientWidth*wZoom);
          let height = Math.round((document.body.clientHeight)*hZoom);
          document.getElementById('f').width = width;
          document.getElementById('f').height = height;
          importCvs.resize({x:width,y:height});
      });
      let width = Math.round(document.body.clientWidth*wZoom);
      let height = Math.round((document.body.clientHeight)*hZoom);
      document.getElementById('f').width = width;
      document.getElementById('f').height = height;
    let savePack = sessionStorage.getItem("savePack");
    importCvs = new vCanvas({x:width,y:height},'f',savePack);
    let temphistory = JSON.parse(sessionStorage.getItem("historyStack"));
    importCvs.history.top = temphistory.top;
    importCvs.history.historyStack = temphistory.historyStack;
    importCvs.history.changedSVGid = temphistory.changedSVGid;
    importCvs.changeStateTo("setmap");
  }
}
</script>
<style type="text/css">
/*
  #uploadMap
  {
      position: absolute;left:50%;top:10px;width: 80px;height: 40px;line-height: 40px;background: #74d855;text-align: center;
      color: #FFF;padding: 0px 5px;-webkit-border-radius: 3px;border-radius: 3px;
      margin: 0 auto;
  }
  */
  #uploadMap form{width:100%;position:absolute; left:0; top:0;opacity:0; filter:alpha(opacity=0);}
  #uploadMap form input{width: 100%;}
    canvas {
        border: 1px solid black;
    }
</style>

