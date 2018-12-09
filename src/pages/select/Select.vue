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
                <h1>村落选择</h1>
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
            @click.native="select(village._id)">
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
    };
  },
  computed:{
    ...mapGetters([
      'villagesInfo',
      'villages'
    ]),
  },
  mounted(){
      this.$store.dispatch('getVillagesInfo');
    },

  watch: {
    selectedName: function(val) {
      if(!val)
        return;
      this.search(val);
    }
  },

  methods: {
    //select a village and jump to its edit page
    //@params: {string} 'villageId' for redirect
    select: function(villageId) {
      this.$store.dispatch('setCurrentVillageId',villageId);
      this.$router.push({ name: 'edit', params: { id: villageId}});
    },

    //search for a village's id according to 'key'
    //@params: {string} 'key' village's name for searching
    search: function(key) {
      console.log('search' + key);

      for(const village of this.villagesInfo)
        if(key == village.name)
          this.select(village._id);
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
