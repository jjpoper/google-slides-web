<template>
  <div class="modal-body">
    <img src="../../assets/picture/invate_icon.png" width="316" height="178" />
    <div class="login_right">
      <div @click="closeBtn" class="common-close-btn"></div>

      <span class="title_1">Invite students to study</span>
      <span class="title_2">Join at classcipe.com</span>
      <div class="class_number">{{ getPass }}</div>

      <div class="opt--item" style="margin-top: 20px">
        <span class="opt--text">Session name</span>
        <div class="room--area">
          <el-input
              placeholder="create new class"
              v-model="className"
              style="
                width: 317px;
                height: 40px;
                border: 1px solid #d8d8d8;
                border-radius: 6px;
              "
              @blur="changeName"
            />
        </div>
      </div>

      <div class="opt--item" style="margin-top: 20px">
        <span class="opt--text">Choose class</span>
        <el-popover placement="bottom" width="300" v-model="visible">
          <div class="room--area">
            <div
              v-for="(item, index) in roomItems"
              :key="index"
              class="room--item"
              @click="selectRoom(item)"
            >
              {{ item.name }}
            </div>

            <div class="create--room">
              <el-input
                placeholder="create new class"
                v-model="newRoomName"
                style="
                  width: 220px;
                  height: 40px;
                  border: 1px solid #9f9f9f;
                  border-radius: 6px;
                "
              />
              <div class="create--confirm" @click="createNewRoomConfirm">
                Confirm
              </div>
            </div>
          </div>
          <div slot="reference" class="opt--value room--item">{{ room }}</div>
        </el-popover>
      </div>

      <div class="opt--item">
        <span class="opt--text">Time</span>
        <el-select
          v-model="time_type"
          placeholder="--Select--"
          style="
            width: 315px;
            height: 40px;
            border: 1px solid #d8d8d8;
            border-radius: 6px;
          "
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <div class="opt--item" v-if="time_type == 2">
        <span class="opt--text">Allocated time</span>
        <el-select
          v-model="time_down"
          placeholder="--Select--"
          style="
            width: 315px;
            height: 40px;
            border: 1px solid #d8d8d8;
            border-radius: 6px;
          "
        >
          <el-option
            v-for="item in timeCounts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <div class="opt--item" v-if="time_type == 1">
        <span class="opt--text"></span>

        <el-date-picker
          v-model="deadline"
          type="datetime"
          placeholder="--Select--"
          format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptionsStart"
          style="
            width: 315px;
            height: 40px;
            border: 1px solid #d8d8d8;
            border-radius: 6px;
          "
        ></el-date-picker>
      </div>

      <div class="opt--item">
        <div style="display: flex; width: 435px; align-items: center">
          <div class="anonymous" style="margin-right: 10px">
            Students must complete their work within allocated time
          </div>
          <div
            class="anonymous--switch"
            :style="
              canAnonymous
                ? 'background-color: #15c39a;'
                : 'background-color: #afafaf;'
            "
            @click="anonymousBtnClicked"
          >
            <div
              class="white--flag"
              style="margin-left: 3px"
              v-if="!canAnonymous"
            ></div>
            <div style="flex: 1"></div>

            <div
              class="white--flag"
              style="margin-right: 3px"
              v-if="canAnonymous"
            ></div>
          </div>
        </div>
      </div>

      <div class="anonymous" style="width: 315px; text-align: right;margin-left: 130px">
        Anonymous logins
      </div>

      <div class="link--area">
        <div
          class="link-button"
          @click="onCopyLink(canAnonymous)"
        >
          <img
            src="../../assets/picture/link_icon.png"
            style="width: 40px; height: 40px"
          />
          <div class="link--text">copy link</div>
        </div>
      </div>
    </div>
  </div>
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


