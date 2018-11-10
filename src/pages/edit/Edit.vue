<template>
  <v-app
    class="edit"
    dark
  > 
    <villager-list></villager-list>
    <cvs></cvs>
    <edit-tools></edit-tools>
  
  </v-app>
</template>

<script>

import EditTools from './components/Tools'
import VillagerList from './components/VillagerList'
import Cvs from './components/Cvs'
export default {
  name: 'edit',
  components:{
      EditTools: EditTools,
      VillagerList: VillagerList,
      Cvs: Cvs,
  },
}
</script>
<style>
</style>
