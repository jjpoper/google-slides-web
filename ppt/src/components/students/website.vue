<template>
  <div  style="width: 100%; height: 100%">
    <iframe class="website" :src="`https://${data.items[0].data.url}`"/>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
