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
      <v-list>
        <v-list-tile v-for="(item,index) in svgdemo" :key="item.title" avatar>
          <v-list-tile-action :id="item._id">
            <img :src="item.avatar" width="80%">
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
            <div>{{item.household+"户，"+item.people+"人，"+item.proportion+"%"}}</div>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      app
    >
      <v-list dense>
        <span class="info-title">村户信息</span>
        <!-- <v-icon color="grey darken-1" style="margin-left:60px">add</v-icon> -->
        <v-tooltip right>
          <v-btn
            slot="activator"
            icon 
            @click="rdrawer = !rdrawer"
            style="left:130px"
          >
            <v-icon>bar_chart</v-icon>
          </v-btn>
          <span>查看统计信息</span>
        </v-tooltip>
        <v-text-field
          :append-icon-cb="() => {}"
          placeholder="搜索村户"
          single-line
          clearable
          append-icon="search"
          hide-details
          style="margin-left:15px; margin-right:15px"
        ></v-text-field>
        <v-list>
          <v-list-tile v-for="(item,index) in villagers" :key="item.name" v-show="!item.isInCanvas" avatar>
            <v-list-tile-action :id="item._id" draggable="true" @dragstart="dragStart($event)" @drag="drag($event)" @dragend="dragEnd($event)">
              <svg width="100%" height="100%" version="1.1"
              xmlns="http://www.w3.org/2000/svg">
                <template v-if="item.condition=='外地常住户口未迁'">
                  <rect x="2" y="6" width="100" height="36" style="stroke:#999999;stroke-width:3;"></rect>
                </template>
                <template v-else>
                  <rect v-if="item.condition=='普通户'&&item.safeWater=='有安全饮水'" x="2" y="6" width="100" height="36" style="fill:#2F75C1;stroke:#002FF9;stroke-width:3;"></rect>
                  <rect v-else-if="outOfPoverty(item.condition)&&item.safeWater==true" x="2" y="6" width="100" height="36" style="fill:#00AE57;stroke:#002FF9;stroke-width:3;"></rect>
                  <rect v-else-if="item.condition=='一般贫困户'&&item.safeWater==true" x="2" y="6" width="100" height="36" style="fill:#FFFC3F;stroke:#002FF9;stroke-width:3;"></rect>
                  <rect v-else-if="item.condition=='低保贫困户'&&item.safeWater==true" x="2" y="6" width="100" height="36" style="fill:#FFBD2F;stroke:#002FF9;stroke-width:3;"></rect>
                  <rect v-else-if="item.condition=='五保贫困户'&&item.safeWater==true" x="2" y="6" width="100" height="36" style="fill:#FF000C;stroke:#002FF9;stroke-width:3;"></rect>
                  <rect v-else-if="item.condition=='孤儿低保户'&&item.safeWater==true" x="2" y="6" width="100" height="36" style="fill:#8ECE5B;stroke:#002FF9;stroke-width:3;"></rect>
                  <rect v-else-if="item.condition=='普通户'&&item.safeWater==false" x="2" y="6" width="100" height="36" style="fill:#2F75C1;stroke:#000000;stroke-width:3;"></rect>
                  <rect v-else-if="outOfPoverty(item.condition)&&item.safeWater==false" x="2" y="6" width="100" height="36" style="fill:#00AE57;stroke:#000000;stroke-width:3;"></rect>
                  <rect v-else-if="item.condition=='一般贫困户'&&item.safeWater==false" x="2" y="6" width="100" height="36" style="fill:#FFFC3F;stroke:#000000;stroke-width:3;"></rect>
                  <rect v-else-if="item.condition=='低保贫困户'&&item.safeWater==false" x="2" y="6" width="100" height="36" style="fill:#FFBD2F;stroke:#000000;stroke-width:3;"></rect>
                  <rect v-else-if="item.condition=='五保贫困户'&&item.safeWater==false" x="2" y="6" width="100" height="36" style="fill:#FF000C;stroke:#000000;stroke-width:3;"></rect>
                  <rect v-else-if="item.condition=='孤儿低保户'&&item.safeWater==false" x="2" y="6" width="100" height="36" style="fill:#8ECE5B;stroke:#000000;stroke-width:3;"></rect>
                  <!-- 非危房 -->
                  <template v-if="item.dilapidatedHouses==0">
                    <path d="M5 10 L 100 40" fill="transparent" stroke="brown"/>
                    <path d="M24 10 L 100 34" fill="transparent" stroke="brown"/>
                    <path d="M43 10 L 100 28" fill="transparent" stroke="brown"/>
                    <path d="M62 10 L 100 22" fill="transparent" stroke="brown"/>
                    <path d="M81 10 L 100 16" fill="transparent" stroke="brown"/>

                    <path d="M5 40 L 100 10" fill="transparent" stroke="brown"/>
                    <path d="M5 34 L 81 10" fill="transparent" stroke="brown"/>
                    <path d="M5 28 L 62 10" fill="transparent" stroke="brown"/>
                    <path d="M5 22 L 43 10" fill="transparent" stroke="brown"/>
                    <path d="M5 16 L 24 10" fill="transparent" stroke="brown"/>

                    <path d="M5 16 L 81 40" fill="transparent" stroke="brown"/>
                    <path d="M5 22 L 62 40" fill="transparent" stroke="brown"/>
                    <path d="M5 28 L 43 40" fill="transparent" stroke="brown"/>
                    <path d="M5 34 L 24 40" fill="transparent" stroke="brown"/>

                    <path d="M24 40 L 100 16" fill="transparent" stroke="brown"/>
                    <path d="M43 40 L 100 22" fill="transparent" stroke="brown"/>
                    <path d="M62 40 L 100 28" fill="transparent" stroke="brown"/>
                    <path d="M81 40 L 100 34" fill="transparent" stroke="brown"/>
                  </template>
                  <!-- 危房改造中 -->
                  <template v-else-if="item.dilapidatedHouses==1">
                    <path d="M5 20 L 100 20" fill="transparent" stroke="brown" stroke-dasharray="5,5"/>
                    <path d="M5 30 L 100 30" fill="transparent" stroke="brown" stroke-dasharray="5,5"/>
                    <path d="M35 10 L 35 40" fill="transparent" stroke="brown" stroke-dasharray="3,3"/>
                    <path d="M70 10 L 70 40" fill="transparent" stroke="brown" stroke-dasharray="3,3"/>
                  </template>
                  <!-- 危房已改造 -->
                  <template v-else-if="item.dilapidatedHouses==3">
                    <circle cx="14" cy="11" r="1" fill="brown"/>
                    <circle cx="14" cy="18" r="1" fill="brown"/>
                    <circle cx="14" cy="25" r="1" fill="brown"/>
                    <circle cx="14" cy="32" r="1" fill="brown"/>
                    <circle cx="14" cy="39" r="1" fill="brown"/>
                    <circle cx="33" cy="11" r="1" fill="brown"/>
                    <circle cx="33" cy="18" r="1" fill="brown"/>
                    <circle cx="33" cy="25" r="1" fill="brown"/>
                    <circle cx="33" cy="32" r="1" fill="brown"/>
                    <circle cx="33" cy="39" r="1" fill="brown"/>
                    <circle cx="52" cy="11" r="1" fill="brown"/>
                    <circle cx="52" cy="18" r="1" fill="brown"/>
                    <!-- <circle cx="52" cy="25" r="1" fill="brown"/> -->
                    <circle cx="52" cy="32" r="1" fill="brown"/>
                    <circle cx="52" cy="39" r="1" fill="brown"/>
                    <circle cx="71" cy="11" r="1" fill="brown"/>
                    <circle cx="71" cy="18" r="1" fill="brown"/>
                    <circle cx="71" cy="25" r="1" fill="brown"/>
                    <circle cx="71" cy="32" r="1" fill="brown"/>
                    <circle cx="71" cy="39" r="1" fill="brown"/>
                    <circle cx="90" cy="11" r="1" fill="brown"/>
                    <circle cx="90" cy="18" r="1" fill="brown"/>
                    <circle cx="90" cy="25" r="1" fill="brown"/>
                    <circle cx="90" cy="32" r="1" fill="brown"/>
                    <circle cx="90" cy="39" r="1" fill="brown"/>
                  </template>

                  <template v-if="item.medicine=='未参合'">
                    <path d="M5 10 L 99 10 L 99 39 L 5 39 Z" fill="transparent" stroke="#FF2D36" stroke-width="3"/>
                    <template v-if="item.education=='无在读'">
                      <path d="M7 12 L 97 12 L 97 37 L 7 37 Z" fill="transparent" stroke="#FFFC74" stroke-width="3"/>
                      <template v-if="item.incomeSource=='无业'||item.incomeSource=='无劳力'">
                        <path d="M9 14 L 95 14 L 95 35 L 9 35 Z" fill="transparent" stroke="#969BCA" stroke-width="3"/>
                      </template>
                    </template>
                    <template v-else-if="item.incomeSource=='无业'||item.incomeSource=='无劳力'">
                      <path d="M7 12 L 97 12 L 97 37 L 7 37 Z" fill="transparent" stroke="#969BCA" stroke-width="3"/>
                    </template>
                  </template>
                  <template v-else-if="item.education=='无在读'">
                    <path d="M5 10 L 99 10 L 99 39 L 5 39 Z" fill="transparent" stroke="#FFFC74" stroke-width="3"/>
                    <template v-if="item.incomeSource=='无业'||item.incomeSource=='无劳力'">
                      <path d="M7 12 L 97 12 L 97 37 L 7 37 Z" fill="transparent" stroke="#969BCA" stroke-width="3"/>
                    </template>
                  </template>
                  <template v-else-if="item.incomeSource=='无业'||item.incomeSource=='无劳力'">
                    <path d="M5 10 L 99 10 L 99 39 L 5 39 Z" fill="transparent" stroke="#969BCA" stroke-width="3"/>
                  </template>
                  <!-- <path d="M5 10 L 99 10 L 99 39 L 5 39 Z" fill="transparent" stroke="yellow" stroke-width="3"/>
                  <path d="M7 12 L 97 12 L 97 37 L 7 37 Z" fill="transparent" stroke="brown" stroke-width="3"/>
                  <path d="M9 14 L 95 14 L 95 35 L 9 35 Z" fill="transparent" stroke="grey" stroke-width="3"/> -->
                </template>
                <text x="45" y="30">
                  {{ index-'0'+1 }}
                </text>
              </svg>
            </v-list-tile-action>
            <v-spacer></v-spacer>
            <!-- <v-list-tile-title v-text="item.name"></v-list-tile-title> -->
            <v-list-tile-title style="left:25px;font-size:large">
              {{item.name}}
            </v-list-tile-title>
            <v-list-tile-action>
              <v-tooltip right>
                <v-btn
                  slot="activator"
                  icon
                  style="left:28px"
                  @click="getDetails(index)"
                >
                  <v-icon color="grey lighten-1">info</v-icon>
                </v-btn>
                <span>查看详细信息</span>
              </v-tooltip>
            </v-list-tile-action>
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
      <v-tooltip bottom v-if="userLevel<=6">
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
          @click.stop="changeDrawer()"
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
            v-if="userLevel%2"
            flat
            @click="ChangeEditState()"
          >
            <span v-if="tool" class="title" style="color:white">浏览</span>
            <span v-else class="title" style="color:white">编辑</span>
          </v-btn>
          <v-btn 
            v-if="userLevel%2"
            flat
            @click = "importImg()"  
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
    <v-dialog
      v-model="dialogShow"
      persistent
      max-width="500px"
    >
      <v-card>
        <div>&nbsp;</div>
        <div class="title" style="text-align:center;height:50px;">村户信息一览表</div>
        <div class="title" style="margin-left:30px;height:30px">{{"户名:&nbsp;&nbsp;&nbsp;"+dialog.name}}</div>
        <div class="title" style="margin-left:30px;height:30px">{{"性质:&nbsp;&nbsp;&nbsp;"+dialog.condition}}</div>
        <div class="title" style="margin-left:30px;height:30px">{{"饮水:&nbsp;&nbsp;&nbsp;"+(dialog.safeWater?"有":"无")}}</div>
        <div class="title" style="margin-left:30px;height:30px">{{"道路:&nbsp;&nbsp;&nbsp;"+dialog.haveRoad}}</div>
        <div class="title" style="margin-left:30px;height:30px">{{"人口:&nbsp;&nbsp;&nbsp;"+dialog.members}}</div>
        <div class="title" style="margin-left:30px;height:30px">
          {{"房屋:&nbsp;&nbsp;&nbsp;"+
          (dialog.dilapidatedHouses==0?'危房':dialog.dilapidatedHouses==1?'危房改造中':dialog.dilapidatedHouses==2?'已搬迁':dialog.dilapidatedHouses==3?'危房已改造':'无房')}}
        </div>
        <div class="title" style="margin-left:30px;height:30px">{{"教育保障:&nbsp;&nbsp;&nbsp;"+dialog.education}}</div>
        <div class="title" style="margin-left:30px;height:30px">{{"医疗保障:&nbsp;&nbsp;&nbsp;"+dialog.medicine}}</div>
        <div class="title" style="margin-left:30px;height:30px">{{"致贫原因:&nbsp;&nbsp;&nbsp;"+dialog.poorReason}}</div>
        <div class="title" style="margin-left:30px;height:30px">{{"主要收入来源:&nbsp;&nbsp;&nbsp;"+dialog.incomeSource}}</div>
        <div class="title" style="margin-left:30px;height:30px">{{"帮扶措施:&nbsp;&nbsp;&nbsp;"+dialog.measure}}</div>
        <v-btn color="blue darken-1" flat @click="dialogShow = false" style="left:200px">关闭窗口</v-btn>
      </v-card>
    </v-dialog>
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
    dialogShow: false,
    firstOpen: false,
    totalVillagers: 0,
    totalHousehold: 0,
    dialog: {
      name: null,
      condition: null,
      safeWater: null,
      haveRoad: null,
      members: null,
      dilapidatedHouses: null,
      education: null,
      medicine: null,
      poorReason: null,
      incomeSource: null,
      measure: null,
      comments: null,
      livedInVillage: null
    },
    updMap: false,
    loader: null,
    svgdemo: [
      {
        title: "普通户",
        avatar: require("@/assets/basic/0.png"),
        household: 0,
        people: 0,
        proportion: 0
      },{
        title: "已脱贫贫困户",
        avatar: require("@/assets/basic/1.png"),
        household: 0,
        people: 0,
        proportion: 0
      },{
        title: "一般贫困户",
        avatar: require("@/assets/basic/2.png"),
        household: 0,
        people: 0,
        proportion: 0
      },{
        title: "低保贫困户",
        avatar: require("@/assets/basic/3.png"),
        household: 0,
        people: 0,
        proportion: 0
      },{
        title: "五保贫困户",
        avatar: require("@/assets/basic/4.png"),
        household: 0,
        people: 0,
        proportion: 0
      },{
        title: "孤儿低保户",
        avatar: require("@/assets/basic/5.png"),
        household: 0,
        people: 0,
        proportion: 0
      },{
        title: "外地常住户口未迁",
        avatar: require("@/assets/basic/6.png"),
        household: 0,
        people: 0,
        proportion: 0
      },{
        title: "有安全饮水",
        avatar: require("@/assets/basic/7.png"),
        household: 0,
        people: 0,
        proportion: 0
      },{
        title: "无安全饮水",
        avatar: require("@/assets/basic/8.png"),
        household: 0,
        people: 0,
        proportion: 0
      },{
        title: "危房",
        avatar: require("@/assets/basic/9.png"),
        household: 0,
        people: 0,
        proportion: 0
      },{
        title: "危房改造中",
        avatar: require("@/assets/basic/10.png"),
        household: 0,
        people: 0,
        proportion: 0
      },{
        title: "危房已改造",
        avatar: require("@/assets/basic/11.png"),
        household: 0,
        people: 0,
        proportion: 0
      },{
        title: "医保未参合",
        avatar: require("@/assets/basic/12.png"),
        household: 0,
        people: 0,
        proportion: 0
      },{
        title: "教育无保障",
        avatar: require("@/assets/basic/13.png"),
        household: 0,
        people: 0,
        proportion: 0
      },{
        title: "无主要收入来源",
        avatar: require("@/assets/basic/14.png"),
        household: 0,
        people: 0,
        proportion: 0
      }
    ]
  }),
  computed:{
    ...mapGetters([
      'villagers',
      'currentVillageName',

      'userLevel'
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
    importImg()
    {
      bus.$emit('importImg');
    },
    goBackToSelect(){
      if(this.$store.state.userLevel<=6)
        this.$router.push({ name: 'select'});
    },
    dragStart(event){
        event.dataTransfer.setData("text/plain", event.target.id);
    },
    ChangeEditState(){
      this.tool = !this.tool;
      // console.log("tool:"+this.tool);
      this.$emit('CES');
    },
    ExportImg()
    {
      // let exportImgEvent bus.$emit('save',event.detail.savePack);= new Event("exportImg");
      // window.dispatchEvent(exportImgEvent);
      bus.$emit('exportImg');
    },
    getDetails(curId){
      this.dialogShow = true;
      this.dialog.name = this.villagers[curId].name;
      this.dialog.condition = this.villagers[curId].condition;
      this.dialog.safeWater = this.villagers[curId].safeWater==undefined?"":this.villagers[curId].safeWater;
      this.dialog.haveRoad = this.villagers[curId].haveRoad?"有":"无";
      this.dialog.members = this.villagers[curId].members;
      this.dialog.dilapidatedHouses = this.villagers[curId].dilapidatedHouses;
      this.dialog.education = this.villagers[curId].education;
      this.dialog.medicine = this.villagers[curId].medicine;
      this.dialog.poorReason = this.villagers[curId].poorReason;
      this.dialog.incomeSource = this.villagers[curId].incomeSource;
      this.dialog.measure = this.villagers[curId].measure;
      // console.log();
    },
    outOfPoverty(condition){
      // console.log(condition.indexOf("已脱贫贫困户"));
      if(condition.indexOf("已脱贫")!=-1){
        return true;
      }
      else{
        return false;
      }
    },
    changeDrawer(){
      this.drawer = !this.drawer;
      if(this.firstOpen==false){
        this.firstOpen = true;
        this.totalHousehold = this.villagers.length;
        for(var i=0;i<this.totalHousehold;i++){
          // console.log(this.villagers[i].condition);
          this.totalVillagers += this.villagers[i].members;
          if(this.villagers[i].condition=="普通户"){
            this.svgdemo[0].household++;
            this.svgdemo[0].people += this.villagers[i].members;
          }
          else if(this.outOfPoverty(this.villagers[i].condition)){
            this.svgdemo[1].household++;
            this.svgdemo[1].people += this.villagers[i].members;
          }
          else if(this.villagers[i].condition=="一般贫困户"){
            this.svgdemo[2].household++;
            this.svgdemo[2].people += this.villagers[i].members;
          }
          else if(this.villagers[i].condition=="低保贫困户"){
            this.svgdemo[3].household++;
            this.svgdemo[3].people += this.villagers[i].members;
          }
          else if(this.villagers[i].condition=="五保贫困户"){
            this.svgdemo[4].household++;
            this.svgdemo[4].people += this.villagers[i].members;
          }
          else if(this.villagers[i].condition=="孤儿贫困户"){
            this.svgdemo[5].household++;
            this.svgdemo[5].people += this.villagers[i].members;
          }
          else if(this.villagers[i].condition=="外地常住户口未迁"){
            this.svgdemo[6].household++;
            this.svgdemo[6].people += this.villagers[i].members;
          }
          if(this.villagers[i].safeWater==true){
            this.svgdemo[7].household++;
            this.svgdemo[7].people += this.villagers[i].members;
          }
          else if(this.villagers[i].safeWater==false){
            this.svgdemo[8].household++;
            this.svgdemo[8].people += this.villagers[i].members;
          }
          if(this.villagers[i].dilapidatedHouses==0){
            this.svgdemo[9].household++;
            this.svgdemo[9].people += this.villagers[i].members;
          }
          else if(this.villagers[i].dilapidatedHouses==1){
            this.svgdemo[10].household++;
            this.svgdemo[10].people += this.villagers[i].members;
          }
          else if(this.villagers[i].dilapidatedHouses==3){
            this.svgdemo[11].household++;
            this.svgdemo[11].people += this.villagers[i].members;
          }
          if(this.villagers[i].medicine=='未参合'){
            this.svgdemo[12].household++;
            this.svgdemo[12].people += this.villagers[i].members;
          }
          if(this.villagers[i].education=='无在读'){
            this.svgdemo[13].household++;
            this.svgdemo[13].people += this.villagers[i].members;
          }
          if(this.villagers[i].incomeSource=='无劳力'||this.villagers[i].incomeSource=='无业'){
            this.svgdemo[14].household++;
            this.svgdemo[14].people += this.villagers[i].members;
          }
        }
        for(var i=0;i<15;i++){
          this.svgdemo[i].proportion = (this.svgdemo[i].people/this.totalVillagers*100).toFixed(0);
        }
      }
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
