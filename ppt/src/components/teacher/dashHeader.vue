<template>
  <div class="header">
    <div class="left-area">
      <i class="online"  :style="`background-color: ${onLine ? 'green' : 'rgba(255, 26, 14, 1);'}`"></i>
      <p>课程标题：{{className}}</p>
      <el-popover placement="bottom" width="236" trigger="hover" class="dropdown-icon">
         <div class="dash-drop">
          <div class="title">Settings</div>
          <div class="tab" @click="openProject">Open project in new window</div>
          <div class="tab">Ipad/手机端控制</div>
          <div class="tab" @click="endLesson">End This Session</div>
        </div>
        <div class="more-icon" slot="reference"><i></i><i></i><i></i></div>
      </el-popover>
    </div>
    <div class="right-btns">
      <div class="invite-button" @click="share">
        <img src="../../assets/picture/invite.png" class="invite"/>
        <span>Invite</span>
      </div>
      <div
        class="invite-button"
        @click="showStudents"
      >Class Roster {{ getStudentOnLineCount() }}/{{ studentList.length }}</div>
    </div>
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
    className: {
      type: String,
      default: false,
    },
    showStudents: {
      type: Function,
    },
    getStudentOnLineCount: {
      type: Function,
    },
    studentList: {
      type: Array,
      default: () => []
    },
  },
  methods: {
    // openProject() {
    //   this
    // }
  }
}
</script>
<style scoped>
.header{
  width: 100%;
  height: 50px;
  background-color: #fff;
  position: fixed;
  top: 0;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 100px;
}
.right-btns{
  display: flex;
  justify-content: center;
  align-items: center;
}
.invite-button{
  width: 120px;
  height: 40px;
  border-radius: 4px;
  background-color: rgba(21, 195, 154, 1);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #FFFFFF;
  cursor: pointer;
  margin-left: 10px;
}
.invite{
  width: 23px;
  height: 25px;
  margin-right: 10px;
}
.left-area{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-family: Segoe UI;
  font-weight: 400;
  line-height: 19px;
  color: #36425A;
}
.online{
  width: 18px;
  height: 18px;
  border-radius: 9px;
  margin-right: 10px;
}
.more-icon{
  margin-left: 24px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 10px;
  cursor: pointer;
}
.more-icon >i{
  margin: 0 2.5px;
  background: #92B2D1;
  width: 10px;
  height: 10px;
  border-radius: 5px;
}
.dash-drop{
  width: 236px;
  padding-bottom: 20px;
}
.title{
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-family: Segoe UI;
  font-weight: 400;
  line-height: 50px;
  color: #182552;
  text-align: center;
}
.tab{
  width: 236px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  cursor: pointer;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #11142D;
}
.tab:hover{
  background-color: rgba(228, 228, 228, 1);
}
</style>