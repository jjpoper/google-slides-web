<template>
  <el-card class="class-room-roster">
    <div class="roster-header">
      <div class="roster-title">
        Classroom Roster
      </div>
      <div class="roster-split">-</div>
      <div class="roster-class-select">
        <el-select size="mini" v-model="selectedClassId" placeholder="Select class name list">
          <el-option
            v-for="item in classList"
            :key="item.value"
            :value="item.value"
            :label="item.label">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="roster-tabs">
      <div class="roster-tabs-toggle">
        <div :class="{'roster-tabs-item': true, 'roster-active-tab': activeTab === 'student'}" @click="activeTab = 'student'">
          Students ({{ studentsTotalNum }})
          <div class="roster-tabs-bottom"></div>
        </div>
        <div :class="{'roster-tabs-item': true, 'roster-active-tab': activeTab === 'teacher'}" @click="activeTab = 'teacher'">
          Teachers ({{ teachersTotalNum }})
          <div class="roster-tabs-bottom"></div>
        </div>
      </div>
    </div>
    <div class="roster-detail">
      <div class="roster-detail-list student-list" v-show="activeTab === 'student'">
        <div class="roster-detail-header">
          <el-row :gutter="5">
            <el-col :span="5">
              <div class="roster-detail-header-item">
                Name
              </div>
            </el-col>
            <el-col :span="3">
              <div class="roster-detail-header-item">
                Status
              </div>
            </el-col>
            <el-col :span="3">
              <div class="roster-detail-header-item ">
                Attendance
              </div>
            </el-col>
            <el-col :span="3">
              <div class="roster-detail-header-item" @click="changeGroupSort">
                Group
                <div class="sort-icon">
                  <template v-if="sortAsc">
                    <i class="el-icon-arrow-down"></i>
                  </template>
                  <template v-if="!sortAsc">
                    <i class="el-icon-arrow-up"></i>
                  </template>
                </div>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="roster-detail-header-item ">
                Email
              </div>
            </el-col>
            <el-col :span="5">
              <div class="roster-detail-header-action ">
                <div class="roster-header-action-item">
                  <div class="roster-action-text">
                    Sort by Time
                  </div>
                  <div class="roster-action-icon">
                    <img src="../../assets/icon/sort.png"/>
                  </div>
                </div>
                <div class="roster-header-action-setting">
                  <i class="el-icon-s-tools"></i>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="roster-detail-body">
          <div class="roster-detail-item" :class="{'online-user': onlineUserIdList.includes(student.userId), 'offline-user': !onlineUserIdList.includes(student.userId)}" v-for="student in studentList">
            <el-row :gutter="5">
              <el-col :span="5">
                <div class="roster-detail-data-item">
                  <img :src="student.avatar" alt="" v-if="student.avatar" class="student-avatar">
                  <img src="../../assets/icon/avatar.png" alt="" v-if="!student.avatar"
                       class="student-avatar">
                  <div class="student-name" :class="{'duplicated-name': duplicatedUserNameList.includes(student.name)}">
                    {{ student.name }}
                  </div>
                </div>
              </el-col>
              <el-col :span="3">
                <div class="roster-detail-data-item">
                  {{student.status}}
                </div>
              </el-col>
              <el-col :span="3">
                <div class="roster-detail-data-item" :class="{'absent-student': student.attendance === 'Absent'}" @click="handleToggleAttendance(student)">
                  <div class="student-attendance">{{student.attendance}}</div>
                </div>
              </el-col>
              <el-col :span="3">
                <div class="roster-detail-data-item ">
                  <div class="roster-change-group">
                    <select v-model="student.groupId">
                      <option v-for="group in groupList" :value="group.id">
                        {{ group.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="roster-detail-data-item ">
                  {{ student.email }}
                </div>
              </el-col>
              <el-col :span="5">
                <div class="roster-detail-data-action ">
                  <div class="roster-data-action roster-evaluate">
                    Evaluate
                  </div>
                  <div class="roster-data-action roster-block">
                    Block
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="roster-detail-list teacher-list" v-show="activeTab === 'teacher'">
        <div class="roster-detail-header">
          <el-row :gutter="5">
            <el-col :span="6">
              <div class="roster-detail-header-item">
                Name
              </div>
            </el-col>
            <el-col :span="4">
              <div class="roster-detail-header-item">
                Status
              </div>
            </el-col>
            <el-col :span="8">
              <div class="roster-detail-header-item ">
                Email
              </div>
            </el-col>
            <el-col :span="6">
              <div class="roster-detail-header-action ">
                <div class="roster-header-action-item">
                  <div class="roster-action-text">
                    Sort by Time
                  </div>
                  <div class="roster-action-icon">
                    <img src="../../assets/icon/sort.png"/>
                  </div>
                </div>
                <div class="roster-header-action-setting">
                  <i class="el-icon-s-tools"></i>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="roster-detail-body">
          <div class="roster-detail-item" :class="{'online-user': onlineUserIdList.includes(teacher.userId), 'offline-user': !onlineUserIdList.includes(teacher.userId)}" v-for="teacher in teacherList">
            <el-row :gutter="5">
              <el-col :span="6">
                <div class="roster-detail-data-item">
                  <img :src="teacher.avatar" alt="" v-if="teacher.avatar" class="student-avatar">
                  <img src="../../assets/icon/avatar.png" alt="" v-if="!teacher.avatar"
                       class="student-avatar">
                  <div class="student-name" :class="{'duplicated-name': duplicatedUserNameList.includes(teacher.name)}">
                    {{ teacher.name }}
                  </div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="roster-detail-data-item">
                  {{teacher.status}}
                </div>
              </el-col>

              <el-col :span="8">
                <div class="roster-detail-data-item ">
                  {{ teacher.email }}
                </div>
              </el-col>
              <el-col :span="6">
                <div class="roster-detail-data-action ">
                  <div class="roster-data-action roster-evaluate">

                  </div>
                  <div class="roster-data-action roster-block">

                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div class="roster-group-setting">
      <div class="group-setting-button">
        Group setting
      </div>
    </div>
  </el-card>
</template>

<script>

export default {
  name: "ClassroomRoster",
  data() {
    return {
      // TODO 测试数据，待置为空数组
      classList: [
        {value: 1, label: 'Class 1'},
        {value: 2, label: 'Class 2'},
        {value: 3, label: 'Class 3'},
      ],
      selectedClassId: "",
      activeTab: 'student',
      studentsTotalNum: 15,
      teachersTotalNum: 15,
      studentList: [
        {
          userId: '1',
          avatar: null,
          name: 'xunwu1',
          status: 'Online',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '1',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        },
        {
          userId: '1',
          avatar: null,
          name: 'xunwu1',
          status: 'Online',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '1',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        },
        {
          userId: '1',
          avatar: null,
          name: 'xunwu1',
          status: 'Online',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '1',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        },
        {
          userId: '1',
          avatar: null,
          name: 'xunwu1',
          status: 'Online',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '1',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        },
        {
          userId: '1',
          avatar: null,
          name: 'xunwu1',
          status: 'Online',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '1',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        },
        {
          userId: '2',
          avatar: null,
          name: 'xunwu2',
          status: 'Offline',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '1',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        },
        {
          userId: '3',
          avatar: null,
          name: 'xunwu2',
          status: 'Online',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '2',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        },
        {
          userId: '4',
          avatar: null,
          name: 'xunwu3',
          status: 'Offline',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '2',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        }
      ],

      teacherList: [
        {
          userId: '1',
          avatar: null,
          name: 'xunwu1',
          status: 'Online',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '1',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        },
        {
          userId: '1',
          avatar: null,
          name: 'xunwu1',
          status: 'Online',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '1',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        },
        {
          userId: '1',
          avatar: null,
          name: 'xunwu1',
          status: 'Online',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '1',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        },
        {
          userId: '1',
          avatar: null,
          name: 'xunwu1',
          status: 'Online',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '1',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        },
        {
          userId: '1',
          avatar: null,
          name: 'xunwu1',
          status: 'Online',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '1',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        },
        {
          userId: '2',
          avatar: null,
          name: 'xunwu2',
          status: 'Offline',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '1',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        },
        {
          userId: '3',
          avatar: null,
          name: 'xunwu2',
          status: 'Online',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '2',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        },
        {
          userId: '4',
          avatar: null,
          name: 'xunwu3',
          status: 'Offline',
          attendance: 'Present',
          groupName: 'Group 1',
          groupId: '2',
          email: "xunwu@gmail.com",
          joinTime: new Date().getTime(),
        }
      ],
      onlineUserIdList: ['1', '3', '5'],
      groupList: [
        {id: '1', name: 'Group 1'},
        {id: '2', name: 'Group 2'},
        {id: '3', name: 'Group 3'},
      ],
      duplicatedUserNameList: ['xunwu2'],

      sortAsc: true
    }
  },
  methods: {
    handleToggleAttendance (student) {
      if(student.attendance === 'Present') {
        student.attendance = 'Absent'
      }else {
        student.attendance = 'Present'
      }
    },

    changeGroupSort () {
      this.sortAsc = !this.sortAsc;
    }
  },
}
</script>

<style scoped>

.roster-header {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 40px;
}

.roster-title {
  font-size: 18px;
  font-family: Segoe UI;
  font-weight: bold;
  line-height: 20px;
  color: #000000;
}
.roster-split {
  padding: 0 8px;
  font-size: 18px;
  font-family: Segoe UI;
  font-weight: bold;
  line-height: 20px;
  color: #000000;
}

.roster-class-select {
}

.roster-class-select {
  cursor: pointer;
  line-height: 30px;
  background: #F5F5F5;
  border-radius: 4px;
  border: none;
}

.roster-tabs {
  padding: 25px 0 20px 0;
  line-height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.roster-tabs-toggle {
  display: flex;
  justify-content: center;
  align-items: center;
}

.roster-tabs-item {
  padding: 0 10px;
  cursor: pointer;
  font-size: 16px;
  font-family: FZCuYuan-M03S;
  font-weight: bold;
  line-height: 25px;
}

.roster-tabs-bottom {
  height: 4px;
  border-radius: 2px;
  background: #fff;
  width: 70%;
  margin: auto;
}

.roster-active-tab {
  color: #15C39A;
}

.roster-active-tab  .roster-tabs-bottom {
  background: #15C39AFF;
}

.roster-detail-header {
  background: rgba(228, 228, 228, 0.2);
  color: #000;
}

.roster-detail-header-item {
  font-family: Segoe UI;
  font-weight: bold;
  color: #000000;
  padding: 0 10px;
  line-height: 50px;
  display: flex;
  align-items: center;
}

.sort-icon {
  padding-left: 3px;
}

.roster-detail-header-action {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}

.roster-header-action-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Segoe UI;
  line-height: 25px;
  padding: 0 10px;
  color: #000000;
  border-radius: 4px;
}

.roster-header-action-item:hover {
  background: rgba(228, 228, 228, 0.8);
}

.roster-action-text {
  padding-right: 5px;
  cursor: pointer;
  user-select: none;
}

.roster-action-icon img {
  height: 12px;
}

.roster-header-action-setting {
  margin-left: 5px;
  height: 25px;
  padding: 0 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.roster-header-action-setting:hover {
  background: rgba(228, 228, 228, 0.8);
}

.roster-detail-item {
  border-bottom: 1px solid #D8D8D8;
}

.roster-detail-item:hover {
  background: #FAFAFA;
}

.roster-detail {
  border: 1px solid #D8D8D8;
}

.roster-detail-data-item {
  cursor: pointer;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 10px;
}

.student-avatar {
  height: 30px;
}

.student-name {
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 0px;
  color: #000000;
  padding-left: 10px;
}

.roster-change-group select {
  border: none;
  color: #000;
}

.student-attendance {
  padding: 0 8px;
  user-select: none;
}

.absent-student  .student-attendance {
  color: #D9001BFF;
  background: #fff;
  border: 1px solid #D8D8D8;
  border-radius: 3px;
  user-select: none;
  padding: 4px 8px;
}

.offline-user {
  filter: grayscale(100%);
  opacity: 0.3;
}

.roster-detail-data-action {
  display: flex;
  height: 50px;
  padding-left: 8px;
  cursor: pointer;
  user-select: none;
  align-items: center;
}

.roster-data-action {
  padding: 0 5px;
}

.roster-evaluate {
  font-family: PingFang SC;
  font-weight: 400;
  color: #15C39A;
}

.roster-block {
  font-family: PingFang SC;
  font-weight: 400;
  color: #E0001B;
}

.roster-detail-body {
  height: 355px;
  overflow-y: auto;
}

*::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
*::-webkit-scrollbar-track {
  border-radius: 3px;
  background: rgba(0,0,0,0.00);
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
}
/* 滚动条滑块 */
*::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: rgba(0,0,0,0.12);
  -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
}

.roster-group-setting {
  padding: 20px 0 10px 0;
  justify-content: flex-end;
  display: flex;
}

.group-setting-button {
  cursor: pointer;
  user-select: none;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  border-radius: 30px;
  background: #FAFAFA;
  border: 1px solid #D8D8D8;
  font-size: 13px;
  font-family: Inter-Bold;
  color: #15C39A;
}
</style>
