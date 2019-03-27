<template>
  <v-app
    class="select"
    light
  >
  <div id="Header">
    <span>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长 顺 脱 贫 攻 坚 可 视 化 数 据 库
    </span>
  </div>
    <v-container>
      <v-layout column wrap>
        <v-card-title>
          <!-- 
            level==5 显示一个村的组列表 
            level==3 显示一个镇的村列表
            level==1 显示镇的列表和村的列表
          -->
            <v-form ref="form">
              <v-layout>
                <v-flex xs12 md5>
                  <v-select 
                  v-if="userLevel<=2"
                    :items="townsArr"
                    v-model="selectTown"
                    label="选择镇"
                    required
                    style="width:200px"
                    :rules="[v => !!v || '请选择镇']"
                  >
                  </v-select>
                </v-flex>
                <v-flex xs12 md5 offset-lg1>
                  <v-select 
                   v-if="userLevel<=4"
                    :items="bigvillagesArr"
                    v-model="selectBigvillage"
                    label="选择村"
                    required
                    style="width:200px"
                    :rules="[v => !!v || '请选择村']"
                  >
                  </v-select>
                </v-flex>
                <v-flex xs12 md5>
                  <v-btn 
                   v-if="userLevel<=4"
                    :loading="selectLoading"
                    class="mx-0 px-0 text-xs-center"
                    color="blue-grey"
                    @click="submit()"
                  >
                    <span style="color: white">
                    确定
                    </span>
                  </v-btn>
                  </v-flex>
                  <v-flex xs12 md5>
                  <v-btn 
                   v-if="userLevel<=4"
                    :loading="selectLoading"
                    class="mx-0 px-0 text-xs-center"
                    color="blue-grey"
                    id = "uploadMap"
                  >
                    <span style="color: white">
                    上传文件
                    </span>
                    <form>
                        <input type="file" accept = ".csv" @change = "uploadCsv($event);"/>
                    </form>
                  </v-btn>
                </v-flex>
                <v-flex><v-btn large v-if="userLevel>=5 && !selectLoading" flat disabled></v-btn></v-flex>
                <v-flex><v-btn large v-if="userLevel>=5 && selectLoading" :loading="selectLoading" flat center></v-btn></v-flex>
                <v-flex xs12 sm5 md2 align-self-end px-0>
                  <v-autocomplete
                    v-model="keyword"
                    :items="villages"
                    :search-input.sync="selectedName"
                    :label="'搜索'"
                    style="left:250px; width:200px"
                    light
                  >
                    <template slot="no-data">
                      <v-list-tile>
                        <v-list-tile-title>
                          找不到合适的村庄
                        </v-list-tile-title>
                      </v-list-tile>
                    </template>
                  </v-autocomplete>
                </v-flex>
              </v-layout>
            </v-form>
        </v-card-title>
        <!-- Village Cards -->
        <v-flex xs6 mt-3
        v-for="village in villagesInfo" 
        :key="village._id">
          <v-hover>
            <v-card 
            slot-scope="hover"
            class="village-card"
            @click.native="select(village._id,village.name)">
              <v-layout>
              <!-- <v-card-title primary-title 
              class="village-title"
              :class="{ titleHovered: hover }"> -->
                <span class="name-style" :class="{ titleHovered: hover }">{{village.name}}</span>
              <!-- </v-card-title> -->
                <span style="float:left;padding-right:8px;border-right:1px solid"></span>
                <span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                  <p>
                    <span class="text-style"> <b>户数:</b> {{village.family}}</span>
                    <span class="text-style"><b>人数:</b> {{ village.villagerNum }}</span>
                    <span class="text-style"><b>系统贫困户数:</b> {{ village.sysPoorFamily }}</span>
                    <span class="text-style"><b>系统贫困人数:</b> {{ village.sysPoorVillager }}</span>
                  </p>
                  <p>
                    <span class="text-style"><b>未脱贫户数:</b> {{ village.notOutPovertyFamily }}</span>
                    <span class="text-style"><b>未脱贫人数:</b> {{ village.notOutPovertyVillager }}</span>
                    <span class="text-style"><b>低保户数:</b> {{ village.lowProtectFamily }}</span>
                    <span class="text-style"><b>低保人数:</b> {{ village.lowProtectVillager }}</span>
                  </p>
              </v-layout>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
      <v-tooltip bottom>
        <v-btn
          slot="activator"
          v-show="backTopShow" @click="backTop"
          fab dark color="teal darken-1" bottom right fixed
          :style="{'margin':'50px 20px'}"
        >
          <v-icon large>keyboard_arrow_up</v-icon>
        </v-btn>
        <span>回到顶部</span>
      </v-tooltip>
      <!-- <v-btn
        v-show="backTopShow" @click="backTop"
        fab dark color="teal darken-1" bottom right fixed small
        :style="{'margin':'50px 20px'}"
      >
        <v-icon>keyboard_arrow_up</v-icon>
      </v-btn> -->
    </v-container>
  </v-app>
</template>


<script>
import { mapGetters } from 'vuex'
import axios from './../../connect.js'
export default {
  name: "Select",
  data(){
    return {
      keyword: "",
      selectedName: "",
      selectTown:'',
      selectBigvillage:'',
      backTopShow: false
    };
  },
  computed:{
    // ...mapGetters([
    //   'villagesInfo',
    //   'villages',
    //   'towns',
    //   'townsArr',
    //   'bigvillagesArr',
    //   'bigvillages',

    //   'userLevel',
    //   'userRespectId',

    //   'selectLoading'
    // ]),
    villagesInfo(){
      return this.$store.getters.villagesInfo
    },
    villages(){
      return this.$store.getters.villages
    },
    towns(){
      return this.$store.getters.towns
    },
    townsArr(){
      return this.$store.getters.townsArr
    },
    bigvillagesArr(){
      return this.$store.getters.bigvillagesArr
    },
    bigvillages(){
      return this.$store.getters.bigvillages
    },
    userLevel(){
      return this.$store.getters.userLevel
    },
    userRespectId(){
      return this.$store.getters.userRespectId
    },
    selectLoading(){
      return this.$store.getters.selectLoading
    }
  },
  created(){
    // this.$store.dispatch('getVillagesInfo');
    if(this.userLevel==1||this.userLevel==2||this.userLevel==0)
      this.$store.dispatch('getTowns');
    if(this.userLevel==3||this.userLevel==4)
      this.$store.dispatch('getBigvillages');
    if(this.userLevel==5||this.userLevel==6){
      axios.get(`bigvillage/${this.userRespectId}`).then((res) => {
        this.$store.dispatch('getVillagesInfo',res.data.info.gumis);
      });
    }

  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  watch: {
    selectedName: function(val) {
      if(!val)
        return;
      this.search(val);
    },
    selectTown:function(val){
      if(!val)
        return;
      let town=this.towns.find((obj) => obj.name===val);
      this.$store.dispatch('getBigvillages',town._id);
    },
  },
  methods: {
    //select a village and jump to its edit page
    //@params: {string} 'villageId' for redirect
    select: function(villageId,villageName) {
      this.$store.dispatch('setCurrentVillageId',villageId);
      this.$store.dispatch('setCurrentVillageName',villageName);
      this.$router.push({ name: 'edit', params: { id: villageId}});
    },
    //search for a village's id according to 'key'
    //@params: {string} 'key' village's name for searching
    search: function(key) {
      console.log('search' + key);

      for(const village of this.villagesInfo)
        if(key == village.name)
          this.select(village._id);
    },
    submit(){
      if(this.$refs.form.validate()) {
        
         let bigvillage=this.bigvillages.find((obj) => obj.name===this.selectBigvillage);
         this.$store.dispatch('setCurrentBigvillage',this.selectBigvillage);
         this.$store.dispatch('getVillagesInfo',bigvillage.gumis);
      }
    },
    backTop() {
      let back = setInterval(() => {
        if (document.body.scrollTop || document.documentElement.scrollTop) {
          document.body.scrollTop -= 100;
          document.documentElement.scrollTop -= 100;
        } else {
          clearInterval(back);
        }
      });
    },
    handleScroll() {
      if (document.documentElement.scrollTop + document.body.scrollTop > 100) {
        this.backTopShow = true;
      } else {
        this.backTopShow = false;
      }
    },
    uploadCsv(e)
    {
      console.log("SBSBB");
      if(!e.target.files[0]) return;
      let formData = new FormData();
      formData.append("data",e.target.files[0]);
      axios.post('import',formData)
      .then(
        (res)=> { 
              //console.log(res);
            },
        (error) => {
            console.log(error);
        }
      );
    }
  }
}
</script>

<style scoped>
#Header {
  text-align: left;
  font-weight: bold;
  /* padding: 20px; */
  background: url(../../assets/bg02.jpg);
  background-size: 100% 100%;
  height: 50px;
  line-height: 50px;
  margin-top: 10px;
  margin-left: 190px;
  margin-right: 190px;
  color: white;
  font-size: 180%;
}
.village-card {
  background-color: #F5F8FA;
  border-style: solid;
  border-color: rgb(15, 51, 4);
  border-width: 1px;
  /* border-radius:10px; */
}
.village-title {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  /* border-bottom-color: #CED9E0; */
  border-bottom-color: #48AFF0;
  border-right-color: black;
}
.text-style {
  font-size:16px;
  display:inline-block;
  width:200px;
  margin-top: 10px;
}
.name-style {
  text-align: center;
  width: 500px;
  height: 50px;
  font-size: 24px;
  margin-top: 25px;
  margin-left:auto;
  margin-right:auto;
  border-right-color: black;
}
p {
  font-size: 12px;
}
.village-card:hover {
  background-color: rgb(130, 170, 172);
  cursor: pointer;
}
.titleHovered {
  border-bottom-color: rgb(182, 219, 184);
}
#uploadCsv form{width:100%;position:absolute; left:0; top:0;opacity:0; filter:alpha(opacity=0);}
#uploadCsv form input{width: 100%;}
</style>
