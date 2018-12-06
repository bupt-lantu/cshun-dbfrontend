<template>
  <v-content>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      app
    >
      <v-list dense>
        <v-list-tile v-for="item in items" :key="item.text" @click="goBackToSelect">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-subheader class="mt-3 grey--text text--darken-1">
          村户详细信息
        </v-subheader>
        <v-list>
          <v-list-tile v-for="(item,index) in villagers" :key="item.name" v-show="!item.isInCanvas" avatar>
            <v-list-tile-action :id="item._id" draggable="true" @dragstart="dragStart($event)" @drag="drag($event)" @dragend="dragEnd($event)">
              <template v-if="index-'0'==0">
                <svg width="100%" height="100%" version="1.1"
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
              <template v-if="index-'0'==1">
                <svg width="100%" height="100%" version="1.1"
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
              <template v-else-if="index-'0'==2">
                <svg width="100%" height="100%" version="1.1"
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
              <template v-else-if="index-'0'==3">
                <svg width="100%" height="100%" version="1.1"
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
              <template v-else-if="index-'0'==4">
                <svg width="100%" height="100%" version="1.1"
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
              <template v-else-if="index-'0'==5">
                <svg width="100%" height="100%" version="1.1"
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
            <v-list-tile-title v-text="item.name"></v-list-tile-title>
          </v-list-tile>
        </v-list>
        <v-list-tile class="mt-3">
          <v-list-tile-action>
            <v-icon color="grey darken-1">add_circle_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">
            添加村户
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon color="grey darken-1">settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">
            修改村户信息
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="teal"
      dense
      fixed
      clipped-left
      app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer">
        <v-icon v-if="drawer" large>keyboard_arrow_up</v-icon>
        <v-icon v-else large>keyboard_arrow_down</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">可视化数据库编辑页</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout row align-center style="max-width: 650px">
        <v-text-field
          :append-icon-cb="() => {}"
          placeholder="村户查询..."
          single-line
          append-icon="search"
          color="white"
          hide-details
        ></v-text-field>
        <v-btn 
          color="blue-grey"
          @click="ChangeEditState()"
        >
          <span v-if="tool">退出编辑</span>
          <span v-else>编辑模式</span>
        </v-btn>
        <v-btn 
          color="lime darken-1"
          :loading="loading"
          :disabled="loading"
          @click.native="loader = 'loading'"
        >导出数据</v-btn>
        <v-btn
          color="light-green"
          @click="ExportImg()"
        >导出长图</v-btn>
      </v-layout>
    </v-toolbar>
  </v-content>
</template>

<script>
import {bus} from '../../../bus.js'
import { mapGetters } from 'vuex'
// import vCanvas  from './cvs/vCanvas.js';
// import cvs from '../Cvs'
export default {
  name: 'VillagerList',
  data: () => ({
    tool: false,
    drawer: false,
    items: [
    { icon: 'arrow_back', text: '返回地点选择' },
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
    ]),
  },
  props: {
    source: String,
    villageId:String
  },
  methods:{
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
      let exportImgEvent = new Event("exportImg");
      window.dispatchEvent(exportImgEvent);
    }
  },
  created(){
    this.$store.dispatch('getVillagers');
  },
  mounted(){
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
</style>
