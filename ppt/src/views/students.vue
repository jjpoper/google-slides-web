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
import { gotoGoogleAuth, getppts } from '../utils/googleAuth.ts';
import pptcontent from '../components/pptcontent';
import { getItem } from '../model/index'
import { showLoading, hideLoading } from '../utils/loading'
import studentsItem from '../components/studentsItem'
import {createSo} from '../socket/socket.student'
import {SocketEventsEnum} from '../socket/socketEvents'
import {generateUuid} from '../utils/help'
import {setStoreUid} from '../utils/store'

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
      uid: generateUuid('slide', 16) // uid
    };
  },
  created() {
    console.log(this.uid, 'created')
    setStoreUid(this.uid)
  },
  computed: {
    'getPid'() {
      return this.slides[this.current].objectId
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
      vm.joinRoom()
      vm.tryToGetPPTSlides()
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
    pageChange(page) {
      this.current = page
      showLoading()
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
      this.emitSo(`{"room": "${this.slide_id}", "user_id": "${this.uid}", "page_id": "${this.slides[this.current].objectId}", "item_id": "item_1", "answer": "${v}"}`)
    },
    emitSo(message) {
      if(this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        this.currentSo.emit('response', message);
      }
    }
  },
};
</script>