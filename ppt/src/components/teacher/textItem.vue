<template>
  <div class="parent" v-if="textList && textList.length>0">
    <div class="parent_1">
      <div class="parent_2" v-for="(item,index) in textList" :key="index">
        <div :id="item.user_id" class="grid-content">
          {{item.content}}
          <comment-icon :data="{pageId: data.page_id, itemId: item.item_id, studentId: item.user_id, title: item.content}"/>
        </div>
        <p class="stduent_name">{{getUname(item.user_id)}}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.parent {
  display: flex;
  flex-direction: column;
}
.parent_1 {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
}
.parent_2 {
  display: flex;
  flex-direction: column;
  width: 30%;
  padding: 10px;
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
  word-wrap: break-word;
  position: relative;
}
p {
  text-align: left;
}
</style>

<script>
import { getCurrentPageAnswerList, getStundentUidAndName } from '@/model/store.teacher';
import commentIcon from './commentIcon.vue';
export default {
  components: { commentIcon },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      textList: []
    }
  },
  mounted() {
    const {page_id, items} = this.data // 完整data
    this.textList = getCurrentPageAnswerList(page_id, items[0].type)
  },
  methods: {
    getUname(id) {
      console.log(getStundentUidAndName(id));
      const name = getStundentUidAndName(id);
      return name ? name : id;
    }
  }
};
</script>