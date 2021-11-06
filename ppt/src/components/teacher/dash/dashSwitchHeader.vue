<template>
  <div :class="`switch-header ${showFullAnswer ? '' : 'small'}`">
    <div v-if="showFullAnswer" @click="showres" class="showResButoon">{{showResponse ? 'Hide' : 'Show'}} Response</div>
    <!-- <div class="switch-content">
      <div v-show="currentPageAnswerType !== 'none'"
        :class="`switch-button ${tab === 2 && 'active'}`"
        @click="changeTab(2)">
        Response
      </div>
    </div> -->
    <el-tooltip :content="`${showFullAnswer ? 'Show Less' : 'Show More'}`" placement="top">
      <div
        :class="`full-answer-button ${showFullAnswer && 'active'}`"
        @click="setDashFullPageResponse(!showFullAnswer)"></div>
    </el-tooltip>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      currentPageAnswerType: 'student/currentPageAnswerType',
    }),
    ...mapState({
      showFullAnswer: state => state.teacher.showDashFullResponse,
    }),
  },
  watch: {
    currentPageAnswerType() {
      if(this.currentPageAnswerType === 'none') {
        this.changeTab(1)
      }
    }
  },
  data() {
    return {
      tab: 2
    }
  },
  props: {
    showResponse: {
      type: Boolean,
      default: false,
    },
    showres: {
      type: Function
    },
  },
  methods: {
    ...mapActions("teacher", [
      "setDashFullPageResponse",
    ]),
    changeTab(tab) {
      this.tab = tab
    },
  }
}
</script>
<style scoped>
  .switch-header{
    width: 40%;
    margin: 20px auto;
    /* padding: 0 57px; */
    height: 50px;
    box-sizing: border-box;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    top: 0;
    right: 280px;
    /* background-color:  red; */
  }
  .small{
    width: 50px;
  }
  .switch-content{
    width: 140px;
    /* margin: 0 auto; */
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
  .full-answer-button{
    position: absolute;
    width: 50px;
    height: 50px;
    top: 0;
    right: 0;
    background-image: url(../../../assets/picture/showmore.png);
    background-position: center;
    background-size: 50px 50px;
    cursor: pointer;
  }
  .full-answer-button.active{
    background-image: url(../../../assets/picture/hidemore.png);
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
  .showResButoon{
    width: 170px;
    height: 50px;
    border-radius: 4px;
    background-color: rgba(255, 26, 14, 1);
    font-size: 14px;
    font-family: Inter-Bold;
    line-height: 50px;
    color: #FFFFFF;
    cursor: pointer;
    text-align: center;
    position: relative;
    border-radius: 30px;
    /* margin-right: 30px; */
  }
</style>