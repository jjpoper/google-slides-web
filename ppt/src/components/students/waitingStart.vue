<template>
  <div class="waiting-start">
   {{waitingStartSeconds}}
  </div>
</template>

<script>
export default {
  name: "waitingStart",
  props: {
    waitingStartSeconds: {
      type: Number,
      required: true
    }
  },
  created() {
    console.log('waitingStart ' + this.waitingStartSeconds)
  },
}
</script>

<style scoped>

</style>
