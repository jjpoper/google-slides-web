<template>
  <div class="header">
    <div class="left-area">
      <div v-if="isStundentPaced" class="dash-header-left" @click="handleBack"></div>
      <el-tooltip :content="`${onLine ? 'Online' : 'Offline'}`" placement="top">
        <i class="online"  :style="`background-color: ${onLine ? 'green' : 'rgba(255, 26, 14, 1);'}`"></i>
      </el-tooltip>
      <p>课程标题：{{classRoomInfo.class_name}}</p>
      <el-popover placement="bottom" width="236" trigger="hover" class="dropdown-icon">
         <div class="dash-drop">
          <div class="title">Settings</div>
          <div class="tab" @click="openProject">Open project in new window</div>
          <div class="tab" @click="turnModel">{{isStundentPaced ? 'Stop' : 'Turn on'}} Student-Paced</div>
          <div class="tab">Ipad/Phone Control</div>
          <div class="tab" v-if="isClosed" @click="reopenClass">Reopen This Session</div>
          <div class="tab" v-else @click="endLesson">End This Session</div>
        </div>
        <div class="more-icon" slot="reference"><i></i><i></i><i></i></div>
      </el-popover>
    </div>
    <div class="right-btns">
      <div class="invite-button" @click="share">
        <img src="../../assets/picture/invite.png" class="invite"/>
        <span>{{classRoomInfo.class_id}}</span>
      </div>
      <div
        class="invite-button"
        @click="showStudents"
      >Class Roster {{ getStudentOnLineCount() }}/{{ studentList.length }}</div>
    </div>
    <el-dialog
      title="The class is still in progress, are you sure you want to leave?"
      :visible.sync="showBackConfirm"
      :append-to-body="true"
    >
      <!-- <span>The class is still in progress, are you sure you want to leave?</span> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="showBackConfirm = false">No</el-button>
        <el-button type="primary" @click="backtToClass">Yes</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    share: {
      type: Function,
      default: null
    },
    openProject: {
      type: Function,
    },
    endLesson: {
      type: Function,
    },
    onLine: {
      type: Boolean,
      default: false,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    classRoomInfo: {
      type: Object,
      default: () => {},
    },
    showStudents: {
      type: Function,
    },
    reopenClass: {
      type: Function,
    },
    getStudentOnLineCount: {
      type: Function,
    },
    studentList: {
      type: Array,
      default: () => []
    },
    current_model: {
      type: String,
      default: ''
    },
    turnModel: {
      type: Function,
    },
  },
  data() {
    return {
      showBackConfirm: false
    }
  },
  computed: {
    isStundentPaced() {
      return this.current_model === 'Student-Paced'
    }
  },
  methods: {
    // openProject() {
    //   this
    // }
    handleBack() {
      this.showBackConfirm = true
    },
    backtToClass() {
      window.history.back()
    }
  }
}
</script>
<style>
@import url(../../assets/css/dashheader.scss);
</style>