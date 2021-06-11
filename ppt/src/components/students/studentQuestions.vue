<template>
  <div>
    <div class="mark-area" @click="markup($event)">
      <div
        v-for="(item, index) in marks"
        :key="index"
        class="markitem"
        :style="`top:${item.top}px;left:${item.left}px`"
      >
        <svg
          t="1623305613286"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2165"
          width="32"
          height="32"
        >
          <path
            d="M837.818182 190.836364c-83.781818-88.436364-200.145455-139.636364-325.818182-139.636364-121.018182-4.654545-237.381818 41.890909-330.472727 134.981818-139.636364 144.290909-176.872727 353.745455-93.090909 525.963637l-18.618182 148.945454c0 13.963636 0 41.890909 18.618182 60.509091 18.618182 23.272727 41.890909 32.581818 69.818181 27.927273l144.29091-18.618182c55.854545 27.927273 125.672727 46.545455 200.145454 46.545454h13.963636c111.709091 0 223.418182-46.545455 311.854546-130.327272 88.436364-83.781818 139.636364-200.145455 139.636364-330.472728 9.309091-121.018182-41.890909-242.036364-130.327273-325.818181z m-325.818182 707.490909c-60.509091 0-125.672727-13.963636-176.872727-41.890909-9.309091-4.654545-13.963636-4.654545-18.618182-4.654546l-158.254546 23.272727 18.618182-158.254545c0-9.309091 0-18.618182-4.654545-23.272727-79.127273-144.290909-51.2-325.818182 69.818182-446.836364 74.472727-74.472727 172.218182-111.709091 274.618181-111.709091s200.145455 41.890909 274.618182 111.709091c74.472727 74.472727 111.709091 172.218182 111.709091 274.618182s-41.890909 200.145455-111.709091 274.618182c-79.127273 60.509091-176.872727 102.4-279.272727 102.4z"
            p-id="2166"
            fill="#d81e06"
          />
          <path
            d="M530.618182 707.490909c-18.618182-4.654545-32.581818-9.309091-46.545455 4.654546-13.963636 13.963636-13.963636 27.927273-9.309091 41.890909 0 4.654545 9.309091 9.309091 13.963637 13.963636l4.654545 4.654545 4.654546 4.654546c4.654545 0 13.963636 4.654545 18.618181 4.654545 9.309091 0 18.618182-4.654545 23.272728-9.309091 13.963636-13.963636 13.963636-32.581818 4.654545-41.890909l-13.963636-23.272727zM512 256c-134.981818 0-172.218182 102.4-172.218182 158.254545 0 18.618182 18.618182 37.236364 37.236364 37.236364s37.236364-18.618182 37.236363-37.236364c0-4.654545 0-83.781818 97.745455-83.781818 13.963636 0 60.509091 4.654545 79.127273 37.236364 18.618182 18.618182 18.618182 51.2 9.309091 69.818182-13.963636 13.963636-32.581818 32.581818-51.2 46.545454 0 0-4.654545 4.654545-9.309091 4.654546-4.654545 4.654545-9.309091 4.654545-9.309091 9.309091-37.236364 32.581818-60.509091 83.781818-60.509091 134.981818 0 9.309091 4.654545 18.618182 13.963636 27.927273 4.654545 4.654545 13.963636 13.963636 23.272728 13.963636 13.963636 0 18.618182-4.654545 23.272727-13.963636 4.654545-4.654545 9.309091-13.963636 9.309091-23.272728 0-27.927273 13.963636-60.509091 32.581818-79.127272 0 0 4.654545-4.654545 9.309091-4.654546 4.654545-4.654545 9.309091-4.654545 9.309091-9.309091l9.309091-9.309091c18.618182-13.963636 46.545455-32.581818 55.854545-60.509091 32.581818-51.2 23.272727-116.363636-13.963636-158.254545-23.272727-41.890909-69.818182-60.509091-130.327273-60.509091z"
            p-id="2167"
            fill="#d81e06"
          />
        </svg>
      </div>
      <el-popover placement="top" width="100" trigger="manual" v-model="buttonVisiable" @click.stop>
        <div class="buttonlist">
          <el-tooltip class="item" effect="dark" content="Audio" placement="top-start">
            <svg
              @click="audio"
              t="1622676486182"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="1217"
              width="20"
              height="20"
            >
              <path
                d="M566.215111 899.811556v118.158222h-85.333333v-114.915556C294.4 888.718222 147.342222 735.573333 147.342222 562.688a42.666667 42.666667 0 0 1 85.333334 0c0 134.257778 123.790222 256.113778 276.764444 256.113778s276.707556-121.912889 276.707556-256.113778a42.666667 42.666667 0 1 1 85.333333 0c0 164.067556-132.380444 310.385778-305.265778 337.123556zM510.976 33.336889a170.666667 170.666667 0 0 1 170.666667 170.666667v341.333333a170.666667 170.666667 0 1 1-341.333334 0v-341.333333a170.666667 170.666667 0 0 1 170.666667-170.666667z"
                fill="#1296db"
                p-id="1218"
              />
            </svg>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="Video" placement="top-start">
            <svg
              @click="video"
              t="1622676554377"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2348"
              width="20"
              height="20"
            >
              <path
                d="M768 648.533333V768H128V256h640v119.466667L896 298.666667v426.666666l-128-76.8z m0-93.866666l42.666667 25.6v-136.533334l-42.666667 25.6v85.333334zM213.333333 341.333333v341.333334h469.333334V341.333333H213.333333z"
                fill="#1296db"
                p-id="2349"
              />
            </svg>
          </el-tooltip>
        </div>
        <div
          slot="reference"
          class="markitem markpos"
          :style="`top:${currentPosition.top}px;left:${currentPosition.left}px`"
        >buttons</div>
      </el-popover>
    </div>
    <el-dialog
      :visible.sync="recordVisiable"
      destroy-on-close
      append-to-body
      @close="closeRecord()"
    >
      <template v-if="type === ModalEventsTypeEnum.VIDEO">
        <div class="record-container">
          <record-video :onSend="sendVideoOrAudio" />
        </div>
      </template>
      <template v-else-if="type === ModalEventsTypeEnum.AUDIO">
        <div class="record-container">
          <record-audio :onSend="sendVideoOrAudio" />
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
.mark-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  background-color: transparent;
}
.markitem {
  width: 30px;
  height: 30px;
  /* border-radius: 15px;
  background-color: red; */
  position: absolute;
  z-index: 999;
}
.markpos {
  z-index: 1;
  opacity: 0;
}
.buttonlist {
  /* width: 100px;
  height: 40px; */
  display: flex;
  justify-content: space-around;
}
.item {
  width: 50px;
  cursor: pointer;
}
.record-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
<script>
import { ModalEventsTypeEnum } from "@/socket/socketEvents";
import recordAudio from "../common/recordAudio.vue";
import RecordVideo from "../common/recordVideo.vue";
import { showToast } from "@/utils/loading";
export default {
  components: { recordAudio, RecordVideo },
  props: {
    sendQuestion: {
      type: Function
    },
    marks: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      ModalEventsTypeEnum,
      currentPosition: { left: 0, top: 0, content_width: 0, content_height: 0 },
      buttonVisiable: false,
      recordVisiable: false,
      type: "",
      sendSuccess: false
    };
  },
  mounted() {},
  methods: {
    markup(e) {
      if (!this.sendSuccess) {
        // 没有发送要删除这次打点
        if (!this.marks || !this.marks[this.marks.length - 1].fromServie) {
          this.marks.pop();
        }
      }

      console.log(e.target.offsetWidth, e.target.offsetHeight);
      const { pageX, pageY } = e;
      const left = pageX - 15;
      const top = pageY - 15;
      const { offsetHeight, offsetWidth } = e.target;
      this.currentPosition = {
        left,
        top,
        content_width: offsetWidth,
        content_height: offsetHeight
      };
      this.marks.push(this.currentPosition);
      this.buttonVisiable = false;
      this.sendSuccess = false;
      this.$nextTick(() => {
        this.buttonVisiable = true;
      });
    },
    audio() {
      this.recordVisiable = true;
      this.buttonVisiable = false;
      this.type = ModalEventsTypeEnum.AUDIO;
    },
    video() {
      this.recordVisiable = true;
      this.buttonVisiable = false;
      this.type = ModalEventsTypeEnum.VIDEO;
    },
    closeRecord() {
      console.log("1111");
      this.type = "";
      if (!this.sendSuccess) {
        // 没有发送要删除这次打点
        this.marks.pop();
      }
    },
    sendVideoOrAudio(link, type = "") {
      // this.sendComment(url, type)
      const { left, top, content_width, content_height } = this.currentPosition;
      this.sendQuestion({
        left,
        top,
        link,
        content_width,
        content_height,
        type
      });
      this.sendSuccess = true;
      this.recordVisiable = false;
      showToast("send success");
    }
  }
};
</script>