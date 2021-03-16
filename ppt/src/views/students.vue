<template>
  <div class="home">
    <div @click="auth" class="button">授权获取ppt</div>
    <pptcontent v-if="contentUrl" :url="contentUrl" />
  </div>
</template>
<style scoped>
.button{
  width: 100px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background-color: red;
  color: #fff;
}
</style>

<script>
import { gotoGoogleAuth } from '../utils/googleAuth.ts';
import pptcontent from '../components/pptcontent';
import { getItem } from '../model/index'

export default {
  data() {
    return {
      contentUrl: null,
    };
  },
  components: {
    pptcontent,
  },
  mounted() {
    this.getItemData()
  },
  methods: {
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
      })
    }
  },
};
</script>
