<template>
  <div class="parent" v-if="textList&&textList.length>0">
    <div class="parent_1" >
      <div class="parent_2" v-for="(item,index) in textList" :key="index">
        <div class="grid-content">{{item.content}}</div>
        <p class="stduent_name">{{item.user_name}}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.parent {
  display: flex;
  flex-direction: column;
  line-height: auto;
}
.parent_1 {
  display: flex;
  flex-direction: row;
  width: 100%;
  line-height: 120px;
  flex-wrap: wrap;
}
.parent_2 {
  display: flex;
  flex-direction: column;
  width: 30%;
  padding: 10px;
  height: 100%;
}
.stduent_name {
  font-family: "PingFang SC";
  line-height: 20px;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 100px;
  height: 100%;
  padding: 10px;
  background-color: white;
  border: 1px solid #e5e9f2;
  line-height: 20px;
  text-align: left;
  word-wrap:break-word;
}
p {
  text-align: left;
}
</style>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    textList: {
      type: Array,
      default: []
    },
    pageId: {
      type: String,
      default: ""
    }
  },

  data() {
    return {};
  },

  created() {
    console.log("text template created!!" + this.textList.length);
    
  },
  methods: {}
};
</script>