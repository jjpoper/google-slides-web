<template>
  <el-container>
    <el-main>
      <div class="block" v-if="pptUrl">
        <pptcontent :url="pptUrl" />
        <el-pagination
          style="line-height: 50px"
          background
          layout="prev, pager, next"
          @current-change="pageChange"
          :current-page="0"
          :page-count="slides.length">
        </el-pagination>
        <el-button type="primary" class="counts">当前学生人数：{{studentCounts}}</el-button>
        <el-button type="primary" class="invite" @click="copyUrl">邀请学生</el-button>
      </div>
    </el-main>
    <el-aside width="400px">
      <template v-if="options.length > 0">
        <teacherItem :options="options" :title="title" :answerList="answerList" :pageId="getPid"/>
      </template>
    </el-aside>
  </el-container>
</template>
<style scoped>
.block{
  position: relative;
}
.invite{
  position: absolute;
  right: 10px;
  bottom: 20px;
}
.counts{
  position: absolute;
  left: 10px;
  bottom: 20px;
  background-color: transparent !important;
  border: none !important;
  color: #333;
}
</style>
<script>
import { MessageBox } from 'element-ui';
import copy from 'copy-to-clipboard';
import pptcontent from '../components/pptcontent';
import { getAllPPTS } from '../model/index'
import { showLoading, hideLoading, showToast } from '../utils/loading'
import teacherItem from '../components/teacherItem'
import {createSo} from '../socket/socket.teacher'
import {SocketEventsEnum} from '../socket/socketEvents'
import {getTeacherUid, setTeacherUid} from '../utils/user'
import {saveTeacherAlist, getTeacherAlist} from '../utils/store'
import { generateUuid } from '@/utils/help';

export default {
  data() {
    return {
      studentCounts: 0,
      pptUrl: null,
      title: '',
      options: [],
      slides:[],
      current: 0,
      slide_id: 0,
      currentSo: null,
      answerList: [], // 用户回答的内容
      uid: getTeacherUid() // uid
    };
  },
  mounted() {
    if(this.uid === null || this.uid === undefined) {
      this.uid = generateUuid('teacher', 16)
      setTeacherUid(this.uid)
      this.joinRoom()
    } else {
      this.joinRoom()
    }
  },
  computed: {
    'getPid'() {
      return this.slides[this.current].page_id
    }
  },
  components: {
    pptcontent,
    teacherItem
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.slide_id = to.query.slide_id
      vm.getAllSlides()
    })
  },
  methods: {
    getAllSlides() {
      showLoading()
      getAllPPTS(this.slide_id).then((list) => {
        console.log(list);
        // this.contentUrl = d;
        // hideLoading()
        this.slides = list
        this.getCurrentPPT()
        this.getItemData()
        hideLoading()
      });
    },
    getItemData() {
      this.options = []
      this.$nextTick(() => {
        const {title, options} = this.slides[this.current].items.data
        this.title = title
        this.options = options
      })
    },
    getCurrentPPT() {
      this.pptUrl = this.slides[this.current].thumbnail_url
    },
    pageChange(value) {
      this.current = value - 1
      this.getCurrentPPT()
      this.options = []
      this.answerList = getTeacherAlist(this.getPid)
      this.getItemData()
      // 换页命令
      // '{"type":"change_page", "params": {"page": 3}}'
      this.emitSo(`{"room":"${this.slide_id}", "type": "${SocketEventsEnum.GO_PAGE}", "params": {"page": "${this.current}"}}`)
    },
    copyUrl() {
      copy(`${location.href.replace(/teacher/, 'students')}&page=${this.current}`);
      showToast('复制url成功')
    },
    joinRoom() {
      this.currentSo = createSo(this.slide_id, this.uid, this.msgListener)
    },
    msgListener(d = {}) {
      // answer: "Lily"
      // item_id: "item_1"
      // page_id: "page_1"
      // room: "1KxKT-_j8Z1L4ag4waifI9hnDRm0C9yNnFt7VKwVVqCg"
      // user_id: "slidec3dcef92c1cf458c"
      console.log(d)
      if(d.type === SocketEventsEnum.ANSWER_QUESTION) {
        const {answer, page_id, room, user_id} = d
        const currentPageId = this.slides[this.current].page_id
        if(page_id === currentPageId && room === this.slide_id) {
          const filterData = this.answerList.filter((item) => item.user_id !== user_id)
          filterData.push({
            user_id,
            answer
          })
          this.answerList = filterData
          console.log(this.answerList)
          saveTeacherAlist(currentPageId, filterData)
          this.$forceUpdate()
        }
      } else if(d.type === SocketEventsEnum.STUDENTS_COUNTS) {
        this.studentCounts = d.student_count
      }
      
    },
    // '{"type":"change_page", "params": {"page": 3}}'
    emitSo(message) {
      if(this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        this.currentSo.emit('control', message);
      }
    },
    // enterUid() {
    //   MessageBox.prompt('建议请输入手机号', '为了更好的演示体验，记录当前用户选中的内容信息，仅做demo参考', {
    //     confirmButtonText: '确定',
    //     showCancelButton: false,
    //     showClose: false,
    //     inputPattern: /[0-9]/,
    //     inputErrorMessage: '至少输入0-9的任意数字'
    //   }).then(({ value }) => {
    //     console.log(value)
    //     setTeacherUid(setUid)
    //     this.uid = value
    //     this.joinRoom()
    //   }).catch(() => {
           
    //   });
    // }
  }
};
</script>