<template>
  <div>
    <div v-show="showTable">
      <div class="title">Classroom Roster - {{classRoomInfo.class_name}}</div>
      <div class="tab">
        <div :class="`tabitem ${tab === 0 && 'active'}`" @click="changeTab(0)">Students ({{studentList.length}})</div>
        <div :class="`tabitem ${tab === 1 && 'active'}`" @click="changeTab(1)">Teachers（{{teacherList.length}}）</div>
      </div>
      <div class="content">
        <div class="table">
          <div class="th gray">
            <div class="tr tname">Name</div>
            <div class="tr tname">Status</div>
            <div class="tr tname">{{tab === 0 ? 'Email' : ''}}</div>
            <div class="tr tname">{{tab === 0 ? 'Group' : ''}}</div>
            <div class="tr tname"></div>
          </div>
          <div v-for="(item, index) in currentList" :key="index" :class="`th ${index % 2 !== 0 && 'gray'}`">
            <div class="tr tname">{{item.name}}</div>
            <div class="tr tname">{{tab === 0 ? item.state : item.user_id}}</div>
            <div class="tr tname">{{tab === 0 ? item.user_id : ''}}</div>
            <div class="tr tname">{{tab === 0 ? 'Group' : ''}}</div>
            <div class="tr tname"></div>
          </div>
        </div>
        <div v-if="tab === 0" class="setting">设置分组</div>
      </div>
    </div>
    <div v-if="!showTable">

    </div>
  </div>
</template>

<script>
export default {
  props: {
    studentList: {
      type: Array,
      default: [],
    },
    teacherList: {
      type: Array,
      default: [],
    },
    classRoomInfo: {
      type: Object
    }
  },
  data() {
    return {
      activeTab: "first",
      currentList: [],
      tab: 0,
      showTable: true
    };
  },
  created() {
    this.currentList = this.studentList
    console.log(this.studentList)
  },

  methods: {
    Student() {
      let total = this.studentList.length;
      let onLine = 0;
      for (let i = 0; i < total; i++) {
        if ("online" == this.studentList[i].state) {
          onLine++;
        }
      }
      return "Student" + "  " + onLine + "/" + total;
    },
    Teacher() {
      let total = this.teacherList.length;
      let onLine = 0;
      for (let i = 0; i < total; i++) {
        if ("online" == this.teacherList[i].state) {
          onLine++;
        }
      }
      return "Teacher" + "  " + onLine + "/" + total;
    },
    opt(index, data) {
      // console.log(data[index].name);
    },
    changeTab(nextTab) {
      if(nextTab !== this.tab) {
        this.tab = nextTab
        this.currentList = [this.studentList, this.teacherList][nextTab]
      }
    }
  },
};
</script>

<style scoped>
.title{
  font-size: 24px;
  font-family: Arial;
  font-weight: bold;
  line-height: 80px;
  color: #272727;
}
.tab {
  width: 100%;
  display: flex;
  justify-content: center;
}
.tabitem{
  font-size: 16px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
  line-height: 24px;
  color: rgba(50, 50, 50, 1);
  margin: 0 16px;
  cursor: pointer;
}
.tabitem.active{
  color: rgba(21, 195, 154, 1)
}
.content{
  width: 90%;
  position: relative;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 20px 0
}
.table{
  width: 100%;
  margin-bottom: 20px;
  min-height: 50px;
  max-height: 470px;
  border-radius: 4px;
  overflow-y: scroll;
  border: 1px solid rgba(230, 230, 230, 1)
}
.th{
  width: 100%;
  min-height: 50px;
  display: flex;
  background-color: #fff;
}
.th.gray{
  background-color: rgba(228, 228, 228, 0.2);
}
.tr{
  flex: 1;
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
}
.tname{
  font-size: 14px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
  line-height: 24px;
  color: #323232;
  font-weight: bolder;
}
.setting{
  width: 90px;
  height: 30px;
  background: #FFFFFF;
  border: 1px solid #D8D8D8;
  font-size: 12px;
  font-family: Inter-Bold;
  line-height: 30px;
  color: #15C39A;
  cursor: pointer;
  border-radius: 30px;
  text-align: center;
}
</style>