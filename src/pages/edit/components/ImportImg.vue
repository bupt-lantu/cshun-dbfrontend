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
                 <v-btn flat id = "uploadMap">
                    <span class="title" style="color:white">上传图片</span>
                    <form>
                        <input type="file" id = "upMap" @change = "uploadMap($event);"/>
                    </form>
                </v-btn>
                <v-divider
                    class="mx-3"
                    vertical
                ></v-divider>
                <v-btn flat @click = "clearMap();">
                    <span class="title" style="color:white">清除地图</span>
                </v-btn>
                <v-divider
                    class="mx-3"
                    vertical
                ></v-divider>
                <v-btn flat @click = "confirmMap();">
                    <span class="title" style="color:white">确认</span>
                </v-btn>
                <v-divider
                    class="mx-3"
                    vertical
                ></v-divider>
                <v-btn flat @click = "dismiss();">
                    <span class="title" style="color:white">取消</span>
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
      importCvs.setMap(null,2048,2048);
    },
    uploadMap(e)
    { 
      if(!e.target.files[0]) return;
      let imgfile = e.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(imgfile[0]);
      reader.onload = (e)=>{
        //if(e){importCvs.setMap(e.target.result);}
        if(e){this.compressMap(e.target.result,importCvs.setMap.bind(importCvs));}
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
    },
    compressMap(src,callbk)
    {
      let img = new Image();
      img.src = src;
      img.onload = function(){
        let that = this;
        let w = this.width, h = this.height;
        let canvast = document.createElement('canvas');
        let ctx = canvast.getContext('2d');
        let scale = Math.min(1,2048/Math.max(w,h));
        let minw = Math.floor(scale*w),minh = Math.floor(scale*h);
        //console.log(w,h,minw,minh);
        this.width = minw, this.height = minh;
        canvast.width = minw, canvast.height = minh;
        ctx.drawImage(that,0,0,minw,minh);
        canvast
        var ret = canvast.toDataURL('image/jpeg',0.75);
        callbk(ret,minw,minh);
      }
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

