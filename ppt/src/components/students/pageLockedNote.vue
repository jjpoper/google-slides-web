<template>
  <div class="fullPage" v-bind="$attrs">
    <!-- <div
      id="integrationTest_lockScreenMessage"
      class="v2screen-lock__message"
    >Your teacher has locked responses for this slide</div>

    <br />

    <div v-if="data.items[0] && data.items[0].type != 'website'" class="answerArea">
      <div class="v2screen-lock__sub-text">Your Current Answer</div>
      <br />
      <div v-if="data.items[0].type == 'text' || data.items[0].type == 'number'" class="answerArea">
        <div v-for="(item, index) in answerList" :key="index" class="textContent">{{ item.content }}</div>
      </div>
      <div v-if="data.items[0].type == 'choice'" class="answerArea">
        <div v-for="(item, index) in answerList" :key="index" class="choiceAnswer">
          <div
            class="anser_text"
            v-for="(text,index_text) in getAnser(item.answer)"
            :key="index_text"
          >{{text}}</div>
        </div>
      </div>
      <div v-if="data.items[0].type == 'draw'" class="answerArea">
        <div v-for="(item, index) in answerList" :key="index" class="darwAnswer">
          <img :src="item.content" />
        </div>
      </div>
    </div> -->
    <div class="lock-modal">
      <!-- <img
        src="../../assets/icon/dash-close.png"
        width="20"
        height="20"
        class="close-btn"
        @click="closeBtn()"
      /> -->
      <img src="../../assets/picture/teacher-lock.png" class="teacher-lock"/>
      <p class="info">Your teacher has locked responses for this slide</p>
    </div>
  </div>
</template>

<style  scoped>
.fullPage {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #000000;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 999999;
  position: fixed;
  top: 0;
}
.lock-modal{
  width: 80%;
  height: 590px;
  position: relative;
  background-color: #fff;
  border-radius: 10px; 
  display: flex;
  justify-content: center;
  align-items: center;
}
.close-btn{
  position: absolute;
  top: 25px;
  right: 25px;
  cursor: pointer;
}
.teacher-lock{
  width: 30%;
  /* height: 306px; */
  margin-right: 20px;
}
.info{
  font-size: 22px;
  font-family: FZCuYuan-M03S;
  font-weight: 700;
  line-height: 43px;
  color: #05272A
}
</style>

<script>
export default {
  // props: {
  //   data: {
  //     type: Object,
  //     default: () => {
  //       return {};
  //     }
  //   },
  //   answerList: {
  //     type: Array,
  //     default: () => {
  //       return [];
  //     }
  //   }
  // },

  // data() {
  //   return {
  //     answerTextList: []
  //   };
  // },
  // mounted() {},
  // methods: {
  //   getAnser(index) {
  //     let opts = this.data.items[0].data;

  //     let title = ["A", "B", "C", "D", "E", "F", "G"];
  //     let result = [];
  //     if (opts.isMulti) {
  //       let list = JSON.parse(index);
  //       for (let i = 0; i < opts.options.length; i++) {
  //         let index = list.indexOf(opts.options[i].id);
  //         if (index > -1) {
  //           result.push(title[index] + " : " + opts.options[i].text);
  //         }
  //       }
  //     } else {
  //       let flag = parseInt(index);
  //       let text = "";
  //       for (let i = 0; i < opts.options.length; i++) {
  //         if (index == opts.options[i].id) {
  //           text = opts.options[i].text;
  //           break;
  //         }
  //       }
  //       result.push(title[flag] + " : " + text);
  //     }
  //     return result;
  //   }
  // }
};
</script>