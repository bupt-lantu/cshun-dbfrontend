<template>
  <v-content>
    <v-alert
      v-model="alert"
      dismissible
      color="success"
      icon="check_circle"
      outline
    >
      保存成功！
    </v-alert>
    <v-navigation-drawer
      v-model="rdrawer"
      right
      temporary
      fixed
    >
    </v-navigation-drawer>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      app
    >
      <v-list dense>
        <span class="info-title">村户详细信息</span>
        <!-- <v-icon color="grey darken-1" style="margin-left:60px">add</v-icon> -->
        <v-tooltip right>
          <v-btn
            slot="activator"
            icon 
            @click="rdrawer = !rdrawer"
            style="margin-left:100px"
          >
            <v-icon>apps</v-icon>
          </v-btn>
          <span>查看统计信息</span>
        </v-tooltip>
        <v-text-field
          :append-icon-cb="() => {}"
          placeholder="村户查询..."
          single-line
          clearable
          append-icon="search"
          hide-details
          style="margin-left:15px; margin-right:15px"
        ></v-text-field>
        <v-list>
          <v-list-tile v-for="(item,index) in villagers" :key="item.name" v-show="!item.isInCanvas" avatar>
            <v-list-tile-action :id="item._id" draggable="true" @dragstart="dragStart($event)" @drag="drag($event)" @dragend="dragEnd($event)">
              <template v-if="(index-'0')%6==0">
                <svg width="180" height="100%" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="100" height="36" 
                    style="fill:green;stroke:blue;
                    stroke-width:5;opacity:0.5"
                  ></rect>
                  <text x="45" y="30">
                    {{ index-'0'+1 }}
                  </text>
                </svg>
              </template>
              <template v-else-if="(index-'0')%6==1" flat>
                <svg width="180" height="100%" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="100" height="36" 
                    style="fill:green;stroke:blue;
                    stroke-width:5;opacity:0.5"
                  ></rect>
                  <text x="45" y="30">
                    {{ index-'0'+1 }}
                  </text>
                </svg>
              </template>
              <template v-else-if="(index-'0')%6==2">
                <svg width="180" height="100%" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="100" height="36" 
                    style="fill:yellow;stroke:black;
                    stroke-width:5;opacity:0.5"
                  ></rect>
                  <text x="45" y="30">
                    {{ index-'0'+1 }}
                  </text>
                </svg>
              </template>
              <template v-else-if="(index-'0')%6==3">
                <svg width="180" height="100%" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="100" height="36" 
                    style="fill:orange;stroke:brown;
                    stroke-width:5;opacity:0.5"
                  ></rect>
                  <text x="45" y="30">
                    {{ index-'0'+1 }}
                  </text>
                </svg>
              </template>
              <template v-else-if="(index-'0')%6==4">
                <svg width="180" height="100%" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="100" height="36" 
                    style="fill:red;stroke:brown;
                    stroke-width:5;opacity:0.5"
                  ></rect>
                  <text x="45" y="30">
                    {{ index-'0'+1 }}
                  </text>
                </svg>
              </template>
              <template v-else-if="(index-'0')%6==5">
                <svg width="180" height="100%" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="100" height="36" 
                    style="fill:#8BC34A;stroke:brown;
                    stroke-width:5;opacity:0.5"
                  ></rect>
                  <text x="45" y="30">
                    {{ index-'0'+1 }}
                  </text>
                </svg>
              </template>
            </v-list-tile-action>
            <v-spacer></v-spacer>
            <!-- <v-list-tile-title v-text="item.name"></v-list-tile-title> -->
            <v-list-tile-title>
              {{"&emsp;&emsp;&emsp;"+item.name}}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      dense
      fixed
      clipped-left
      app
      :color="color"
    >
      <!-- <v-toolbar-side-icon>
        <v-icon style="color:white" @click="goBackToSelect">arrow_back</v-icon>
      </v-toolbar-side-icon> -->
      <v-tooltip bottom>
        <v-btn
          slot="activator"
          icon
          @click="goBackToSelect"
        >
          <v-icon style="color:white">arrow_back</v-icon>
        </v-btn>
        <span>返回选择页</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          slot="activator"
          icon
          @click.stop="drawer = !drawer"
        >
          <v-icon v-if="drawer" large style="color:white">keyboard_arrow_up</v-icon>
          <v-icon v-else large style="color:white">keyboard_arrow_down</v-icon>
        </v-btn>
        <span>查看村户信息</span>
      </v-tooltip>
      <span class="title" style="color:white">长顺脱贫攻坚可视化数据库</span>
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">
         <span class="grey--text text--lighten-2 px-0 mx-0">{{currentTown}}/</span>
         <span class="grey--text text--lighten-3 px-0 mx-0">{{currentBigvillage}}/</span>
         <span class="grey--text text--lighten-4 px-0 mx-0" style="font-weight:bold">{{currentVillageName}}</span>
        </span>
      </v-toolbar-title>
      <v-layout column wrap>
        <v-flex xs12 md5 offset-md7>
          <v-btn 
            flat
            @click="ChangeEditState()"
          >
            <span v-if="tool" class="title" style="color:white">浏览</span>
            <span v-else class="title" style="color:white">编辑</span>
          </v-btn>
          <v-btn 
            flat
            @click = "changeUpdState()"  
          >
            <span class="title" style="color:white">导入</span>
          </v-btn>
          <v-btn
            flat
            @click="ExportImg()"
          >
            <span class="title" style="color:white">导出</span>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-toolbar>
    <v-layout v-if="updMap" row align-center style="max-width: 650px">
      <v-btn id = "uploadMap">
        <p>上传图片</p>
        <form>
          <input type="file" id = "upMap" @change = "uploadMap($event);"/>
        </form>
      </v-btn>
      <v-btn color="blue-grey" @click = "clearMap();">
        清除地图
      </v-btn>
      <v-btn color="blue-grey" @click = "confirmMap();">
        确认
      </v-btn>
    </v-layout>
    <!-- <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      app
    >
      <v-list dense></v-list>
    </v-navigation-drawer> -->
  </v-content>
</template>

<script>
import {bus} from '../../../bus.js'
import { mapGetters } from 'vuex'
import { throws } from 'assert';
// import vCanvas  from './cvs/vCanvas.js';
// import cvs from '../Cvs'
export default {
  name: 'VillagerList',
  data: () => ({
    alert:false, 
    tool: false,
    drawer: false,
    rdrawer: false,
    updMap: false,
    items: [
    { icon: 'arrow_back' },
    ],
    // items2: [
    // { id: 1, text: '老张' ,isInCanvas:false},
    // { id: 2, text: '老赵' ,isInCanvas:false},
    // { id: 3, text: '老李' ,isInCanvas:false}
    // ],
    loader: null,
    loading: false,
    loading2: false,
    loading3: false,
    loading4: false
  }),
  computed:{
    ...mapGetters([
      'villagers',
      'currentVillageName',
      // 'currentTown',
      // 'currentBigvillage'
    ]),
    currentTown(){
      return sessionStorage.getItem('CT');
    },
    currentBigvillage(){
      return sessionStorage.getItem('CB');
    },
    color () {
      if(this.tool){
        return '#917369'
      }
      else{
        return 'teal'
      }
    }
  },
  props: {
    source: String,
    villageId:String
  },
  methods:{
    clearMap()
    {
      bus.$emit('uploadMap',null);
      this.changeUpdState();
    },
    uploadMap(e)
    { 
      if(!e.target.files[0]) return;
      let imgfile = e.target.files;
      let reader = new FileReader();
      reader.readAsDataURL(imgfile[0]);
      reader.onload = (e)=>{
        if(e){bus.$emit('uploadMap',e.target.result);}
      }
    },
    confirmMap()
    {
      this.changeUpdState();
    },
    changeUpdState()
    {
      this.updMap^=1;
      bus.$emit('changeUpdState',this.updMap);
    },
    goBackToSelect(){
      this.$router.push({ name: 'select'});
    },
    dragStart(event){
        event.dataTransfer.setData("text/plain", event.target.id);
    },
    ChangeEditState(){
      this.tool = !this.tool;
      console.log("tool:"+this.tool);
      this.$emit('CES');
    },
    ExportImg()
    {
      // let exportImgEvent bus.$emit('save',event.detail.savePack);= new Event("exportImg");
      // window.dispatchEvent(exportImgEvent);
      bus.$emit('exportImg');
    }
  },
  created(){
    bus.$on('showP',(id)=>{
        // let element=this.villagers.find((index) => index._id==id);
        // element.isInCanvas=true;
        this.$store.dispatch('updateVillager',{ id ,isIn:true });
    });
    bus.$on('removeP',(id)=>{
        // let element=this.villagers.find((index) => index._id==id);
        // element.isInCanvas=false;
        this.$store.dispatch('updateVillager',{ id, isIn:false});
    });
    bus.$on('save',(payload)=>{
        this.$store.dispatch('sentCanvas',payload);
        this.$store.dispatch('updateVillagerAll');
        this.alert=true;
    });
  },

  watch: {
      loader () {
        const l = this.loader
        this[l] = !this[l]

        setTimeout(() => (this[l] = false), 3000)

        this.loader = null
      }
    }
}
</script>

<style>
  #uploadMap
  {
      position: absolute;left:50%;top:10px;width: 80px;height: 40px;line-height: 40px;background: #74d855;text-align: center;
      color: #FFF;padding: 0px 5px;-webkit-border-radius: 3px;border-radius: 3px;
      margin: 0 auto;
  }
  #uploadMap form{width:100%;position:absolute; left:0; top:0;opacity:0; filter:alpha(opacity=0);}
  #uploadMap form input{width: 100%;}

  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .info-title {
    display: inline-block;
    font-size: 20px;
    margin-left: 15px;
    margin-top: 10px;
  }
</style>
