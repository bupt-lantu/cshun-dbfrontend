<template>
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
            <v-btn color="blue-grey">清空</v-btn>
            <v-btn color="lime darken-1">导出数据</v-btn>
            <v-btn color="light-green">导出长图</v-btn>
            <v-btn color="cyan darken-4">保存</v-btn>
          </v-layout>
        </v-toolbar>
      </v-layout>
    <v-spacer></v-spacer>
    </v-flex>
    <v-flex md3 offset-md9>
      <v-toolbar
        dense
        floating
        color="grey darken-3"
      >
        
        <div>
          信息编辑
        </div>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
      </v-toolbar>
    </v-flex>
  </v-layout>

    
</template>

<script>
export default {
  name: 'Tools',
  data () {
    return {
      items: [
        { title: 'Dashboard', icon: 'dashboard' },
        { title: 'Account', icon: 'account_box' },
        { title: 'Admin', icon: 'gavel' }
      ]
    }
  }
}
</script>

<style>
</style>
