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
          <v-list-tile v-for="item in items2" :key="item.text" v-show="!item.isInCanvas" avatar>
            <!-- <v-list-tile-action>
              <v-icon color="grey darken-1">add_circle_outline</v-icon>
            </v-list-tile-action> -->
            <v-list-tile-action :id="item.id" draggable="true" @dragstart="dragStart($event)" @drag="drag($event)" @dragend="dragEnd($event)">
              <svg width="100%" height="100%" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="6" rx="2" ry="2" width="100" height="36" 
                  style="fill:orange;stroke:brown;
                  stroke-width:5;opacity:0.5"
                ></rect>
                <text x="45" y="30">
                  {{item.id}}
                </text>
              </svg>
            </v-list-tile-action>
            <v-list-tile-title v-text="item.text"></v-list-tile-title>
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
          :loading="loading4"
          :disabled="loading4"
          @click.native="loader = 'loading4'"
        >
          清空
          <span slot="loader" class="custom-loader">
            <v-icon light>cached</v-icon>
          </span>
        </v-btn>
        <v-btn 
          color="lime darken-1"
          :loading="loading"
          :disabled="loading"
          @click.native="loader = 'loading'"
        >导出数据</v-btn>
        <v-btn
          color="light-green"
          :loading="loading2"
          :disabled="loading2"
          @click.native="loader = 'loading2'"
        >导出长图</v-btn>
        <v-btn
          color="cyan darken-4"
          :loading="loading3"
          :disabled="loading3"
          @click.native="loader = 'loading3'"
        > 
          保存
          <span slot="loader">正在保存中</span>
        </v-btn>
      </v-layout>
    </v-toolbar>
  </v-content>
</template>

<script>
import {bus} from '../../../bus.js'
export default {
  name: 'VillagerList',
  data: () => ({
    drawer: null,
    items: [
    { icon: 'arrow_back', text: '返回地点选择' },
    ],
    items2: [
    { id: 1, text: '张三' ,isInCanvas:false},
    { id: 2, text: '李四' ,isInCanvas:false},
    { id: 3, text: '王五' ,isInCanvas:false}
    ],
    loader: null,
    loading: false,
    loading2: false,
    loading3: false,
    loading4: false
  }),
  props: {
    source: String
  },
  methods:{
    goBackToSelect(){
      this.$router.push({ name: 'select'});
    },
    
    dragStart(event){
        event.dataTransfer.setData("text/plain", event.target.id);
    },    
  },
  mounted(){
    bus.$on('showP',(id)=>{
        let element=this.items2.find((index) => index.id==id);
        element.isInCanvas=true;
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
