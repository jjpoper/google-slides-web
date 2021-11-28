<template>
  <div :class="`switch-header ${showFullAnswer ? '' : 'small'}`">
    <!-- <div v-if="showFullAnswer" @click="showres" class="showResButoon">{{showResponse ? 'Hide' : 'Show'}} Response</div> -->
    <el-tooltip :content="`${showFullAnswer ? 'Show Less' : 'Show More'}`" placement="top">
      <div
        :class="`full-answer-button ${showFullAnswer && 'active'}`"
        @click="setDashFullPageResponse(!showFullAnswer)"></div>
    </el-tooltip>
    <template v-if="showFullAnswer">
      <div class="dash-pad-visiable">
        <dash-groups-select />
      </div>
      <div class="dash-pad-visiable pad-switch-content">
        <div :class="`pad-switch-content-item ${padTab === 1 && 'active'}`" @click="changePadTab(1)">Student</div>
        <div :class="`pad-switch-content-item ${padTab === 2 && 'active'}`" @click="changePadTab(2)">Response</div>
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import dashGroupsSelect from '../dashGroupsSelect.vue'
export default {
  components: { dashGroupsSelect },
  computed: {
    ...mapGetters({
      currentPageAnswerType: 'student/currentPageAnswerType',
    }),
    ...mapState({
      showFullAnswer: state => state.teacher.showDashFullResponse,
    }),
  },
  props: {
    showResponse: {
      type: Boolean,
      default: false,
    },
    showres: {
      type: Function
    },
    padTab: {
      type: Number,
      default: 2,
    },
    changePadTab: {
      type: Function
    },
  },
  methods: {
    ...mapActions("teacher", [
      "setDashFullPageResponse",
    ]),
  }
}
</script>