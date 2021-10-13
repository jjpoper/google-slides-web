<template>
  <div class="page">
    <img src="../../assets/picture/invate_icon.png" width="316" height="178" />
    <div class="login_right">
      <img
        src="../../assets/picture/close_icon.png"
        style="
          width: 30px;
          height: 30px;
          margin-top: 10px;
          margin-left: 93%;
          cursor: pointer;
        "
        @click="closeBtn"
      />

      <span class="title_1">Invite students to study</span>
      <span class="title_2">Join at join.classcipe.com</span>
      <div class="class_number">{{ getPass }}</div>

      <!-- <div class="opt--item" style="margin-top: 20px">
        <span class="opt--text">Option</span>
        <div class="opt--value"></div>
      </div>-->

      <div class="opt--item">
        <span class="opt--text">Time</span>
        <el-select
          v-model="time_type"
          placeholder="--Select--"
          style="width:300px;height:40px; border: 1px solid #d8d8d8;border-radius: 6px;"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <div class="opt--item" v-if="time_type==2">
        <span class="opt--text"></span>
        <el-select
          v-model="time_down"
          placeholder="--Select--"
          style="width:300px;height:40px; border: 1px solid #d8d8d8;border-radius: 6px;"
        >
          <el-option
            v-for="item in timeCounts"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>

      <div class="opt--item" v-if="time_type==1">
        <span class="opt--text"></span>

        <el-date-picker
          v-model="deadline"
          type="datetime"
          placeholder="--Select--"
          format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptionsStart"
          style="width:300px;height:40px; border: 1px solid #d8d8d8;border-radius: 6px;"
        ></el-date-picker>
      </div>

      <div class="opt--item">
        <span class="opt--text"></span>
        <div style="display: flex; width: 300px; align-items: center">
          <div style="flex: 1"></div>
          <div class="anonymous">Anonymous logins</div>
          <div
            class="anonymous--switch"
            :style="
              canAnonymous
                ? 'background-color: #15c39a;'
                : 'background-color: #afafaf;'
            "
            @click="anonymousBtnClicked"
          >
            <div class="white--flag" style="margin-left: 3px" v-if="!canAnonymous"></div>
            <div style="flex: 1"></div>

            <div class="white--flag" style="margin-right: 3px" v-if="canAnonymous"></div>
          </div>
        </div>
      </div>

      <div class="link--area">
        <div
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
          "
          @click="onCopyLink(canAnonymous)"
        >
          <img src="../../assets/picture/link_icon.png" style="width: 40px; height: 40px" />
          <div class="link--text">copy link</div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    copyLink: {
      type: Function
    },
    url: {
      type: String,
      default: ""
    },
    enterClassroom: {
      type: Function
    },
    closeBtn: {
      type: Function
    },
    hindeTimeDialog: {
      type: Function
    }
  },
  data() {
    return {
      canAnonymous: false,
      show_url: "",
      time_type: 0,
      deadline: "",
      options: [
        {
          value: 0,
          label: "--Select--"
        },
        {
          value: 1,
          label: "Deadline mode"
        },
        {
          value: 2,
          label: "Count down mode"
        }
      ],
      time_dowm: 0,
      timeCounts: [
        { value: 15, label: "15  min" },
        { value: 30, label: "30  min" },
        { value: 45, label: "45  min" },
        { value: 60, label: "60  min" },
        { value: 70, label: "70  min" }
      ],
      pickerOptionsStart: {
        disabledDate: time => {
          let date = Date.now();
          //- 8.64e7
          return time.getTime() < Date.now() - 8.64e7; /*今天及以后*/
          // return (
          //   time.getTime() > Date.now() - 8.64e6
          // ); /*今天及之前，注意数字不一样*/
        }
      }
    };
  },
  created() {
    let index = this.url.indexOf("?");
    if (index > -1) {
      this.show_url = this.url.substring(0, index);
    } else {
      this.show_url = this.url;
    }
  },
  computed: {
    getPass() {
      return this.show_url.substring(this.show_url.lastIndexOf("/") + 1);
    }
  },
  methods: {
    anonymousBtnClicked() {
      this.canAnonymous = !this.canAnonymous;
    },
    setDeadLine() {
      this.hindeTimeDialog(this.time_type, this.deadline, this.time_dowm);
    },
    onCopyLink(canAnonymous) {
      this.copyLink(canAnonymous);
      this.setDeadLine();
    }
  }
};
</script>

<style scoped>
.link--text {
  height: 27px;
  font-size: 16px;
  margin-top: 5px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #989da1;
  opacity: 1;
}
.link--area {
  width: 390px;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 100px;
}
.white--flag {
  height: 22px;
  width: 22px;
  background-color: white;
  border-radius: 11px;
}
.anonymous--switch {
  width: 60px;
  height: 30px;
  background-color: #15c39a;
  border-radius: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.anonymous {
  font-size: 16px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #989da1;
  opacity: 1;
}
.opt--item {
  display: flex;
  align-items: center;
  height: 50px;
  margin-top: 10px;
}
.opt--value {
  height: 40px;
  width: 300px;
  flex: 1;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
}
.opt--text {
  height: 21px;
  font-size: 19px;
  font-family: Arial;
  font-weight: 400;
  line-height: 22px;
  color: #000000;
  opacity: 1;
  width: 90px;
}
.page {
  width: 937px;
  height: 700px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-radius: 16px;
}
.login_right {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.title_1 {
  height: 30px;
  font-size: 24px;
  font-family: Trebuchet MS;
  font-weight: 400;
  line-height: 30px;
  color: #070707;
  opacity: 1;
  margin-left: 90px;
}
.title_2 {
  height: 22px;
  font-size: 16px;
  font-family: Arial;
  font-weight: 400;
  line-height: 23px;
  color: #070707;
  opacity: 1;
  margin-left: 90px;
}
.close {
  position: fixed;
  right: 60px;
  height: 40px;
}
.class_number {
  height: 71px;
  font-size: 50px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
  line-height: 24px;
  color: #15c39a;
  margin-top: 20px;
  margin-left: 120px;
  margin-bottom: 20px;
  opacity: 1;
}
</style>


