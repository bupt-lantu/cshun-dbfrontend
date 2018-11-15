<template>
  <v-container>
    <v-layout column wrap>
      <!-- Header -->
      <v-flex xs12 sm6 md6>
        <v-layout row wrap justify-space-between>
          <v-flex xs12 sm6 md3>
            <v-card-title>
              <h1>村落选择</h1>
            </v-card-title>
          </v-flex>
          <!-- Search Field -->
          <v-flex xs12 sm6 md3>
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
      <v-flex xs12 sm12 md6 my-3
      v-for="village in villagesInfo" 
      :key="village.id">
        <v-hover>
          <v-card 
          slot-scope="{ hover }"
          class="village-card"
          @click.native="select(village.id)">
            <v-card-title primary-title 
            class="village-title"
            :class="{ titleHovered: hover }">
              <h2>{{village.name}}</h2>
            </v-card-title>
            <!-- <v-card-text>
              <p>{{village.description}}</p>
            </v-card-text> -->
          </v-card>
        </v-hover>
      </v-flex>

    </v-layout>
  </v-container>
</template>


<script>
export default {
  name: "Select",
  data(){
    return {
      keyword: "",
      villages: [],
      selectedName: "",
      villagesInfo: []
    };
  },
  created(){
      this.$Http.get('village')
      .then(( res )=>{
          this.villagesInfo=res.data.list;         
          this.villagesInfo.map((obj)=>{ 
            // obj.description='描述二二描述描述描述描述描述描述,然而没有描述没有描述，超级单调';
            this.villages.push(obj.name);
          });
      }).catch((err)=>{
          console.log(err);
      });
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
      this.$router.push({ name: 'edit', params: { id: villageId}});
    },

    //search for a village's id according to 'key'
    //@params: {string} 'key' village's name for searching
    search: function(key) {
      console.log('search' + key);

      for(const village of this.villagesInfo)
        if(key == village.name)
          this.select(village.id);
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
