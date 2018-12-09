<template>
  <v-app>
    <router-view :key="new Date()"></router-view>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      //
    }
  }
}
</script>
