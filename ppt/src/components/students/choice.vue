<template>
  <checkboxItem v-if="data.items[0].data.isMulti" :data="data" v-bind="$attrs" />
  <radioItem v-else  :data="data" v-bind="$attrs" />
</template>

<script>
import radioItem from './radioItem'
import checkboxItem from './checkboxItem'
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  components: {
    radioItem,
    checkboxItem
  }
}
</script>