<template>
  <v-app>
    <v-layout row wrap>
      <v-flex md12>
        <v-layout row wrap>
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
        </v-layout>
      <v-spacer></v-spacer>
      </v-flex>
    </v-layout>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      app
    >
      <v-list dense>
        <v-list-tile v-for="item in items" :key="item.text" @click="">
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
          <v-list-tile v-for="item in items2" :key="item.text" avatar @click="">
            <v-btn 
              round
              color="teal darken-3" 
              block 
              v-text="item.text"
            ></v-btn>
          </v-list-tile>
        </v-list>
        <v-list-tile class="mt-3" @click="">
          <v-list-tile-action>
            <v-icon color="grey darken-1">add_circle_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">
            添加村户
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon color="grey darken-1">settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">
            修改村户信息
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-app>
    
</template>

<script>
export default {
  name: 'VillagerList',
  data: () => ({
    drawer: null,
    items: [
    { icon: 'arrow_back', text: '返回地点选择' },
    ],
    items2: [
    { picture: 28, text: '张三' },
    { picture: 38, text: '李四' },
    { picture: 48, text: '王五' }
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
