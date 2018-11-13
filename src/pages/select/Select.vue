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
            <v-card-text>
              <p>{{village.description}}</p>
            </v-card-text>
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
      villages: ['第一个村', '第二个村'],
      selectedName: "",
      villagesInfo: [
        {id:'dsada2312dsaddas231', name: '第一个村', description: '本书是 JavaScript 超级畅销书的最新版。ECMAScript 5 和 HTML5 在标准之争中双双胜出，使大量 专有实现和客户端扩展正式进入规范，同时也为 JavaScript 增添了很多适应未来发展的新特性。本书这 一版除增加 5 章全新内容外，其他章节也有较大幅度的增补和修订，新内容篇幅约占三分之一。全书从 JavaScript 语言实现的各个组成部分'},
        {id:'qwefsaf23121sfafsa3', name: '第二个村', description: '描述二二描述描述描述描述描述描述'}
      ]
    };
  },
  created: function() {
    //retrieve villages info from backend
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
