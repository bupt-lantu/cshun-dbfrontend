<template>
  <v-app
    class="select"
    light
  >
    <v-container>
      <v-layout column wrap>
        <!-- Header -->
        <v-flex xs12 sm6 md6>
          <v-layout row wrap justify-space-between>
            <v-flex xs12 sm4 md3>
              <v-card-title>
                  <v-form ref="form">
                    <v-select 
                      :items="townsArr"
                      v-model="selectTown"
                      label="选择镇"
                      required
                      :rules="[v => !!v || '请选择镇']"
                    >
                    </v-select>
                      <v-select 
                      :items="bigvillagesArr"
                      v-model="selectBigvillage"
                      label="选择村"
                      required
                      :rules="[v => !!v || '请选择村']"
                    >
                    </v-select>
                    <v-btn class="mx-0 px-0 text-xs-center" @click="submit">确定</v-btn>
                  </v-form>
              </v-card-title>
            </v-flex>
            <!-- Search Field -->
            <v-flex xs12 sm4 md3>
              <v-autocomplete
                v-model="keyword"
                :items="villages"
                :search-input.sync="selectedName"
                :label="'查找'"
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
        </v-flex>
        <!-- Header End -->
        <!-- Village Cards -->
        <v-flex xs6 mt-3
        v-for="village in villagesInfo" 
        :key="village._id">
          <v-hover>
            <v-card 
            slot-scope="{ hover }"
            class="village-card"
            @click.native="select(village._id,village.name)">
              <v-card-title primary-title 
              class="village-title"
              :class="{ titleHovered: hover }">
                <h2 style="font-size:22px">{{village.name}}</h2>
              </v-card-title>
               <v-layout row wrap>
                <v-flex xs4 offset-xs3>
                    <p style="font-size:16px"><b>户数:</b> {{village.family}}</p>
                    <p style="font-size:16px"><b>人数:</b> {{ village.villagerNum }}</p>
                    <p style="font-size:16px"><b>系统贫困户数:</b> {{ village.sysPoorFamily }}</p>
                    <p style="font-size:16px"><b>系统贫困人数:</b> {{ village.sysPoorVillager }}</p>
                </v-flex>
                    <v-flex xs4 >
                    <p style="font-size:16px"><b>未脱贫户数:</b> {{ village.notOutPovertyFamily }}</p>
                    <p style="font-size:16px"><b>未脱贫人数:</b> {{ village.notOutPovertyVillager }}</p>
                    <p style="font-size:16px"><b>低保户数:</b> {{ village.lowProtectFamily }}</p>
                    <p style="font-size:16px"><b>低保人数:</b> {{ village.lowProtectVillager }}</p>
                </v-flex>
              </v-layout>
            </v-card>
          </v-hover>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>


<script>
import { mapGetters } from 'vuex'
export default {
  name: "Select",
  data(){
    return {
      keyword: "",
      // villages: [],
      selectedName: "",
      // villagesInfo: []
      // item1s:['大王镇','小王镇','双王镇'],
      item2s:['大王村','小王村','双王村'],
      selectTown:'',
      selectBigvillage:'',
    };
  },
  computed:{
    ...mapGetters([
      'villagesInfo',
      'villages',
      'towns',
      'townsArr',
      'bigvillagesArr',
      'bigvillages'
    ]),
  },
  created(){
      // this.$store.dispatch('getVillagesInfo');
      this.$store.dispatch('getTowns');
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
        //  alert(bigvillage.name);
         this.$store.dispatch('getVillagesInfo',bigvillage.gumis);
      }
  }
}
}
</script>

<style scoped>
h1 {
  font-size: 18px;
  margin-left:auto;
  margin-right:auto;
  border-bottom-style: solid;
  border-bottom-width: 3px;
  border-bottom-color: #48AFF0;
}
.village-card {
  background-color: #F5F8FA;
  border-style: solid;
  border-color: #48AFF0;
  border-width: 1px;
  border-radius:10px;
}
.village-title {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #CED9E0;
}
h2 {
  font-size: 16px;
  margin-left:auto;
  margin-right:auto;
}
p {
  font-size: 12px;
}
.village-card:hover {
  background-color: #137CBD;
  cursor: pointer;
}
.titleHovered {
  border-bottom-color: #48AFF0;
}

</style>
