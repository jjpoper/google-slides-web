<template>
  <el-card>
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
              <el-col offset="7" span="15">
                <div class="main-title">Invite students to study</div>
                <div class="sub-title">Join at classcipe.com</div>
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
                <div class="form-label">Schedule the session</div>
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
                <div class="form-label">Allocated time</div>
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
                <div class="form-label">
                  <el-switch
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
                  <el-col span="24">
                    <div class="login-action">
                      <div class="copy-link">
                        <div class="copy-link-icon">
                          <img src="../../assets/picture/link_icon.png" />
                        </div>
                        <div class="copy-link-text">copy link</div>
                      </div>
                      <div class="continue">
                        <el-button type="primary" class="login-button">Continue<i class="el-icon-right el-icon--right"></i></el-button>
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
import { addRealClass, getRealClass, renameClass, setRealClass } from "../../model/index";
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
  data() {
    return {
      canAnonymous: false,
      room: "--Select--",
      newRoomName: "",
      currentRoomId: -1,
      inputDialog: false,
      roomItems: [],
      visible: false,
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
      time_down: "",
      timeCounts: [
        { value: 15, label: "15  min" },
        { value: 30, label: "30  min" },
        { value: 45, label: "45  min" },
        { value: 60, label: "60  min" },
        { value: 70, label: "70  min" },
      ],
      pickerOptionsStart: {
        disabledDate: (time) => {
          let date = Date.now();
          //- 8.64e7
          return time.getTime() < Date.now() - 8.64e7; /*今天及以后*/
          // return (
          //   time.getTime() > Date.now() - 8.64e6
          // ); /*今天及之前，注意数字不一样*/
        },
      },
      className: ''
    };
  },
  created() {
    let index = this.url.indexOf("?");
    if (index > -1) {
      this.show_url = this.url.substring(0, index);
    } else {
      this.show_url = this.url;
    }

    getRealClass(this.user_id).then((res) => {
      console.log(res);
      this.roomItems = res;
    });

    this.className = this.classRoomInfo.class_name
  },
  watch: {
    time_type() {
      console.log(this.time_type);
      if (this.time_type == 0) {
        this.setDeadLine();
      }
    },
    deadline() {
      if (this.time_type == 1) {
        this.setDeadLine();
      }
    },
    time_down() {
      console.log(this.time_down);
      if (this.time_type == 2) {
        this.setDeadLine();
      }
    },
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
    selectRoom(item) {
      this.room = item.name;
      this.visible = false;
      this.currentRoomId = item.id;
    },
    setDeadLine() {
      console.log("setDeadLine", this.time_type);
      this.hindeTimeDialog(this.time_type, this.deadline, this.time_down);
    },
    onCopyLink(canAnonymous) {
      if (this.currentRoomId != -1) {
        setRealClass(
          this.show_url.substring(this.show_url.lastIndexOf("/") + 1),
          this.canAnonymous ? 1 : 0,
          this.currentRoomId
        ).then((res) => {});
      } else {
        setRealClass(
          this.show_url.substring(this.show_url.lastIndexOf("/") + 1),
          this.canAnonymous ? 1 : 0
        ).then((res) => {});
      }
      this.copyLink(canAnonymous);
      this.setDeadLine();
    },
    createNewRoomConfirm() {
      if (!this.newRoomName || this.newRoomName.length < 1) {
        this.$message.error("Please input a name!");
        return;
      }
      this.visible = false;
      for (let i = 0; i < this.roomItems.length; i++) {
        if (this.roomItems[i].name == this.newRoomName) {
          this.room = this.newRoomName;
          this.newRoomName = "";
          this.currentRoomId = this.roomItems[i].id;
          return;
        }
      }
      addRealClass(this.user_id, this.newRoomName).then((res) => {
        console.log(res);
        if (res.code == "ok") {
          this.room = this.newRoomName;
          var roomItem = {};
          roomItem.name = this.newRoomName;
          roomItem.id = res.data;
          this.roomItems.push(roomItem);
          this.newRoomName = "";
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
  }

  .sub-title {
    text-align: left;
    font-size: 16px;
    font-family: Arial;
    font-weight: 400;
    line-height: 25px;
    color: #070707;
  }

  .invite-code {
    text-align: left;
    font-size: 50px;
    font-family: FZCuYuan-M03S;
    font-weight: 400;
    line-height: 80px;
    color: #15c39a;
    padding-bottom: 10px;
  }

  .form-label {
    text-align: right;
    vertical-align: middle;
    font-family: Arial;
    font-weight: bold;
    color: #000000;
    padding-right: 15px;
    box-sizing: border-box;
  }

  .my-login-input {
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 6px;
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
</style>
