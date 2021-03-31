<template>
  <el-container>
    <el-main>
      <div class="block" v-if="pptUrl">
        <pptcontent :url="pptUrl" />
      </div>

    <div class="sfooter" v-if="slides.length > 0">
      <div>
        {{uname}}
        <el-button type="primary" @click="enterUname">改名</el-button>
      </div>
      <div class="checkboxs">
        <el-checkbox :checked="allAnswers[getPid] >= 0" >slide {{parseInt(current)+1}}/{{slides.length}}</el-checkbox>
        <div class="scroll-mask"></div>
      </div>
    </div>
    </el-main>
    <el-aside width="400px">
      <template v-if="options.length > 0">
        <studentsItem :options="options" :title="title" :answer="answer" :pageId="getPid"/>
      </template>
    </el-aside>
    <!-- <el-aside width="400px" class="scroll-student">
      <template v-for="(slideItem, index) in slides">
        <studentsItem
          v-if="slideItem.items.data"
          :key="index"
          :options="slideItem.items.data.options"
          :title="slideItem.items.data.title"
          :currentAnswer="allAnswers[slideItem.page_id]"
          :readonly="true"
          :pageId="slideItem.page_id">
          <div class="scroll-mask"></div>
        </studentsItem>
      </template>
    </el-aside> -->
  </el-container>
</template>
<style>
.scroll-student{
  max-height: 700px;
  background-color: #999;
  overflow-y: scroll;
}
.scroll-mask{
  position: absolute;
  width: 100%;
  height: 100%;
  top:0;
  left: 0;
  background-color: transparent;
}
.sfooter{
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.checkboxs{
  position: relative;
  flex: 1
}
</style>
<script>
import pptcontent from '../components/pptcontent';
import { getAllPPTS } from '../model/index'
import { showLoading, hideLoading } from '../utils/loading'
import studentsItem from '../components/studentsItem'
import {createSo} from '../socket/socket.student'
import {SocketEventsEnum} from '../socket/socketEvents'
import {getStudentUid, getUserName, setStudentUid, setUserName} from '../utils/user'
import { generateUuid } from '@/utils/help';
import { getStudentsAnswer } from '@/utils/store';
import {MessageBox} from 'element-ui'

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
      allAnswers: {},
      uname: '',
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
        this.getAllAnswers()
        hideLoading()
      });
    },
    getAllAnswers() {
      for(let i = 0; i< this.slides.length; i++) {
        const choice = this.slides[this.current].items
        if(choice && choice.data) {
          const pid = this.slides[i].page_id
          const value = getStudentsAnswer(pid)
          this.$set(this.allAnswers, pid, value )
          console.log(getStudentsAnswer(pid))
        }
      }
    },
    getItemData() {
      this.options = []
      this.$nextTick(() => {
        const choice = this.slides[this.current].items
        if(choice && choice.data) {
          const {title, options} = this.slides[this.current].items.data
          this.title = title
          this.options = options
        }
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
      const uname = getUserName(this.uid)
      console.log(uname, 'uname')
      this.uname = uname != 'null' && uname != undefined ? uname : ''
      if(!this.uname) {
        this.enterUname()
      }
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
      const pid = this.slides[this.current].page_id
      // emit('response', `{"room": "${room}", "user_id": "student_1", "page_id": "page_1", "item_id": "item_1", "answer": "Lily"}`
      this.emitSo(`{"room": "${this.slide_id}", "user_id": "${this.uid}", "page_id": "${pid}", "item_id": "item_1", "answer": "${v}"}`)
      this.allAnswers[pid] = v
      console.log(this.allAnswers)
    },
    emitSo(message) {
      if(this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        this.currentSo.emit('response', message);
      }
    },
    enterUname() {
      MessageBox.prompt('enter a new name', 'enter a new name', {
        confirmButtonText: '确定',
        showCancelButton: false,
        showClose: false,
        inputPattern: /\s*$/g,
        inputErrorMessage: '用户名不能为空'
      }).then(({ value }) => {
        console.log(value)
        this.uname = value
        setUserName(this.uid, value)
      }).catch(() => {
           
      });
    }
  },
};
</script>