<template>
  <div style="position: relative;">
    <el-checkbox-group v-model="checkedValues" :disabled="showCorrect" @change="handleCheckedValueChange">
      <div class="item" v-for="item in optionData.options" :key="item.id">
        <el-checkbox :label="item.id" :value="item.id" style="width: 100%">
          {{item.text}}
        </el-checkbox>
      </div>
    </el-checkbox-group>
    <template v-if="checkedValues.length > 0">
      <div v-if="showCorrect" style="line-height: 25px; color: green">
        正确答案：
        <template v-for="item in optionData.options" >
          <span :key="item.id" v-if="item.isAnswer">{{item.text}} </span>
        </template>
      </div>  
      <el-switch
        v-model="showCorrect"
        :disabled="showCorrect"
        active-color="#13ce66"
        inactive-color="#999"
        @change="changeLocked"
        active-text="show answers"/>
    </template>  
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
import {
getStudentCurrentPageAnswerList
} from '@/model/store.student'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    answer: {
      type: Function,
      default: () => {}
    },
  },
  data() {
    return {
      optionData: {},
      pageId: '',
      checkedValues: [],
      showCorrect: false
    }
  },
  created() {
    this.optionData = this.data.items[0].data
    this.pageId = this.data.page_id
    const result = getStudentCurrentPageAnswerList(this.pageId, this.data.items[0].type)
    console.log(result, 'result')
    if(result && result.length > 0) {
      const {answer, locked} = result[0]
      this.checkedValues = JSON.parse(answer)
      this.showCorrect = locked === 'true' ? true : false
      console.log(this.showCorrect, 'result')
    }
  },
  methods: {
    handleCheckedValueChange(value) {
      console.log(JSON.stringify(value), this.showCorrect)
      this.answer(JSON.stringify(value), this.showCorrect)
    },
    changeLocked() {
      this.answer(JSON.stringify(this.checkedValues), true)
    }
  }
};
</script>
