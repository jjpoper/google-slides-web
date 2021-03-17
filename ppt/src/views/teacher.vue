<template>
  <el-container>
    <el-main>
      <div @click="auth" class="button">授权获取ppt</div>
      <pptcontent v-if="contentUrl" :url="contentUrl" />
    </el-main>
    <el-aside width="200px">
      <template v-if="title">
        <div>{{title}}</div>
        <div v-for="item in options" :key="item.id">
          <label >{{item.text}}</label>
          <input type="radio" name="test" :value="item.id" />
          <br />
        </div> 
      </template>
    </el-aside>
  </el-container>
</template>

<script>
import { gotoGoogleAuth } from '../utils/googleAuth.ts';
import pptcontent from '../components/pptcontent';
import { getItem } from '../model/index'

export default {
  data() {
    return {
      contentUrl: null,
      title: '',
      options: []
    };
  },
  components: {
    pptcontent,
  },
  mounted() {
    this.getItemData()
    this.tryToGetPPT()
    this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  },
  methods: {
    // 需要等googleapi加载完成
    tryToGetPPT() {

    },
    auth() {
      gotoGoogleAuth().then((d) => {
        console.log(d);
        this.contentUrl = d;
      });
    },
    getItemData() {
      // slied_id+'_'+page_id+'_'+'choice' 
      // slied_id+'_'+page_id+'_'+'choice' 
      getItem({
        slideid: '1KxKT-_j8Z1L4ag4waifI9hnDRm0C9yNnFt7VKwVVqCg',
        pageid: 'p',
        itemid: '1KxKT-_j8Z1L4ag4waifI9hnDRm0C9yNnFt7VKwVVqCg_p_choice'
      }).then((d) => {
        // console.log(d)
        const {title, options} = d.data.data[0].item.data
        this.title = title
        this.options = options
      })
    }
  },
};
</script>