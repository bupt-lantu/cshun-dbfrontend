<template>
  <v-content>
    <v-alert v-model="alert" dismissible color="success" icon="check_circle" outline>保存成功！</v-alert>
    <v-navigation-drawer v-model="rdrawer" right temporary fixed>
      <v-list>
        <v-list-tile v-for="item in svgdemo" :key="item.title" avatar>
          <v-list-tile-action :id="item._id">
            <img :src="item.avatar" width="80%" />
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
            <div>{{item.household+"户，"+item.people+"人，"+item.proportion+"%"}}</div>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer v-model="drawer" fixed clipped app>
      <v-list dense>
        <span class="info-title">村户信息</span>
        <!-- <v-icon color="grey darken-1" style="margin-left:60px">add</v-icon> -->
        <v-tooltip right>
          <v-btn slot="activator" icon @click="rdrawer = !rdrawer" style="left:130px">
            <v-icon>bar_chart</v-icon>
          </v-btn>
          <span>查看统计信息</span>
        </v-tooltip>
        <!-- <v-text-field
          :append-icon-cb="() => {}"
          placeholder="搜索村户"
          single-line
          clearable
          append-icon="search"
          hide-details
          style="margin-left:15px; margin-right:15px"
        ></v-text-field>-->
        <v-list-tile>
          <v-autocomplete
            v-model="keyword"
            :items="villagersNameArr"
            :search-input.sync="selectedVillager"
            :label="'搜索村户'"
            append-icon="search"
            large
            autofocus
            light
          >
            <template slot="no-data">
              <v-list-tile>
                <v-list-tile-title>无此人</v-list-tile-title>
              </v-list-tile>
            </template>
          </v-autocomplete>
        </v-list-tile>
        <v-list ref="villagerList">
          <v-list-tile
            v-for="(item,index) in villagers"
            :key="item.name"
            v-show="!item.isInCanvas && (item.show==undefined||item.show==true)"
            avatar
          >
            <v-list-tile-action
              :id="item._id"
              draggable="true"
              @dragstart="dragStart($event)"
              @drag="drag($event)"
              @dragend="dragEnd($event)"
            >
              <svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <template v-if="item.vMedicine!=0">
                  <rect x="2" y="6" width="100" height="36" style="fill:#FF2D36" />
                </template>
                <template v-if="item.vEdu!=0">
                  <rect x="3" y="7" width="98" height="34" style="fill:#FFFC74" />
                </template>
                <template v-if="!item.vClothes">
                  <rect x="4" y="8" width="96" height="32" style="fill:#999999" />
                </template>
                <template v-if="!item.vWaterOK">
                  <rect x="5" y="9" width="94" height="30" style="fill:#000000" />
                </template>
                <template v-if="!item.vIncomeOK">
                  <rect x="6" y="10" width="92" height="28" style="fill:#969BCA" />
                </template>
                <template v-if="item.vCondition=='特困供养贫困户'">
                  <rect x="7" y="11" width="90" height="26" style="fill:#FF000C" />
                </template>
                <template v-if="item.vCondition=='低保贫困户'">
                  <rect x="7" y="11" width="90" height="26" style="fill:#FFBD2F" />
                </template>
                <template v-if="item.vCondition=='一般贫困户'">
                  <rect x="7" y="11" width="90" height="26" style="fill:#FFFC3F" />
                </template>
                <template v-if="item.vCondition=='已脱贫贫困户'">
                  <rect x="7" y="11" width="90" height="26" style="fill:#00AE57" />
                </template>
                <template v-if="item.vCondition=='普通户'">
                  <rect x="7" y="11" width="90" height="26" style="fill:#2F75C1" />
                </template>
                <template v-if="item.vDisabled!='0'">
                  <path
                    d="M5 20 L 100 20"
                    fill="transparent"
                    stroke="brown"
                    stroke-dasharray="5 5"
                  />
                  <path
                    d="M5 30 L 100 30"
                    fill="transparent"
                    stroke="brown"
                    stroke-dasharray="5 5"
                  />
                  <path
                    d="M35 10 L 35 40"
                    fill="transparent"
                    stroke="brown"
                    stroke-dasharray="3 3"
                  />
                  <path
                    d="M70 10 L 70 40"
                    fill="transparent"
                    stroke="brown"
                    stroke-dasharray="3 3"
                  />
                </template>
                <template v-if="item.v13">
                  <circle cx="14" cy="11" r="1" fill="brown" />
                  <circle cx="14" cy="18" r="1" fill="brown" />
                  <circle cx="14" cy="25" r="1" fill="brown" />
                  <circle cx="14" cy="32" r="1" fill="brown" />
                  <circle cx="14" cy="39" r="1" fill="brown" />
                  <circle cx="33" cy="11" r="1" fill="brown" />
                  <circle cx="33" cy="18" r="1" fill="brown" />
                  <circle cx="33" cy="25" r="1" fill="brown" />
                  <circle cx="33" cy="32" r="1" fill="brown" />
                  <circle cx="33" cy="39" r="1" fill="brown" />
                  <circle cx="52" cy="11" r="1" fill="brown" />
                  <circle cx="52" cy="18" r="1" fill="brown" />
                  <!-- <circle cx="52" cy="25" r="1" fill="brown"/> -->
                  <circle cx="52" cy="32" r="1" fill="brown" />
                  <circle cx="52" cy="39" r="1" fill="brown" />
                  <circle cx="71" cy="11" r="1" fill="brown" />
                  <circle cx="71" cy="18" r="1" fill="brown" />
                  <circle cx="71" cy="25" r="1" fill="brown" />
                  <circle cx="71" cy="32" r="1" fill="brown" />
                  <circle cx="71" cy="39" r="1" fill="brown" />
                  <circle cx="90" cy="11" r="1" fill="brown" />
                  <circle cx="90" cy="18" r="1" fill="brown" />
                  <circle cx="90" cy="25" r="1" fill="brown" />
                  <circle cx="90" cy="32" r="1" fill="brown" />
                  <circle cx="90" cy="39" r="1" fill="brown" />
                </template>
                <template v-if="item.vHouse">
                  <path d="M5 10 L 100 40" fill="transparent" stroke="brown" />
                  <!--path d="M24 10 L 100 34" fill="transparent" stroke="brown" /-->
                  <path d="M43 10 L 100 28" fill="transparent" stroke="brown" />
                  <!--path d="M62 10 L 100 22" fill="transparent" stroke="brown" /-->
                  <path d="M81 10 L 100 16" fill="transparent" stroke="brown" />

                  <path d="M5 40 L 100 10" fill="transparent" stroke="brown" />
                  <!--path d="M5 34 L 81 10" fill="transparent" stroke="brown" /-->
                  <path d="M5 28 L 62 10" fill="transparent" stroke="brown" />
                  <!--path d="M5 22 L 43 10" fill="transparent" stroke="brown" /-->
                  <path d="M5 16 L 24 10" fill="transparent" stroke="brown" />

                  <path d="M5 16 L 81 40" fill="transparent" stroke="brown" />
                  <path d="M5 22 L 62 40" fill="transparent" stroke="brown" />
                  <path d="M5 28 L 43 40" fill="transparent" stroke="brown" />
                  <path d="M5 34 L 24 40" fill="transparent" stroke="brown" />

                  <path d="M24 40 L 100 16" fill="transparent" stroke="brown" />
                  <path d="M43 40 L 100 22" fill="transparent" stroke="brown" />
                  <path d="M62 40 L 100 28" fill="transparent" stroke="brown" />
                  <path d="M81 40 L 100 34" fill="transparent" stroke="brown" />
                </template>
                <text x="45" y="30">{{ index-'0'+1 }}</text>
              </svg>
            </v-list-tile-action>
            <v-spacer></v-spacer>
            <!-- <v-list-tile-title v-text="item.name"></v-list-tile-title> -->
            <v-list-tile-title style="left:25px;font-size:large">{{item.name}}</v-list-tile-title>
            <v-list-tile-action>
              <v-tooltip right>
                <v-btn slot="activator" icon style="left:28px" @click="getDetails(index)">
                  <v-icon color="grey lighten-1">info</v-icon>
                </v-btn>
                <span>查看详细信息</span>
              </v-tooltip>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dense fixed clipped-left app :color="color">
      <!-- <v-toolbar-side-icon>
        <v-icon style="color:white" @click="goBackToSelect">arrow_back</v-icon>
      </v-toolbar-side-icon>-->
      <v-tooltip bottom v-if="userLevel<=6">
        <v-btn slot="activator" icon @click="goBackToSelect">
          <v-icon style="color:white">arrow_back</v-icon>
        </v-btn>
        <span>返回选择页</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn slot="activator" icon @click.stop="changeDrawer()">
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
          <span
            class="grey--text text--lighten-4 px-0 mx-0"
            style="font-weight:bold"
          >{{currentVillageName}}</span>
        </span>
      </v-toolbar-title>
      <v-layout column wrap>
        <v-flex xs12 md5 offset-md7>
          <v-btn v-if="userLevel%2||userLevel==0" flat @click="ChangeEditState()">
            <span v-if="tool" class="title" style="color:white">浏览</span>
            <span v-else class="title" style="color:white">编辑</span>
          </v-btn>
          <v-btn v-if="userLevel%2||userLevel==0" flat @click="importImg()">
            <span class="title" style="color:white">导入</span>
          </v-btn>
          <v-btn flat @click="ExportImg()">
            <span class="title" style="color:white">导出</span>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-toolbar>
    <v-dialog v-model="dialogShow" persistent max-width="500px">
      <v-card>
        <div>&nbsp;</div>
        <div class="title" style="text-align:center;height:50px;">村户信息一览表</div>
        <v-card hover="true">
          <div>&nbsp;</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"户名:&nbsp;&nbsp;&nbsp;"+dialog.name}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"家庭人口数:&nbsp;&nbsp;&nbsp;"+dialog.people}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"劳动力总数:&nbsp;&nbsp;&nbsp;"+dialog.workingPeople}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"联系电话:&nbsp;&nbsp;&nbsp;"+dialog.telephone}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"农户属性:&nbsp;&nbsp;&nbsp;"+dialog.condition}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"收入是否达标:&nbsp;&nbsp;&nbsp;"+dialog.incomeOK}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"不愁吃:&nbsp;&nbsp;&nbsp;"+dialog.foodOK}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"饮水安全:&nbsp;&nbsp;&nbsp;"+dialog.waterOK}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"不愁穿:&nbsp;&nbsp;&nbsp;"+dialog.clothes}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"是否危房:&nbsp;&nbsp;&nbsp;"+dialog.dangerousHouse}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"是否搬迁安置房:&nbsp;&nbsp;&nbsp;"+dialog.tempHouse}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"房屋结构:&nbsp;&nbsp;&nbsp;"+dialog.houseStructure}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"房屋层数及面积:&nbsp;&nbsp;&nbsp;"+dialog.houseSize}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"是否低保户:&nbsp;&nbsp;&nbsp;"+dialog.isLowPaid}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"“四有”情况:&nbsp;&nbsp;&nbsp;"+dialog.fourHave}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"存在漏评/错评/错退风险:&nbsp;&nbsp;&nbsp;"+dialog.wrongRisk}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"存在信访稳控风险:&nbsp;&nbsp;&nbsp;"+dialog.trustRisk}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"属于13类重点人群:&nbsp;&nbsp;&nbsp;"+dialog.is13}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"情况说明:&nbsp;&nbsp;&nbsp;"+dialog.discription}}</div>
          <div
            class="title"
            style="margin-left:30px;height:30px"
          >{{"未纳入建档立卡户原因:&nbsp;&nbsp;&nbsp;"+dialog.un13Reason}}</div>
        </v-card>
        <div>&nbsp;</div>
        <div class="title" style="text-align:center;height:50px;">村户成员具体信息</div>
        <div v-for="item in dialog.members" :key="item.name">
          <v-card hover="true">
            <div>&nbsp;</div>
            <div
              class="title"
              style="margin-left:30px;height:30px"
            >{{"姓名:&nbsp;&nbsp;&nbsp;"+item.name}}</div>
            <div
              class="title"
              style="margin-left:30px;height:30px"
            >{{"与户主关系:&nbsp;&nbsp;&nbsp;"+item.relationship}}</div>
            <div
              class="title"
              style="margin-left:30px;height:30px"
            >{{"身份证号码:&nbsp;&nbsp;&nbsp;"+item.id}}</div>
            <div
              class="title"
              style="margin-left:30px;height:30px"
            >{{"在校生状况:&nbsp;&nbsp;&nbsp;"+item.isInSchool}}</div>
            <div
              v-if="item.isInSchool!='否'"
              class="title"
              style="margin-left:30px;height:30px"
            >{{"失学辍学原因:&nbsp;&nbsp;&nbsp;"+item.loseEduReason}}</div>
            <div
              v-if="item.isInSchool!='否'"
              class="title"
              style="margin-left:30px;height:30px"
            >{{"是否获得高中及以上教育资助:&nbsp;&nbsp;&nbsp;"+item.isPaid}}</div>
            <div
              class="title"
              style="margin-left:30px;height:30px"
            >{{"是否参加农村合作医疗:&nbsp;&nbsp;&nbsp;"+item.isInMedicine}}</div>
            <div
              class="title"
              style="margin-left:30px;height:30px"
            >{{"是否大病、慢性病人:&nbsp;&nbsp;&nbsp;"+item.isInDanger}}</div>
            <div
              class="title"
              style="margin-left:30px;height:30px"
            >{{"治疗自费资金:&nbsp;&nbsp;&nbsp;"+item.selfPay}}</div>
            <div
              class="title"
              style="margin-left:30px;height:30px"
            >{{"是否享受低保:&nbsp;&nbsp;&nbsp;"+item.isLowPaid}}</div>
            <div
              class="title"
              style="margin-left:30px;height:30px"
            >{{"是否残疾人:&nbsp;&nbsp;&nbsp;"+item.isDisabled}}</div>
            <div
              v-if="item.isDisabled=='是'"
              class="title"
              style="margin-left:30px;height:30px"
            >{{"是否有残疾证:&nbsp;&nbsp;&nbsp;"+item.hasDisabledCard}}</div>
            <div
              v-if="item.isDisabled=='是'"
              class="title"
              style="margin-left:30px;height:30px"
            >{{"残疾类型:&nbsp;&nbsp;&nbsp;"+item.disabledKind}}</div>
            <div
              v-if="item.isDisabled=='是'"
              class="title"
              style="margin-left:30px;height:30px"
            >{{"残疾等级:&nbsp;&nbsp;&nbsp;"+item.disabledRank}}</div>
            <div
              class="title"
              style="margin-left:30px;height:30px"
            >{{"是否有劳动力:&nbsp;&nbsp;&nbsp;"+item.hasPower}}</div>
            <div
              class="title"
              style="margin-left:30px;height:30px"
            >{{"务工地点:&nbsp;&nbsp;&nbsp;"+item.workingPlace}}</div>
            <div
              class="title"
              style="margin-left:30px;height:30px"
            >{{"务工时间:&nbsp;&nbsp;&nbsp;"+item.workingTime}}</div>
            <div
              class="title"
              style="margin-left:30px;height:30px"
            >{{"务工收入:&nbsp;&nbsp;&nbsp;"+item.income}}</div>
            <div
              class="title"
              style="margin-left:30px;height:30px"
            >{{"备注:&nbsp;&nbsp;&nbsp;"+item.comment}}</div>
          </v-card>
          <div>&nbsp;</div>
        </div>
        <v-btn color="blue darken-1" flat @click="dialogShow = false" style="left:200px">关闭窗口</v-btn>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import { bus } from "../../../bus.js";
import { mapGetters } from "vuex";
import { throws } from "assert";
// import vCanvas  from './cvs/vCanvas.js';
// import cvs from '../Cvs'
export default {
  name: "VillagerList",
  data: () => ({
    alert: false,
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
      },
      {
        title: "已脱贫贫困户",
        avatar: require("@/assets/basic/1.png"),
        household: 0,
        people: 0,
        proportion: 0
      },
      {
        title: "一般贫困户",
        avatar: require("@/assets/basic/2.png"),
        household: 0,
        people: 0,
        proportion: 0
      },
      {
        title: "低保贫困户",
        avatar: require("@/assets/basic/3.png"),
        household: 0,
        people: 0,
        proportion: 0
      },
      {
        //title: "五保贫困户",
        title: "特困供养贫困户",
        avatar: require("@/assets/basic/4.png"),
        household: 0,
        people: 0,
        proportion: 0
      } /*,{
        title: "孤儿低保户",
        avatar: require("@/assets/basic/5.png"),
        household: 0,
        people: 0,
        proportion: 0
      }*/,
      /*
      {
        title: "有安全饮水",
        avatar: require("@/assets/basic/7.png"),
        household: 0,
        people: 0,
        proportion: 0
      },*/
      {
        title: "无产业覆盖",
        avatar: require("@/assets/basic/14.png"),
        household: 0,
        people: 0,
        proportion: 0
      },
      {
        title: "无安全饮水",
        avatar: require("@/assets/basic/8.png"),
        household: 0,
        people: 0,
        proportion: 0
      },
      {
        title: "愁穿",
        //title: "外地常住户口未迁",
        avatar: require("@/assets/basic/6.png"),
        household: 0,
        people: 0,
        proportion: 0
      },
      {
        title: "教育无保障",
        avatar: require("@/assets/basic/13.png"),
        household: 0,
        people: 0,
        proportion: 0
      },
      {
        title: "医疗无保障",
        avatar: require("@/assets/basic/12.png"),
        household: 0,
        people: 0,
        proportion: 0
      },
      {
        title: "住房无保障",
        avatar: require("@/assets/basic/9.png"),
        household: 0,
        people: 0,
        proportion: 0
      },
      {
        title: "有残疾人",
        avatar: require("@/assets/basic/10.png"),
        household: 0,
        people: 0,
        proportion: 0
      },
      {
        title: "属于13类重点人群",
        avatar: require("@/assets/basic/11.png"),
        household: 0,
        people: 0,
        proportion: 0
      }
    ],

    keyword: "",
    selectedVillager: ""
  }),
  computed: {
    // ...mapGetters([
    //   'villagers',
    //   'currentVillageName',

    //   'userLevel'
    // ]),
    villagers() {
      return this.$store.getters.villagers;
    },
    currentVillageName() {
      return this.$store.getters.currentVillageName;
    },
    userLevel() {
      return this.$store.getters.userLevel;
    },
    currentTown() {
      return sessionStorage.getItem("CT");
    },
    currentBigvillage() {
      return sessionStorage.getItem("CB");
    },
    color() {
      if (this.tool) {
        return "#917369";
      } else {
        return "teal";
      }
    },
    villagersNameArr() {
      return this.villagers.map(item => {
        if (!item.isInCanvas) return item.name;
        else return `${item.name}(地图中)`;
      });
    }
  },
  props: {
    source: String,
    villageId: String
  },
  methods: {
    search(key) {
      if (!key) {
        this.keyword = "";
        for (let villager of this.villagers) villager.show = true;
        return;
      }
      for (let villager of this.villagers) {
        villager.show = false;
        if (villager.name.indexOf(key) >= 0) villager.show = true;
      }
    },
    importImg() {
      bus.$emit("importImg");
    },
    goBackToSelect() {
      if (this.$store.state.userLevel <= 6)
        this.$router.push({ name: "select" });
    },
    dragStart(event) {
      event.dataTransfer.setData("text/plain", event.target.id);
    },
    ChangeEditState() {
      this.tool = !this.tool;
      //console.log("tool:"+this.tool);
      this.$emit("CES");
    },
    ExportImg() {
      // let exportImgEvent bus.$emit('save',event.detail.savePack);= new Event("exportImg");
      // window.dispatchEvent(exportImgEvent);
      if (this.firstOpen == false) {
        this.firstOpen = true;
        this.getDrawerData();
      }
      sessionStorage.setItem("svgDemo", JSON.stringify(this.svgdemo));
      sessionStorage.setItem("villagers", JSON.stringify(this.villagers));
      bus.$emit("exportImg", {
        firstname: this.currentBigvillage,
        lastname: this.currentVillageName
      });
    },
    getDetails(curId) {
      this.dialogShow = true;
      this.dialog = this.villagers[curId];
      /*
      this.dialog.name = this.villagers[curId].name;
      this.dialog.condition = this.villagers[curId].condition;
      this.dialog.safeWater =
        this.villagers[curId].safeWater == undefined
          ? ""
          : this.villagers[curId].safeWater;
      this.dialog.haveRoad = this.villagers[curId].haveRoad ? "有" : "无";
      this.dialog.members = this.villagers[curId].members;
      this.dialog.dilapidatedHouses = this.villagers[curId].dilapidatedHouses;
      this.dialog.education = this.villagers[curId].education;
      this.dialog.medicine = this.villagers[curId].medicine;
      this.dialog.poorReason = this.villagers[curId].poorReason;
      this.dialog.incomeSource = this.villagers[curId].incomeSource;
      this.dialog.measure = this.villagers[curId].measure;*/
      // console.log();
    },
    outOfPoverty(condition) {
      // console.log(condition.indexOf("已脱贫贫困户"));
      if (condition.indexOf("已脱贫") != -1) {
        return true;
      } else {
        return false;
      }
    },
    getDrawerData() {
      this.totalHousehold = this.villagers.length;
      for (var i = 0; i < this.totalHousehold; i++) {
        //console.log(this.villagers[i].condition);
        console.log("AA", this.villagers[i]);
        this.totalVillagers += this.villagers[i].people;
        if (this.villagers[i].vCondition == "普通户") {
          this.svgdemo[0].household++;
          this.svgdemo[0].people += this.villagers[i].people;
        } else if (this.villagers[i].vCondition == "已脱贫贫困户") {
          this.svgdemo[1].household++;
          this.svgdemo[1].people += this.villagers[i].people;
        } else if (this.villagers[i].vCondition == "一般贫困户") {
          this.svgdemo[2].household++;
          this.svgdemo[2].people += this.villagers[i].people;
        } else if (this.villagers[i].vCondition == "低保贫困户") {
          this.svgdemo[3].household++;
          this.svgdemo[3].people += this.villagers[i].people;
        } else if (this.villagers[i].vCondition == "特困供养贫困户") {
          this.svgdemo[4].household++;
          this.svgdemo[4].people += this.villagers[i].people;
        }
        if (!this.villagers[i].vIncomeOK) {
          //"无产业覆盖"
          this.svgdemo[5].household++;
          this.svgdemo[5].people += this.villagers[i].people;
        }
        if (!this.villagers[i].vWaterOK) {
          //无安全饮水
          this.svgdemo[6].household++;
          this.svgdemo[6].people += this.villagers[i].people;
        }
        if (
          //愁穿
          !this.villagers[i].vClothes
        ) {
          this.svgdemo[7].household++;
          this.svgdemo[7].people += this.villagers[i].people;
        }
        if (this.villagers[i].vEdu > 0) {
          //"教育无保障"
          this.svgdemo[8].household++;
          this.svgdemo[8].people += this.villagers[i].vEdu; //this.villagers[i].members;
        }
        if (this.villagers[i].vMedicine > 0) {
          //医疗无保障
          this.svgdemo[9].household++;
          this.svgdemo[9].people += this.villagers[i].vMedicine; //this.villagers[i].members;
        }
        if (this.villagers[i].vHouse) {
          //住房无保障
          this.svgdemo[10].household++;
          this.svgdemo[10].people += this.villagers[i].people;
        }
        if (this.villagers[i].vDisabled > 0) {
          //有残疾人
          this.svgdemo[11].household++;
          this.svgdemo[11].people += this.villagers[i].vDisabled; //this.villagers[i].members;
        }
        if (this.villagers[i].v13) {
          //13类
          this.svgdemo[12].household++;
          this.svgdemo[12].people += this.villagers[i].people;
        }
      }
      for (var i = 0; i < 13; i++) {
        this.svgdemo[i].proportion = (
          (this.svgdemo[i].people / this.totalVillagers) *
          100
        ).toFixed(0);
      }
    },
    changeDrawer() {
      this.drawer = !this.drawer;
      if (this.firstOpen == false) {
        this.firstOpen = true;
        this.getDrawerData();
      }
    },
    getVillagersSvg() {
      let svg_xmls = [];
      for (let villager of this.villagers) {
        let div = document.getElementById(villager._id);
        svg_xmls.push(
          new XMLSerializer().serializeToString(div.childNodes[0]).toString()
        );
      }
      this.$store.dispatch("setVillagersSvg", svg_xmls);
    }
  },
  created() {
    bus.$on("showP", id => {
      // let element=this.villagers.find((index) => index._id==id);
      // element.isInCanvas=true;
      this.$store.dispatch("updateVillager", { id, isIn: true });
    });
    bus.$on("removeP", id => {
      // let element=this.villagers.find((index) => index._id==id);
      // element.isInCanvas=false;
      this.$store.dispatch("updateVillager", { id, isIn: false });
    });
    bus.$on("showDetail", id => {
      let showId = this.villagers.findIndex(obj => obj._id == id);
      this.getDetails(showId);
    });
    bus.$on("save", payload => {
      this.$store.dispatch("sentCanvas", payload);
      this.$store.dispatch("updateVillagerAll");
      this.alert = true;
    });
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 3000);

      this.loader = null;
    },
    selectedVillager: function(val) {
      this.search(val);
    }
  },
  destroyed() {
    bus.$off("showP");
    bus.$off("removeP");
    bus.$off("save");
  }
};
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
