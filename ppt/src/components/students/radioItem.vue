<template>
  <div style="position: relative">
    <div class="item" v-for="item in optionData.options" :key="item.id">
      <el-radio v-model="radio" :label="item.id"  class="ra"  @change="changAnswer">
        {{item.text}}
      </el-radio>
    </div>
  </div>
</template>
<style scoped>
.item{
  /* width: 100%; */
  /* width: 50%; */
  margin: 10px;
  /* display: inline-block; */
  height: 50px;
  /* border: 1px solid #fff; */
  background-color: #fff;
  border-radius: 10px;
  line-height: 50px;
  position: relative;
}
.tag{
  color: red;
}
</style>

<script>
import {getStudentsAnswer, saveStudentsAnswer} from '../../utils/store'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      optionData: {}
    }
  },
  created() {
    this.optionData = this.data.items[0].data
  },
  data() {
    return {
      radio: getStudentsAnswer(this.pageId)
    }
  },
  methods: {
    changAnswer(value) {
      this.answer(value)
    }
  }
};
</script>
