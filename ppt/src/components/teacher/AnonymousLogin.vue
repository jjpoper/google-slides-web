<template>
  <el-card @click.native="hiddenTagInputPopover">
    <el-row type="flex">
      <el-col :span="7" class="login-col">
        <div class="login-logo">
          <img src="../../assets/picture/invite_icon.png" class="login-img" />
        </div>
      </el-col>
      <el-col :span="16">
        <div @click="closeBtn" class="common-close-btn"></div>
        <div class="login-main-content">
          <div class="login-header">
            <el-row  type="flex" justify="start">
              <el-col :offset="7" :span="15">
                <div class="main-title">Invite students to study</div>
                <div class="sub-title">Join joincp.com</div>
                <div class="invite-code">{{ getPass }}</div>
              </el-col>
            </el-row>
          </div>
          <div class="login-form">
            <el-row type="flex" class="form-item" justify="start" align="middle">
              <el-col :span="7">
                <div class="form-label">Session name</div>
              </el-col>
              <el-col :span="16">
                <el-input
                  size="medium"
                  class="my-login-input"
                  placeholder="Unnamed session"
                  @blur="changeName"
                  v-model="className"
                  clearable>
                </el-input>
              </el-col>
            </el-row>

            <el-row type="flex" class="form-item" justify="start" align="middle">
              <el-col :span="7">
                <div class="form-label">Choose class</div>
              </el-col>
              <el-col :span="16">
                <input-with-tag ref="tagInput" :options="roomItems" @select-or-create-option="selectOrCreateRoom"/>
              </el-col>
            </el-row>

            <el-row type="flex" class="form-item" justify="start" align="middle">
              <el-col :span="7">
                <div class="form-label">Schedule the session</div>
                <div class="my-login-switch">
                  <el-switch
                    @change="scheduleSessionChange"
                    v-model="scheduleSessionFlag"
                    active-color="#15C39A">
                  </el-switch>
                </div>
              </el-col>
              <el-col :span="16">
                <el-row :gutter="10">
                  <el-col :span="10">
                    <el-date-picker
                      :disabled="!scheduleSessionFlag"
                      class="my-login-input"
                      prefix-icon="el-icon-date"
                      v-model="sessionStartTime"
                      type="date"
                      format="yyyy-MM-dd"
                      :picker-options="pickerOptionsStart"
                      placeholder="Start time">
                    </el-date-picker>
                  </el-col>
                  <el-col :span="7">
                    <el-select v-model="sessionHour" :disabled="!scheduleSessionFlag" placeholder="hour"  class="my-login-input">
                      <el-option
                        v-for="item in sessionHourOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled">
                      </el-option>
                    </el-select>

                  </el-col>
                  <el-col :span="7">
                    <el-select v-model="sessionMinute" :disabled="!scheduleSessionFlag" placeholder="minute" class="my-login-input">
                      <el-option
                        v-for="item in sessionMinuteOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        :disabled="item.disabled">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>


            <el-row type="flex" class="form-item" justify="start" align="start">
              <el-col :span="7">
                <div class="form-label">Allocated time</div>
                <div class="my-login-switch">
                  <el-switch
                    @change="allocatedTimeChange"
                    v-model="allocatedTimeFlag"
                    active-color="#15C39A">
                  </el-switch>
                </div>
              </el-col>
              <el-col :span="16">
                <el-select
                  :disabled="!allocatedTimeFlag"
                  v-model="time_type"
                  class="my-login-input"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div class="allocate-time" v-show="allocatedTimeFlagVisible">
                  <div class="allocate-tips">
                    <el-alert
                      title="Students must complete their work within the allocated time"
                      type="error">
                    </el-alert>
                  </div>
                  <div class="time-type count-down" v-if="time_type === 2">
                    <el-select
                      v-model="time_down"
                      placeholder="--Select--"
                      class="my-login-input"
                    >
                      <el-option
                        v-for="item in timeCounts"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="time-type dead-line"  v-if="time_type === 1">

                    <el-row :gutter="10">
                      <el-col :span="10">
                        <el-date-picker
                          class="my-login-input"
                          prefix-icon="el-icon-date"
                          v-model="allocateTime"
                          type="date"
                          format="yyyy-MM-dd"
                          :picker-options="pickerOptionsStart"
                          placeholder="Start time">
                        </el-date-picker>
                      </el-col>
                      <el-col :span="7">
                        <el-select v-model="allocateHour" placeholder="hour"  class="my-login-input">
                          <el-option
                            v-for="item in allocateHourOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                          </el-option>
                        </el-select>

                      </el-col>
                      <el-col :span="7">
                        <el-select v-model="allocateMinute" placeholder="minute" class="my-login-input">
                          <el-option
                            v-for="item in allocateMinuteOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                          </el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-col>
            </el-row>

            <el-row type="flex" class="form-item" justify="start" align="middle">
              <el-col :span="7">
                <div class="form-label">
                  <el-switch
                    :disabled="!allowEditAnonymous"
                    v-model="canAnonymous"
                    active-color="#15C39A">
                  </el-switch>
                </div>
              </el-col>
              <el-col :span="16">
                <div class="login-setting-content">
                  <div class="main-tips">
                    Logins setting
                  </div>
                  <div class="sub-tips">
                    Turn on to require students to join with their email/ID Turn off to allow anonymous logins
                  </div>
                </div>
              </el-col>
            </el-row>

            <el-row type="flex" class="form-item" justify="start" align="middle">
              <el-col :span="7">
              </el-col>
              <el-col :span="16">
                <el-row type="flex" justify="start" align="start">
                  <el-col :span="24">
                    <div class="login-action">
                      <div class="copy-link" @click="onCopyLink">
                        <div class="copy-link-icon">
                          <img src="../../assets/picture/link_icon.png" />
                        </div>
                        <div class="copy-link-text">copy link</div>
                      </div>
                      <div class="continue">
                        <el-button type="primary" class="login-button" @click="saveLoginSetting">Continue<i class="el-icon-right el-icon--right"></i></el-button>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>



<script>
import {
  addRealClass, getClassSet,
  getRealClass,
  renameClass,
  saveClassSet,
} from "../../model/index";
import inputWithTag from "@/components/common/inputWithTag";
import moment from 'moment'
export default {
  props: {
    copyLink: {
      type: Function,
    },
    url: {
      type: String,
      default: "",
    },
    enterClassroom: {
      type: Function,
    },
    closeBtn: {
      type: Function,
    },
    hindeTimeDialog: {
      type: Function,
    },
    changeRoomName: {
      type: Function,
    },
    user_id: {
      type: String,
      default: "",
    },
    classRoomInfo: {
      type: Object,
      default: () => {},
    },
  },

  components: {
    inputWithTag
  },
  data() {
    return {
      canAnonymous: true,
      room: "--Select--",
      newRoomName: "",
      currentRoomId: -1,
      inputDialog: false,
      roomItems: [],
      show_url: "",
      time_type: 0,
      deadline: "",
      options: [
        {
          value: 0,
          label: "--Select--",
        },
        {
          value: 1,
          label: "Deadline mode",
        },
        {
          value: 2,
          label: "Countdown mode",
        },
      ],
      time_down: 0,
      timeCounts: [
        { value: 15, label: "15  min" },
        { value: 30, label: "30  min" },
        { value: 45, label: "45  min" },
        { value: 60, label: "60  min" },
        { value: 70, label: "70  min" },
      ],
      pickerOptionsStart: {
        disabledDate: (time) => {
          return time.getTime() < (new Date().getTime() - 8.64e7);
        },
      },
      className: '',

      scheduleSessionFlag: false,
      sessionStartTime: null,
      allocatedTimeFlag: false,
      allocateTime: null,
      allocatedTimeFlagVisible: false,
      sessionHour: 0,
      sessionMinute: 0,
      sessionHourOptions: [],
      sessionMinuteOptions: [],

      allocateHour: 0,
      allocateMinute: 0,
      allocateHourOptions: [],
      allocateMinuteOptions: [],

      rawClassSet: null,
      allowEditAnonymous: true,
    };
  },
  created() {
    let index = this.url.indexOf("?");
    if (index > -1) {
      this.show_url = this.url.substring(0, index);
    } else {
      this.show_url = this.url;
    }

    this.initSessionHourOptions();
    this.initSessionMinuteOptions()
    this.initAllocateHourOptions()
    this.initAllocateMinuteOptions()

    getRealClass(this.user_id).then((res) => {
      console.log('roomItems', res);
      this.roomItems = res;
    }).then(() => {

      // 获取班级列表后开始加载配置数据
      let classId = this.show_url.substring(this.show_url.lastIndexOf("/") + 1);
      getClassSet(classId).then(res => {
        console.log('rawClassSet', res)
        this.rawClassSet = res
        if(res.can_anonymous_sign_in === null) {
          this.allowEditAnonymous = true
          this.canAnonymous = true
        }else {
          this.allowEditAnonymous = false
          this.canAnonymous = !!res.can_anonymous_sign_in
        }
        console.log('allowEditAnonymous ' + this.allowEditAnonymous)

        // 如果老师不起名字，就默认叫session1,2,3 of "task的名字"(就看老师在这个task上面开启了多少次未命名的课堂），如果老师给session命名了，那就变成session name
        let historySessionNum = res.history_session_num ? parseInt(res.history_session_num) + 1 : 1
        this.className = ['Unnamed session', 'unnamed', '', undefined, null].indexOf(this.classRoomInfo.class_name) !== -1 ? `Session ${historySessionNum} of ${res.file_name}` : res.file_name
        this.classRoomInfo.class_name = this.className
        if(res.real_class_id) {
          let room = this.roomItems.find(item => item.id === res.real_class_id)
          this.newRoomName = room ? room.name : null
          this.currentRoomId = res.real_class_id
        }
        this.scheduleSessionFlag = !!res.schedule_session_flag
        if(res.session_start_time) {
          this.sessionStartTime = moment(res.session_start_time).toDate()
          this.sessionHour = this.sessionStartTime.getHours()
          this.sessionMinute = this.sessionStartTime.getMinutes()
          console.log(this.sessionStartTime, 'sessionHour ' + this.sessionHour + ' sessionMinute ' + this.sessionMinute, this.sessionStartTime)
        }

        this.allocatedTimeFlag = !!res.allocated_time_flag
        // deadline
        if(res.time_type) {
          this.time_type = res.time_type
        }
        if(res.deadline) {
          this.allocateTime = moment(res.deadline).toDate()
          this.allocateHour = this.allocateTime.getHours()
          this.allocateMinute = this.allocateTime.getMinutes()
          console.log(this.allocateTime, 'allocateHour ' + this.allocateHour + ' allocateMinute ' + this.allocateMinute, this.allocateTime)
        }

        // countdown
        if(res.time_type === 2) {
          this.time_down = res.time_down
          this.deadline = null
        }

        // 避免watch赋值覆盖，定时器延迟执行赋值
        setTimeout(() => {
          console.log('set hour and minute!', this.sessionStartTime, this.allocateTime)
          if(this.sessionStartTime) {
            this.sessionHour = this.sessionStartTime.getHours()
            setTimeout(() => {
              this.sessionMinute = this.sessionStartTime.getMinutes()
            }, 100)
            console.log('mounted sessionHour ' + this.sessionHour + ' sessionMinute ' + this.sessionMinute, this.sessionStartTime)
          }

          if(this.allocateTime) {
            this.allocateHour = this.allocateTime.getHours()
            this.allocateMinute = this.allocateTime.getMinutes()
            console.log('mounted allocateHour ' + this.allocateHour + ' allocateMinute ' + this.allocateMinute, this.allocateTime)
          }
        }, 100)

      });
    })
  },
  watch: {
    time_type(v) {
      console.log(this.time_type);
      if (this.time_type === 0) {
        this.setDeadLine();
        this.allocatedTimeFlagVisible = false
      }else {
        this.allocatedTimeFlagVisible = true
      }
    },
    time_down() {
      console.log(this.time_down);
      if (this.time_type == 2) {
        this.setDeadLine();
      }
    },
    sessionStartTime(v) {
      let today = new Date()
      if(v && today.getFullYear() === v.getFullYear() && today.getMonth() === v.getMonth() && today.getDay() === v.getDay()) {
          // 限制小时与分钟
        this.sessionHour = 0
        this.sessionMinute = 0
        console.log('sessionStartTime today', v)
        let hourOptions = [];
        for (let i = 0; i < 24; i++) {
          hourOptions.push({
            value: i,
            label: i < 10 ? "0" + i : i,
            disabled: i < today.getHours()
          });
        }
        this.sessionHourOptions = hourOptions;
      }else {
        this.initSessionHourOptions()
      }
      this.initSessionMinuteOptions()
    },

    sessionHour (v) {
      console.log('sessionHour', v)
      let today = new Date()
      let selectDay = this.sessionStartTime
      if(selectDay && today.getFullYear() === selectDay.getFullYear() && today.getMonth() === selectDay.getMonth() && today.getDay() === selectDay.getDay()) {
          if(v === today.getHours()) {
            this.sessionMinute = 0
            let minuteOptions = [];
            for (let i = 0; i < 60; i++) {
              minuteOptions.push({
                value: i,
                label: i < 10 ? "0" + i : i,
                disabled: i < today.getMinutes() + 15
              });
            }
            this.sessionMinuteOptions = minuteOptions;
          }else{
            this.initSessionMinuteOptions()
          }
      }else{
        this.initSessionMinuteOptions()
      }
    },

    allocateTime(v) {
      // 日期选择范围筛选
      let today = new Date()
      if(v && today.getFullYear() === v.getFullYear() && today.getMonth() === v.getMonth() && today.getDay() === v.getDay()) {
        // 限制小时与分钟
        this.allocateHour = 0
        this.allocateMinute = 0
        console.log('deadline today', v)
        let hourOptions = [];
        for (let i = 0; i < 24; i++) {
          hourOptions.push({
            value: i,
            label: i < 10 ? "0" + i : i,
            disabled: i < today.getHours()
          });
        }
        this.allocateHourOptions = hourOptions;
      }else {
        this.initAllocateHourOptions()
      }
    },
    allocateHour (v) {
      console.log('allocateHour', v)
      let today = new Date()
      let selectDay = this.allocateTime
      if(selectDay && today.getFullYear() === selectDay.getFullYear() && today.getMonth() === selectDay.getMonth() && today.getDay() === selectDay.getDay()) {
        if(v === today.getHours()) {
          this.allocateMinute = null
          let minuteOptions = [];
          for (let i = 0; i < 60; i++) {
            minuteOptions.push({
              value: i,
              label: i < 10 ? "0" + i : i,
              disabled: i < today.getMinutes() + 15
            });
          }
          this.allocateMinuteOptions = minuteOptions;
        }else{
          this.initAllocateMinuteOptions()
        }
      }else{
        this.initAllocateMinuteOptions()
      }
    }
  },
  computed: {
    getPass() {
      return this.show_url.substring(this.show_url.lastIndexOf("/") + 1);
    },
  },
  methods: {
    anonymousBtnClicked() {
      this.canAnonymous = !this.canAnonymous;
    },
    setDeadLine() {
      console.log("setDeadLine", this.time_type);
      this.hindeTimeDialog(this.time_type, this.deadline, this.time_down);
    },
    onCopyLink () {
      this.copyLink(this.canAnonymous);
    },
    saveLoginSetting() {
      // 设置deadline时间
      let deadline = this.allocateTime
      let deadlineStr = null
      console.log('this.allocateTime', this.allocateTime)
      if(deadline) {
        deadline.setHours(this.allocateHour)
        deadline.setMinutes(this.allocateMinute)
        deadlineStr = moment.utc(this.allocateTime).local().format('YYYY-MM-DD HH:mm:ss')
        console.log('new deadline', deadline)
        this.deadline = deadline
      }

      let sessionStartTime = this.sessionStartTime
      let sessionStartTimeStr = null
      if(sessionStartTime) {
        sessionStartTime.setHours(this.sessionHour)
        sessionStartTime.setMinutes(this.sessionMinute)
        sessionStartTimeStr = moment.utc(this.sessionStartTime).local().format('YYYY-MM-DD HH:mm:ss')
        console.log('new sessionStartTime', sessionStartTime)
      }

      saveClassSet(
        this.show_url.substring(this.show_url.lastIndexOf("/") + 1),
        this.className,
        this.currentRoomId,
        this.scheduleSessionFlag,
        sessionStartTimeStr,
        this.allocatedTimeFlag,
        this.time_type,
        this.time_down,
        deadlineStr,
        this.canAnonymous ? 1 : 0,
      ).then((res) => {
        this.closeBtn()
        this.setDeadLine();
      });
    },
    createNewRoomConfirm() {
      if (!this.newRoomName || this.newRoomName.length < 1) {
        this.$message.error("Please input a name!");
        return;
      }
      addRealClass(this.user_id, this.newRoomName).then((res) => {
        console.log(res);
        if (res.code === "ok") {
          this.room = this.newRoomName;
          var roomItem = {};
          roomItem.name = this.newRoomName;
          roomItem.id = res.data;
          this.currentRoomId = roomItem.id
          this.roomItems.push(roomItem);
          this.$message.success("Create new class successfully!");
        }
      });
    },
    changeName() {
      if(this.className !== this.classRoomInfo.class_name) {
        renameClass(this.className, this.classRoomInfo.class_id)
        .then(() => {
          this.changeRoomName(this.className)
        })
      }
    },

    selectOrCreateRoom (roomName) {
      console.log('selectOrCreateRoom', roomName, this.roomItems)
      // 按下回车时data为用户输入的文字，或者选中的选项的id，如果名称相同或者id相同，则不创建新班级
      let rootItem = this.roomItems.find(item => item.name === roomName)
      console.log('select roomItem', rootItem)
      if(!rootItem) {
        // 新建班级
        this.newRoomName = roomName
        this.createNewRoomConfirm()
      }else {
        this.newRoomName = rootItem.name
        this.currentRoomId = rootItem.id
      }
    },

    initSessionHourOptions () {
      let hourOptions = [];
      for (let i = 0; i < 24; i++) {
        hourOptions.push({
          value: i,
          label: i < 10 ? "0" + i : i,
          disabled: false
        });
      }
      this.sessionHourOptions = hourOptions;
    },

    initSessionMinuteOptions () {
      let minuteOptions = [];
      for (let i = 0; i < 60; i++) {
        minuteOptions.push({
          value: i,
          label: i < 10 ? "0" + i : i,
          disabled: false
        });
      }
      this.sessionMinuteOptions = minuteOptions;
    },

    initAllocateHourOptions () {
      let hourOptions = [];
      for (let i = 0; i < 24; i++) {
        hourOptions.push({
          value: i,
          label: i < 10 ? "0" + i : i,
          disabled: false
        });
      }
      this.allocateHourOptions = hourOptions;
    },
    initAllocateMinuteOptions () {
      let minuteOptions = [];
      for (let i = 0; i < 60; i++) {
        minuteOptions.push({
          value: i,
          label: i < 10 ? "0" + i : i,
          disabled: false
        });
      }
      this.allocateMinuteOptions = minuteOptions;
    },
    scheduleSessionChange (newFlag) {
      console.log('scheduleSessionChange ' + newFlag)
      if(!newFlag) {
        this.sessionStartTime = null
        this.sessionHour = 0;
        this.sessionMinute = 0
      }
    },

    allocatedTimeChange (newFlag) {
      console.log('allocatedTimeChange ' + newFlag)
      if(!newFlag) {
        this.time_type = 0;
        this.time_down = 0;
        this.allocateTime = null
        this.allocateHour = 0
        this.allocateMinute = 0
      }
    },

    hiddenTagInputPopover () {
      this.$refs.tagInput.hiddenPoppers()
    }
  },
};
</script>

<style scoped>
  .login-col {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .login-img {
    width: 100%;
    margin-right: -35px;
  }

  .common-close-btn {
    top: 10px;
  }

  .login-main-content {
    margin-top: 10px;
  }

  .main-title {
    font-size: 24px;
    font-family: Trebuchet MS;
    font-weight: 400;
    line-height: 30px;
    color: #070707;
    text-align: left;
    user-select: none;
  }

  .sub-title {
    text-align: left;
    font-size: 16px;
    font-family: Arial;
    font-weight: 400;
    line-height: 25px;
    color: #070707;
    user-select: none;
  }

  .invite-code {
    text-align: left;
    font-size: 50px;
    font-family: FZCuYuan-M03S;
    font-weight: 400;
    line-height: 80px;
    color: #15c39a;
    padding-bottom: 10px;
    user-select: all;
    cursor: pointer;
    border-radius: 50px;
  }

  .invite-code::selection {
    background: #15c39a;
    color: #fff;
  }

  .form-label {
    text-align: right;
    vertical-align: middle;
    font-family: Arial;
    font-weight: bold;
    color: #000000;
    padding-right: 15px;
    box-sizing: border-box;
    user-select: none;
  }

  .my-login-input {
    border-radius: 6px;
    border: 1px solid #D8D8D8;
    cursor: pointer;
    width: 100%;
  }

  .my-login-input:hover {
    border-color: #15c39a;
  }

  .form-item {
    margin-bottom: 20px;
  }

  .login-button {
    background: #15C39A;
    border-color: #15C39A;
  }

  .login-setting-content {
    text-align: left;
  }

  .main-tips {
    font-size: 15px;
    font-family: Trebuchet MS;
    font-weight: 600;
    color: #070707;
    line-height: 25px;
  }

  .sub-tips {
    padding: 5px 0;
    font-size: 14px;
    font-family: Arial;
    font-weight: 500;
    line-height: 18px;
  }

  .login-action {
    display: flex;
    margin-left: -8px;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .copy-link {
    width: 70px;
    cursor: pointer;
  }

  .copy-link-icon img {
    width: 45px;
  }

  .copy-link-text {
    font-family: Inter-Bold;
    line-height: 24px;
    color: #989DA1;
  }

  .continue {
    text-align: left;
    padding-left: 25px;
  }

  .my-login-switch {
    text-align: right;
    padding-top: 5px;
    padding-right: 15px;
  }

  .allocate-tips {
    margin-top: 10px;
    text-align: left;
    margin-bottom: 10px;
  }
</style>
