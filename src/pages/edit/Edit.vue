<template>
  <v-app
    class="edit"
    dark
  > 
    <!-- <villager-list></villager-list> -->
    
    <v-content>
      
      <cvs></cvs>
      <!-- <edit-tools></edit-tools> -->
      <villager-list></villager-list>
      
        <!-- <v-layout justify-end align-end>
          <v-flex shrink>
            <v-tooltip left>
              <v-btn
                slot="activator"
                :href="source"
                icon
                large
                target="_blank"
              >
                <v-icon large>code</v-icon>
              </v-btn>
              <span>Move cursor</span>
            </v-tooltip>
          </v-flex>
        </v-layout> -->
    </v-content>
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
  }
}
</script>
<style>
</style>
