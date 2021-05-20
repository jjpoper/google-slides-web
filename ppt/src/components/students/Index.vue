<template>
  <numberIndex v-if="type === 'number'" v-bind="$attrs" />
  <textItem v-else-if="type === 'text'" v-bind="$attrs" />
  <choice v-else-if="type === 'choice'" v-bind="$attrs" />
  <website v-else-if="type === 'website'" v-bind="$attrs" />
  <draw v-else-if="type === 'draw'" v-bind="$attrs" />
</template>

<script>
import numberIndex from './numberIndex'
import textItem from './textItem'
import choice from './choice'
import website from './website'
import draw from './draw'
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
  },
  components: {
    numberIndex,
    textItem,
    choice,
    website,
    draw
  }
}
</script>