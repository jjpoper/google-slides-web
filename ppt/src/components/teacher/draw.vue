<template>
  <!-- <div class="drawlist">
    <template v-for="item in imgUrls">
      <div :key="item.user_id">
        <p class="uname" v-if="flag_1">{{item.user_name}}</p>
        <div
          id="canvasouter"
          class="canvasouterimg"
          :style="`width: ${width}px; height: ${height}px; background-image:url(${pptUrl})`"
        >
          <div
            class="canvasouterimg"
            :style="`width: ${width}px; height: ${height}px; background-image:url(${item.content})`"
          ></div>
        </div>
      </div>
    </template>
  </div>-->
  <div class="parent">
    <div v-for="item in imgUrls" :key="item.user_id">
      <div v-if="shouldShow(item)" :class="item.star ? 'parent_1 star_bg' : 'parent_1'">
        <div
          id="canvasouter"
          class="canvasouterimg"
          :style="`width: ${width}px; height: ${height}px; background-image:url(${pptUrl})`"
        >
          <div
            class="canvasouterimg"
            :style="`width: ${width}px; height: ${height}px; background-image:url(${item.content})`"
          ></div>
        </div>
        <student-response-opt-bar
          v-if="flag_1"
          :data="{
            pageId: data.page_id,
            itemId: item.key,
            studentId: item.user_id,
            title: item.content,
            isStar: item.star,
            isShowRes: item.show,
            name: item.user_name,
          }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentPageAnswerList } from "@/model/store.teacher";
import StudentResponseOptBar from "./studentResponseOptBar.vue";
export default {
  components: { StudentResponseOptBar },
  props: {
    sendCanvas: { type: Function },
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    flag_1: {
      type: Boolean,
      default: false
    },
    pptUrl: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      imgUrls: [],
      width: 350,
      height: 200
    };
  },
  mounted() {
    console.log('pptUrl', this.$attrs)
    this.imgUrls = getCurrentPageAnswerList(
      this.data.page_id,
      this.data.items[0].type
    );
    EventBus.$on("draw", data => {
      // 通知展示当前pageid，当前itemid的评论框
      this.draw(data);
      this.imgUrls = getCurrentPageAnswerList(
        this.data.page_id,
        this.data.items[0].type
      );
      console.log("draw refresh", this.imgUrls);
    });
    // // let outer = document.getElementById('canvasouter')
    // this.width = document.documentElement.clientWidth - 40;
    // this.height = document.documentElement.clientHeight - 40;
  },
  methods: {
    draw({ user_id, content, user_name }) {
      // console.log(data)
      // const cxt = this.cxt
      const index = this.imgUrls.findIndex(item => item.user_id === user_id);
      if (index > -1) {
        this.imgUrls[index].content = content;
      } else {
        this.imgUrls.unshift({ user_id, content, user_name });
      }
    },
    //返回当前这个item是否应该show出来
    shouldShow(item) {
      console.log(this.imgUrls, "draw show!");
      if (this.flag_1) return true; //如果是dashboard 模式，则一定show
      if (!item.show) return false; //如果要求隐藏，则一定需要隐藏
      if (item.star) return true; //如果是星标答案，则需要显示
      for (let i = 0; i < this.imgUrls.length; i++) {
        if (this.imgUrls[i].star) return false; //如果不是星标答案，且有其他的星标答案，则需要隐藏
      }
      return true;
    }
  }
};
</script>

<style >
.parent {
  display: flex;
  width: 90%;
  flex-wrap: wrap;
}
/* 有星标时的bg */
.star_bg {
  border: 3px solid #f7d567;
  background-color: #f8f1d3;
}
.parent_1 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 400px;
  flex-wrap: wrap;
  height: 300px;
  border-radius: 8px;
  margin-right: 20px;
  border: 1px solid #cfcfcf;
}
.drawlist {
  width: 100%;
  position: relative;
}
#canvasouter {
  position: relative;
  margin-bottom: 10px;
}
.uname {
  line-height: 20px;
  text-align: center;
}
.canvasouterimg {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
#canvas {
  background-color: blue;
}
</style>