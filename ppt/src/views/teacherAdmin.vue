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

        <el-button type="primary" class="invite" @click="copyUrl">邀请学生</el-button>
      </div>
    </el-main>
    <el-aside width="400px">
      <template v-if="options.length > 0">
        <teacherItem :options="options" :title="title"/>
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
</style>
<script>
import copy from 'copy-to-clipboard';
import { gotoGoogleAuth, getppts } from '../utils/googleAuth.ts';
import pptcontent from '../components/pptcontent';
import { getItem } from '../model/index'
import { showLoading, hideLoading, showToast } from '../utils/loading'
import teacherItem from '../components/teacherItem'
import {createSo} from '../socket/socket.teacher'

export default {
  loadingEl: null,
  data() {
    return {
      pptUrl: null,
      title: '',
      options: [],
      slides:[],
      current: 0,
      slide_id: 0,
      currentSo: null
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
          const {title, options} = d.data.data[0].item.data
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
      this.getItemData()
      this.emitSo({"type":"change_page", "params": {"page": this.current}})
    },
    copyUrl() {
      copy(location.href.replace(/teacher/, 'students'));
      showToast('复制url成功')
    },
    joinRoom() {
      this.currentSo = createSo(this.slide_id, this.msgListener)
    },
    msgListener(d) {
      console.log(d)
    },
    // '{"type":"change_page", "params": {"page": 3}}'
    emitSo(data) {
      if(this.currentSo) {
        this.currentSo.emit('control', `${data}`);
      }
    }
  }
};
</script>