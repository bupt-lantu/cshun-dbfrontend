<template>
  <v-app
    class="edit"
  > 
    <villager-list @CES = "ChangeEditState"></villager-list>
    <cvs :EditBtn = "!isedit" :editId= "this.$route.params.id"></cvs>
    <edit-tools></edit-tools>
  
  </v-app>
</template>

<script>
import EditTools from './components/Tools'
import VillagerList from './components/VillagerList'
import Cvs from './components/Cvs'
export default {
  name: 'edit',
  data () {
    return {
      isedit: 'true'
    }
  },
  components:{
      EditTools: EditTools,
      VillagerList: VillagerList,
      Cvs: Cvs,
  },
  methods: {
    ChangeEditState () {
      console.log("isedit:"+this.isedit)
      this.isedit = !this.isedit
    }
  }
}
</script>
<style>
</style>