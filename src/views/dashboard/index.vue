<template>
  <iframe id="screen" src="http://192.168.40.17:8001/screen"></iframe>
</template>

<script>
  // import { mapGetters } from 'vuex'
  import adminDashboard from './admin'
  // import editorDashboard from './editor'

  export default {
    name: 'Dashboard',
    components: {
      adminDashboard,
      // editorDashboard
    },
    data() {
      return {
        currentRole: 'adminDashboard'
      }
    },
    computed: {
      // ...mapGetters([
      //   'roles'
      // ])
    },
    created() {
      // if (!this.roles.includes('admin')) {
      //   this.currentRole = 'editorDashboard'
      // }
    }
  }
</script>

<style>
 #screen{
   width:100%;
   height:calc(100vh - 84px);
 }
</style>
