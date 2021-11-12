<template>
  <iframe id="screen" src="http://192.168.40.17:8001/screen"></iframe>
</template>

<script>
export default {
  name: "dispatch"
}
</script>

<style scoped>
#screen{
  width:100%;
  height:calc(100vh - 84px);
}
</style>
