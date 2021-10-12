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
          <div class="scroll-content">
            <div v-for="(item, index) in currentList" :key="index" :class="`th ${index % 2 !== 0 && 'gray'}`">
              <div class="tr tname">{{item.name}}</div>
              <div class="tr tname">{{tab === 0 ? item.state : item.user_id}}</div>
              <div class="tr tname">{{tab === 0 ? item.user_id : ''}}</div>
              <div class="tr tname">{{tab === 0 ? 'Group' : ''}}</div>
              <div class="tr tname"></div>
            </div>
          </div>
        </div>
        <div v-if="tab === 0" class="setting" @click="toggleTable(false)">设置分组</div>
      </div>
    </div>
    <div v-if="!showTable">
      <div class="fzTitle">
        <div class="fzTitleInner">
          <img src="../../assets/picture/fanhui.png" class="titleIcon" @click="toggleTable(true)"/>
          <img src="../../assets/picture/closecom.png" class="titleIcon" @click="closeStudents"/>
        </div>
      </div>
      <div class="content" style="align-items: flex-start">
        <div class="title">Create group</div>
        <div class="fzTitleInner groupType">
          <div class="groupRadio groupTextInfo">
            <i class="groupRadioicon selected"></i>
            自定义
          </div>
          <div class="groupTextInfo">
            {{classRoomInfo.class_name}} ({{studentList.length}})     |   {{allGroups.length}} group
          </div>
        </div>
        <div class="addGroup" @click="clickAddGroup">
          <img src="../../assets/picture/add.png" class="titleIcon" style="margin-right: 13px"/>
          Add group
        </div>
        <div class="scroll-content">
          <div class="groupSection" v-for="item in allGroups" :key="item.group_id">
            <div class="groupName">
              {{item.group_name}}
              （{{item.members.length}}）
              <img src="../../assets/picture/bianji.png" class="bianji" @click="bianji(item)"/>
            </div>
            <div class="groupSelect" @click="showCurrentGroupId(item.group_id)">
              <span>-- Add students  --</span>
              <img src="../../assets/picture/arrow-down.png" style="width: 12px; height: 7px"/>
            </div>
            <div class="groupSelectBox" v-if="currentGroupId === item.group_id">
              <template v-for="s in studentList"  >
                <div v-if="otherSelectedUids.indexOf(s.user_id) > -1" :key="s.user_id" class="useritem disable">
                  <span>{{s.name}}</span>
                </div>
                <div v-else :key="s.user_id" class="useritem" @click="changeSelected(s.user_id)">
                  <span>{{s.name}}</span>
                  <img
                    v-if="currentSelectedUids.indexOf(s.user_id) > -1"
                    src="../../assets/picture/student-answered.png"
                    style="width: 21px; height: 21px"/>
                </div>
              </template>
              <div class="setting" style="position: relative; margin: 10px auto;" @click="changeGroupUsers">ok</div>
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        width="30%"
        title=""
        :visible.sync="innerVisible"
        append-to-body>
        <div class="update-name-diaglog" >
          <el-input v-model="currentGroupInfo.group_name" placeholder="请输入内容"
          style="margin-bottom: 10px; border: 1px solid rgba(228, 228, 228, 1)"
          :autofocus="true"></el-input>
          <el-button @click="hideBianji">cancel</el-button>
          <el-button type="primary" @click="updateName">ok</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {
  addGroup,
  updateGroupMember,
  updateGroupName
} from '../../model/index'
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
    },
    closeStudents: {
      type: Function
    }
  },
  computed: {
    ...mapState({
      allGroups: state => state.teacher.allGroups,
    }),
    otherSelectedUids() {
      if(!this.currentGroupId || this.allGroups.length === 0) return []
      let otherUids = []
      for(let i = 0; i < this.allGroups.length; i++) {
        const item = this.allGroups[i]
        if(item.group_id != this.currentGroupId) {
          otherUids = otherUids.concat(item.members.map(u => u.user_id))
        }
      }
      return otherUids
    },
    currentSelectedUids() {
      if(!this.currentGroupId || this.allGroups.length === 0) return []
      let uids = []
      for(let i = 0; i < this.allGroups.length; i++) {
        const item = this.allGroups[i]
        if(item.group_id == this.currentGroupId) {
          uids = item.members.map(u => u.user_id)
          break
        }
      }
      console.log(uids, this.currentGroupId)
      return uids
    }
  },
  data() {
    return {
      activeTab: "first",
      currentList: [],
      tab: 0,
      showTable: true,
      currentGroupId: '',
      innerVisible: false,
      currentGroupInfo: {
        group_name: '',
        group_id: ''
      }
    };
  },
  created() {
    this.currentList = this.studentList
    console.log(this.studentList)
  },

  methods: {
    ...mapActions("teacher", ["updateGroup"]),
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
    },
    toggleTable(status) {
      this.showTable = status
    },
    clickAddGroup() {
      const name = `Group${this.allGroups.length + 1}`
      addGroup(window.classId, `Group${this.allGroups.length + 2}`)
      .then((id) => {
        if(id) {
          this.updateGroup({
            "group_id": id,
            "group_name": name,
            "members": [],
          })
        }
      })
    },
    showCurrentGroupId(id) {
      console.log(this.currentSelectedUids)
      if(!this.currentGroupId || this.currentGroupId !== id) {
        this.currentGroupId = id
      } else {
        this.currentGroupId = ''
      }
    },
    changeSelected(id){
      console.log(id)
      const index = this.currentSelectedUids.indexOf(id)
      if(index > -1) {
        this.currentSelectedUids.splice(index, 1)
      } else {
        this.currentSelectedUids.push(id)
      }
      this.$forceUpdate()
    },
    changeGroupUsers() {
      console.log(this.currentSelectedUids)
      updateGroupMember(this.currentGroupId, this.currentSelectedUids).then(() => {
        this.updateGroup({
          "group_id": this.currentGroupId,
          "members": this.currentSelectedUids.map(item => {
            return {
              user_id: item
            }
          }),
        })
        this.currentGroupId = ''
      })
    },
    bianji(item) {
      this.currentGroupInfo = JSON.parse(JSON.stringify(item))
      this.innerVisible = true
    },
    hideBianji() {
      this.innerVisible = false
      this.currentGroupInfo = {
        group_name: '',
        group_id: ''
      }
    },
    updateName() {
      updateGroupName(this.currentGroupInfo.group_name, this.currentGroupInfo.group_id)
      .then(() => {
        this.updateGroup({
          ...this.currentGroupInfo,
          "members": this.currentSelectedUids.map(item => {
            return {
              user_id: item
            }
          }),
        })
        this.hideBianji()
      })
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
  padding: 20px 0;
}
.scroll-content{
  max-height: 350px;
  overflow-y: scroll;
  width: 100%;
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
.fzTitle{
  width: 100%;
  height: 60px;
  background-color: rgba(246, 247, 249, 1);
}
.fzTitleInner{
  width: 93%;
  display: flex;
  justify-content: space-between;
  height: 60px;
  align-items: center;
  position: relative;
  margin: 0 auto;
}
.titleIcon{
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.groupType{
  width: 100%;
  height: 22px;
}
.groupRadio{
  padding-left: 32px;
  height: 22px;
  position: relative;
}
.groupRadioicon{
  position: absolute;
  top: 0;
  left: 0;
  height: 22px;
  width: 22px;
  border-radius: 22px;
  border: 1px solid rgba(215, 215, 215, 1);
  box-sizing: border-box;
  cursor: pointer;
}
.groupRadioicon.selected{
  border-color: rgba(21, 195, 154, 1);
}
.groupRadioicon.selected::before{
  content: ' ';
  position: absolute;
  height: 12px;
  width: 12px;
  background-color: rgba(21, 195, 154, 1);
  border-radius: 12px;
  top: 4px;
  left: 4px;
}
.groupTextInfo{
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #11142D;
}
.addGroup{
  cursor: pointer;
  display: flex;
  height: 50px;
  align-items: center;
  padding-left: 20px;
  margin: 20px 0;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: rgba(228, 228, 228, 0.2);
}
.groupSection{
  width: 100%;
  margin-bottom: 20px;
  min-height: 114px;
  background-color: rgba(228, 228, 228, 0.2);
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0 26px 15px 14px;
}
.groupName{
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  font-weight: bolder;
  color: #323232;
  text-align: left;
}
.groupSelect{
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #15C39A;
  opacity: 1;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  padding: 0 17px;
  align-items: center;
  font-size: 12px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
  cursor: pointer;
}
.groupSelectBox{
  background-color: #fff;
  border: 1px solid #DCDCDC;
  border-radius: 2px;
  min-height: 100px;
}
.useritem{
  width: 100%;
  height: 34px;
  display: flex;
  padding: 0 15px 0 44px;
  box-sizing: border-box;
  justify-content: space-between;
  cursor: pointer;
  align-items: center;
}
.useritem.disable{
  cursor: default;
  background-color: rgba(228, 228, 228, 1);
}
.bianji{
  width: 14px;
  height: 13px;
  margin-left: 5px;
  cursor: pointer;
}
</style>