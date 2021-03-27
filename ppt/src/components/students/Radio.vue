<template>
  <div>
    <b>{{title}}</b>
    <template>
      <div class="item" v-for="item in options" :key="item.id">
        {{item.text}}
        <span class="tip"><span class="red">{{counts(item.id)}}</span>人已答</span>
      </div>
    </template>
  </div>
</template>
<style scoped>
.item{
  /* width: 100%; */
  margin: 10px;
  /* display: inline-block; */
  height: 50px;
  background-color: #fff;
  border-radius: 10px;
  line-height: 50px;
  position: relative;
}
.tip{
  position: absolute;
  top: 0;
  right: 10px;
  height: 100%;
  line-height: 50px;
  font-size: 12px;
}
.red{
  color: red;
  margin: 0 3px;
}
</style>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: ''
    },
    answerList: {
      type: Array,
      default: [],
    },
    pageId: {
      type: String,
      default: ''
    }
  },
  created() {
    console.log(this.pageId)
  },
  methods: {
    counts(id) {
      if(this.answerList && this.answerList.length >0) {
        const filterData = this.answerList.filter((item) => item.answer == id)
        return filterData.length
      } else {
        return 0
      }
    }
  }
};
</script>
