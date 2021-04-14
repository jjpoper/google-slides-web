<template>
  <numberIndex v-if="type === 'number'" v-bind="$attrs"/>
  <textItem v-else-if="type === 'text'" v-bind="$attrs"/>
  <radioItem v-else-if="type === 'choice'" v-bind="$attrs"/>
  <website v-else-if="type === 'website'" v-bind="$attrs"/>
</template>

<script>
import numberIndex from './numberIndex'
import textItem from './textItem'
import radioItem from './radioItem'
import website from './website'
export default {
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  components: {
    numberIndex,
    textItem,
    radioItem,
    website
  }
}
</script>