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