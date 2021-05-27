<template>
  <div class="page" v-bind="$attrs">
    <div
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
          <!-- {{ getAnser(item.answer)}} -->
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
    </div>
  </div>
</template>

<style  scoped>
.page {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #000000;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.choiceAnswer {
  width: 300px;
  height: 150px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  color: cadetblue;
  font-size: 1.2rem;
  margin-top: 15px;
  flex-direction: column;
}
.v2screen-lock__message {
  font-family: ProximaNovaSoft-SemiBold, sans-serif;
  font-weight: normal;
  font-style: normal;
  padding: 0.2em 1em;
  font-size: 1.5rem;
  text-align: center;
  color: #ffffff;
}
.v2screen-lock__sub-text {
  font-family: ProximaNovaSoft-SemiBold, sans-serif;
  font-weight: normal;
  font-style: normal;
  padding-bottom: 1em;
  font-size: 1rem;
  text-align: center;
  text-transform: uppercase;
  color: #eedb44;
}
.answerArea {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.anser_text {
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.textContent {
  width: 60%;
  height: 60px;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  color: cadetblue;
  font-size: 1.2rem;
  margin-top: 15px;
}
.darwAnswer {
  width: 50%;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: white;
}
img {
  width: 90%;
  height: 500px;
}
</style>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    answerList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },

  data() {
    return {
      answerTextList: []
    };
  },
  mounted() {},
  methods: {
    getAnser(index) {
      let opts = this.data.items[0].data;

      let title = ["A", "B", "C", "D", "E", "F", "G"];
      let result = [];
      if (opts.isMulti) {
        let list = JSON.parse(index);
        for (let i = 0; i < opts.options.length; i++) {
          let index = list.indexOf(opts.options[i].id);
          if (index > -1) {
            result.push(title[index] + " : " + opts.options[i].text);
          }
        }
      } else {
        let flag = parseInt(index);
        let text = "";
        for (let i = 0; i < opts.options.length; i++) {
          if (index == opts.options[i].id) {
            text = opts.options[i].text;
            break;
          }
        }
        result.push(title[flag] + " : " + text);
      }
      return result;
    }
  }
};
</script>