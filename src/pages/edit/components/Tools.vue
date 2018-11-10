<template>
  <v-layout row wrap>
    <v-layout justify-end align-end>
      <v-btn fab dark large color="light-green darken-4">
        <v-icon dark>edit</v-icon>
      </v-btn>
    </v-layout>
    <!-- <v-flex md3 offset-md9>
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
    </v-flex> -->
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
