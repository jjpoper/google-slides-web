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
        <teacherItem :options="options" :title="title" :answerList="answerList"/>
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
import copy from 'copy-to-clipboard';
import { gotoGoogleAuth, getppts } from '../utils/googleAuth.ts';
import pptcontent from '../components/pptcontent';
import { getItem } from '../model/index'
import { showLoading, hideLoading, showToast } from '../utils/loading'
import teacherItem from '../components/teacherItem'
import {createSo} from '../socket/socket.teacher'
import {SocketEventsEnum} from '../socket/socketEvents'
import {generateUuid} from '../utils/help'

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
      uid: generateUuid('slide', 16) // uid
    };
  },
  components: {
    pptcontent,
    teacherItem
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.slide_id = to.query.slide_id
      vm.tryToGetPPTSlides()
      vm.joinRoom()
    })
  },
  mounted() {
    showLoading()
  },
  methods: {
    // 需要等googleapi加载完成
    tryToGetPPTSlides() {
      let delay = () => {
        setTimeout(() => {
          console.log('try', gapi)
          if(gapi) {
            delay = null
            this.authToGetSlides()
          } else {
            delay()
          }
        }, 500)
      }
      delay()
    },
    authToGetSlides() {
      gotoGoogleAuth(this.slide_id).then((d) => {
        console.log(d);
        // this.contentUrl = d;
        // hideLoading()
        this.slides = d
        this.getCurrentPPT()
        this.getItemData()
      });
    },
    getItemData() {
      // slied_id+'_'+page_id+'_'+'choice' 
      // slied_id+'_'+page_id+'_'+'choice' 
      getItem({
        slideid: this.slide_id,
        pageid: this.slides[this.current].objectId,
      }).then((d) => {
        if(d.data.data && d.data.data.length > 0) {
          const len = d.data.data.length
          const {title, options} = d.data.data[len-1].item.data
          // console.log(options)
          this.title = title
          this.options = options
        } else {
          this.options = []
        }
        
      })
    },
    getCurrentPPT() {
      getppts(this.slides[this.current].objectId, this.slide_id).then((url) => {
        this.pptUrl = url
        hideLoading()
      })
    },
    pageChange(value) {
      this.current = value - 1
      showLoading()
      this.getCurrentPPT()
      this.options = []
      this.answerList = []
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
        const currentPageId = this.slides[this.current].objectId
        if(page_id === currentPageId && room === this.slide_id) {
          const filterData = this.answerList.filter((item) => item.user_id !== user_id)
          filterData.push({
            user_id,
            answer
          })
          this.answerList = filterData
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
    }
  }
};
</script>