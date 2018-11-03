<template>
  <div class="edit">
    <edit-tools></edit-tools>
    <edit-canvas></edit-canvas>
  </div>
</template>

<script>

import EditTools from './components/Tools'
import EditCanvas from './components/Canvas'
export default {
  name: 'edit',
  components:{
      EditTools: EditTools,
      EditCanvas: EditCanvas
  }
}
</script>
<style>
</style>
