<template>
  <div class="text-answer-container">
    <common-switch-tab :currentTab="currentTab" :changeTab="changeTab"/>
    <div class="text-scroll"  v-if="selectedAnswerList && selectedAnswerList.length > 0">
      <div class="text-answer-list">
        <div :class="`colume${currentTab === 1 ? '1' : '5'} `" v-for="(item, index) in selectedAnswerList" :key="index">
          <div :class="`text-item-outer${currentTab === 1 ? '1' : '5'} ${!flag_1 && 'full-text-area'}`">
            <div
              v-if="shouldShow(item)"
              :class="item.star ? 'text-list-item star_bg' : 'text-list-item'"
            >
              <div :class="`text_area ${currentTab === 1 ? '' : 'columText'} ${!flag_1 && 'full-text-area'}`" >
                <div class="textinner">
                  {{ getText(item) }}
                </div>
                <span class="text_static" v-if="flag_1 && textList.length > 1">
                  {{ index + 1 + " of " + textList.length }}
                </span>
              </div>
              <div class="text-footer" v-if="flag_1">
                <student-response-opt-bar
                  :data="{
                    pageId: data.page_id,
                    itemId: item.item_id,
                    studentId: item.user_id,
                    title: item.content,
                    isStar: item.star,
                    isShowRes: item.show,
                    name: item.user_name,
                    answertime: item.updated_at,
                    id: item.id,
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div v-if="flag_1 && noAnswerStudents.length" class="on-as-outer">
        <div class="no-as-title">
          <i></i> No Response
        </div>
        <div class="on-as-list">
          <p class="on-as-list-item" v-for="item in noAnswerStudents" :key="item.user_id">
            {{item.user_id}}
          </p>
        </div>
      </div> -->
    </div>
    <loading-view v-else/>    
  </div>
</template>

<script>
import { getStundentUidAndName } from "@/model/store.teacher";
import { getCurrentPageAnswerList } from "@/model/store.teacher";
import StudentResponseOptBar from "./studentResponseOptBar.vue";
import { mapGetters, mapState } from 'vuex'
import CommonSwitchTab from './commonSwitchTab.vue';
import LoadingView from './loadingView.vue';
import { getJSONValue } from '@/utils/help';
export default {
  computed: {
    // 未答题学生
    noAnswerStudents() {
      let noList = []
      for(let i = 0; i < this.studentList.length; i++) {
        const currentUser = this.studentList[i]
        const index = this.currentPageAnswerList.findIndex(item => item.user_id === currentUser.user_id)
        if(index === -1) {
          noList.push(currentUser)
        }
      }
      // console.log(noList)
      return noList
    },
    
    selectedAnswerList() {
      const res = this.currentPageAnswerType === 'comment' ? this.currentComments : this.currentPageAnswerList
      let list = this.currentPageAnswerList.map(item => {
        const data = item.content ? {} : getJSONValue(item.data)
        return {
          ...data,
          ...item,
          id: item.id || item.response_id,
        }
      }).reverse()
      console.log(list)
      if(this.selectedGroupMembers.length === 0) return list
      let slist = list.filter(item => {
        return this.selectedGroupMembers.indexOf(item.user_id) > -1
      })
       console.log(slist)
      return slist
    },
    ...mapState({
      studentList: state => state.teacher.studentList,
    }),
    ...mapGetters({
      selectedGroupMembers: 'student/selectedGroupMembers',
      currentPageAnswerList: 'student/currentPageAnswerList'
    })
  },
  components: { StudentResponseOptBar, CommonSwitchTab, LoadingView },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    flag_1: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      textList: [],
      isTextChanging: false,
      changeUser: "", //当前是哪个item发生了变化
      changeItemId: "", //当前是哪个item发生了变化
      currentTab: 1,
      options: [],
      sortValue: 1
    };
  },
  created() {
    this.options = this.flag_1 ? [
        {
          value: 1,
          label: 'sort by time'
        },
        {
          value: 2,
          label: 'sort by name'
        },
        {
          value: 3,
          label: 'sort by response'
        },
      ] : [
        {
          value: 1,
          label: 'sort by time'
        },
        {
          value: 3,
          label: 'sort by response'
        },
      ]
  },
  mounted() {
    //  this.textList = getCurrentPageAnswerList(page_id, items[0].type);
    // const list = getCurrentPageAnswerList(
    //   this.data.page_id,
    //   this.data.items[0].type
    // );
    // this.textList = list
    // EventBus.$on(this.data.items[0].type, (data) => {
    //   // 通知展示当前pageid，当前itemid的评论框
    //   // console.log(data);
    //   this.textList = getCurrentPageAnswerList(
    //     this.data.page_id,
    //     this.data.items[0].type
    //   );
    //   this.isTextChanging = true;
    //   this.changeUser = data.user_id;
    //   this.changeItemId = data.item_id;
    //   let _this = this;

    //   // this.resortList()
    //   setTimeout(function () {
    //     _this.isTextChanging = false;
    //   }, 3000);
    // });
    // console.log(this.studentList, this.textList, '===studentList')
  },
  methods: {
    getUname(id) {
      // console.log(getStundentUidAndName(id));
      const name = getStundentUidAndName(id);
      return name ? name : id;
    },
    getText(item) {
      // const item = JSON.parse(data.data)
      // console.log(item)
      if (item.content) {
        if (this.isTextChanging) {
          if (
            item.user_id == this.changeUser &&
            item.item_id == this.changeItemId
          ) {
            return item.content + "....";
          }
        }
        return item.content;
      }
      return "Deleted response";
    },
    //返回当前这个item是否应该show出来
    shouldShow(item) {
      if (this.flag_1) return true; //如果是dashboard 模式，则一定show
      if (item.show_response == 1) return false; //如果要求隐藏，则一定需要隐藏
      if (item.star) return true; //如果是星标答案，则需要显示
      for (let i = 0; i < this.selectedAnswerList.length; i++) {
        if (this.selectedAnswerList[i].star) return false; //如果不是星标答案，且有其他的星标答案，则需要隐藏
      }
      return true;
    },
    changeTab(i) {
      this.currentTab = i
    }
  },
};
</script>

