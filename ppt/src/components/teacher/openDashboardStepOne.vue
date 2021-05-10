<template>
  <div @click="openTwo()">Step One!!</div>
</template>

<script>
export default {
    props:{
        openTwo:{
            type:Function,
        }
    }
};
</script>

<style scoped>
</style>