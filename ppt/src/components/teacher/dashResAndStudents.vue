<template>
  <div class="res-and-student">
    <div class="switch-header">
      <div class="switch-content">
        <div :class="`switch-button ${tab === 1 && 'active'}`" @click="changeTab(1)">
          Student
        </div>
        <div :class="`switch-button ${tab === 2 && 'active'}`" @click="changeTab(2)">
          Response
        </div>
      </div>
    </div>
    <ul class="res-list" v-if="tab === 1">
      <li class="student-list-item" v-for="item in studentList" :key="item.user_id">
        <div class="user-icon student-icon">{{item.name ? item.name.substr(0, 1) : ''}}</div>
        <div class="user-name">{{item.name}}</div>
      </li>
    </ul>
    <ul class="res-list" v-if="tab === 2">
      <li class="res-list-item" v-for="item in answerList" :key="item.id">
        <div class="res-list-item-content">
          <div class="user-info">
            <div class="user-icon">{{item.user_name ? item.user_name.substr(0, 1) : ''}}</div>
            <div>
              <p class="user-name" v-if="item.user_name">{{item.user_name}}</p>
              <p class="user-name user-time">{{getTimeStr(item.updated_at)}}</p>
            </div>
          </div>
          <div class="ans-detail">
            <dash-right-remark-item v-if="item.type === 'media'" :item="item"/>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { getAnswerTimeStr, getJSONValue } from '@/utils/help'
import { mapState, mapGetters } from 'vuex'
import dashRightRemarkItem from './answer/dash-right-remark-item.vue'
export default {
  components: { dashRightRemarkItem },
  computed: {
    ...mapState({
      studentList: state => state.teacher.studentList
    }),
    ...mapGetters({
      currentPageAnswerList: 'student/currentPageAnswerList',
      currentPageId: 'student/currentPageId',
    }),
    answerList() {
      let list = this.responseList.map(item => {
        const data = item.content ? {} : getJSONValue(item.data)
        return {
          ...item,
          id: item.id || item.response_id,
          ...data
        }
      })
      console.log(list, 'righten')
      return list;
    },
  },
  props: {
    // 暂时使用，带重构
    responseList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return{
      tab: 1
    }
  },
  methods: {
    changeTab(tab) {
      this.tab = tab
    },
    getTimeStr(time) {
      return getAnswerTimeStr(time * 1000);
    },
  }
}
</script>
<style scoped>
  .res-and-student{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .switch-header{
    width: 100%;
    margin: 20px 0;
    padding: 0 57px;
    height: 50px;
    box-sizing: border-box;
  }
  .switch-content{
    width: 100%;
    height: 50px;
    border-radius: 30px;
    background-color: rgba(247, 248, 255, 1);
    display: flex;
    justify-items: center;
    align-items: center;
    font-size: 18px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: #11142D;
  }
  .switch-button{
    flex: 1;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }
  .switch-button.active{
    background-color: rgba(21, 195, 154, 1);
    border-radius: 30px;
    color: #fff;
  }
  .res-list{
    flex: 1;
    overflow-y: scroll;
  }
  .res-list-item{
    width: 100%;
    height: 280px;
    box-sizing: border-box;
    margin-bottom: 28px;
    padding: 0 28px;
  }
  .res-list-item-content{
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border: 1px solid #F1F1F1;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.16);
    opacity: 1;
    box-sizing: border-box;
    padding: 18px;
    display: flex;
    flex-direction: column;
  }
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .user-icon {
    width: 52px;
    height: 52px;
    border-radius: 26px;
    margin-right: 11px;
    background-color: red;
    line-height: 52px;
    text-align: center;
    font-size: 20px;
    font-family: Inter-Bold;
    color: #fff;
  }
  .student-icon{
    width: 44px;
    height: 44px;
    border-radius: 22px;
    line-height: 44px;
  }
  .user-name {
    font-size: 16px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    opacity: 1;
    text-align: left;
  }
  .user-time {
    font-size: 10px;
    line-height: 14px;
  }
  .ans-detail{
    flex: 1;
    background-color: rgba(228, 228, 228, 1);
    border-radius: 6px;
  }
  .student-list-item{
    width: 100%;
    height: 77px;
    display: flex;
    align-items: center;
    padding-left: 50px;
    box-sizing: border-box;
  }
</style>