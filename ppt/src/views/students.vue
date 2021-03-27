<template>
  <el-container>
    <el-main>
      <div class="block" v-if="pptUrl">
        <pptcontent :url="pptUrl" />
      </div>
    </el-main>
    <el-aside width="400px">
      <template v-if="options.length > 0">
        <studentsItem :options="options" :title="title" :answer="answer" :pageId="getPid"/>
      </template>
    </el-aside>
  </el-container>
</template>

<script>
import pptcontent from '../components/pptcontent';
import { getAllPPTS } from '../model/index'
import { showLoading, hideLoading } from '../utils/loading'
import studentsItem from '../components/studentsItem'
import {createSo} from '../socket/socket.student'
import {SocketEventsEnum} from '../socket/socketEvents'
import {getStudentUid, setStudentUid} from '../utils/user'
import { generateUuid } from '@/utils/help';

export default {
  data() {
    return {
      pptUrl: null,
      title: '',
      options: [],
      slides:[],
      current: 0,
      slide_id: 0,
      currentSo: null,
      uid: getStudentUid() // uid
    };
  },
  mounted() {
    if(this.uid === null || this.uid === undefined) {
      this.uid = generateUuid('student', 16)
      setStudentUid(this.uid)
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
    studentsItem
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.slide_id = to.query.slide_id
      vm.current = to.query.page || 0
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
    pageChange(page) {
      this.current = page
      this.getCurrentPPT()
      this.options = []
      this.getItemData()
    },
    joinRoom() {
      this.currentSo = createSo(this.slide_id, this.uid, this.msgListener)
    },
    msgListener(d) {
      console.log(d, d.type, '====收到页码命令')
      // 收到切换页码命令
      if(d.type === SocketEventsEnum.GO_PAGE) {
        this.pageChange(d.params.page)
      }
    },
    answer(v) {
      console.log(v, this.currentSo)
      // emit('response', `{"room": "${room}", "user_id": "student_1", "page_id": "page_1", "item_id": "item_1", "answer": "Lily"}`
      this.emitSo(`{"room": "${this.slide_id}", "user_id": "${this.uid}", "page_id": "${this.slides[this.current].page_id}", "item_id": "item_1", "answer": "${v}"}`)
    },
    emitSo(message) {
      if(this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        this.currentSo.emit('response', message);
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
    //     setStudentUid(setUid)
    //     this.uid = value
    //     this.joinRoom()
    //   }).catch(() => {
           
    //   });
    // }
  },
};
</script>