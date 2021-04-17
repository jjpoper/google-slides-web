<template>
  <div>
    <div v-show="showStatistics">
      <b style="textAlign: left">{{title}} Statistics</b>
      <template v-for="item in options">
        <div :key="item.id" class="outer">
          <div class="item">
            {{item.text}}
            <span class="tip"><span class="red">{{counts(item.id)}}</span>人已答</span>
          </div>
        </div>
      </template>
    </div>
    <div v-show="!showStatistics">
      <b style="textAlign: left">{{title}} Personal</b>
      <div class="userlist">
        <template v-for="item in answerList">
            <div class="users" :key="item.user_id">
              选项 {{getAnswer(item.answer).text}}
              <br/>
              学生 {{getUname(item.user_id)}}
              <comment-icon :data="{pageId: data.page_id, itemId: 'choice', studentId: item.user_id, title: getAnswer(item.answer).text + '.option'}"/>
            </div>
        </template>
      </div>
    </div>
    <el-pagination
      style="line-height: 50px; float: left"
      background
      small
      layout="prev, pager, next"
      @current-change="pageChange"
      :current-page="0"
      :page-count="2">
    </el-pagination>
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
.outer{
  line-height: 30px;
}
.userlist{
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: row;
  padding: 20px;
}
.users{
  line-height: 50px;
  display: inline-block;
  background-color: #999;
  padding: 10px 45px 10px 10px;
  border-radius: 4px;
  text-align: left;
  min-width: 150px;
  position: relative;
}
</style>

<script>
import { getCurrentPageAnswerList, getStundentUidAndName } from '@/model/store.teacher';
import commentIcon from './commentIcon.vue';
export default {
  components: { commentIcon },
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
      showStatistics: true,
      answerList: [],
      options: [],
      title: ''
    }
  },
  mounted() {
    console.log(this.data)
    const {title, options,} = this.data.items[0].data
    this.title = title
    this.options = options
    this.answerList = getCurrentPageAnswerList(this.data.page_id, this.data.items[0].type)
    console.log(this.answerList)
  },
  methods: {
    counts(id) {
      if(this.answerList && this.answerList.length >0) {
        const filterData = this.answerList.filter((item) => item.answer == id)
        return filterData.length
      } else {
        return 0
      }
    },
    getAnswer(answer) {
      const data = this.options.filter((item) => item.id == answer)[0]
      console.log(data)
      return data
    },
    pageChange(value) {
      if(value == 2) {
        this.showStatistics = false
      } else {
        this.showStatistics = true
      }
    },
    getUname(id) {
      console.log(getStundentUidAndName(id))
      const name = getStundentUidAndName(id)
      return name ? name : id
    }
  }
};
</script>
