<template>
  <div style="background-color: #E9EEF3;">
    <div class="mark-area">
      <pptcontent :url="url"/>
      <template v-for="(item, index) in currentMarks">
        <div
          :key="item.id"
          v-if="item.pointType !== 'box'" 
          :class="`markitem ${selectedIndex === index ? 'markitemhover' : ''}`"
          :style="`top:${item.top}px;left:${item.left}px;`"
          @click.stop="selectMark(item, index)"
        >
          <div class="innermark" :style="`background-color:${item.background || 'red'}; `"/>
        </div>
        <div
          :key="item.id"
          v-else-if="item.pointType === 'box'"
          :class="`markitembox ${selectedIndex === index ? 'markitemhover' : ''}`"
          :style="`top:${item.top - 6}px; left:${item.left - 6}px;`"
          @click.stop="selectMark(item, index)"
        >
          <div
            :style="`width:${item.width}px;
            height:${item.height}px;
            border: 2px solid ${item.background}`"
          />
        </div>
      </template>
    </div>   
    <div class="right-area">
      <recordCommentList :list="currentMarks" :selectMark="selectMark" :selectedIndex="selectedIndex"/>
    </div>
    <div class="select-users" v-if="users.length > 2">
      <el-select v-model="userId" placeholder="ALL">
        <el-option
          v-for="item in users"
          :key="item.user_id"
          :label="item.user_name"
          :value="item.user_id">
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
import recordCommentList from "../common/recordCommentList.vue";
import pptcontent from '../pptcontent.vue';
export default {
  components: {pptcontent, recordCommentList },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    url: {
      type: String,
      default: ''
    },
    pageId: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      selectedIndex: -1,
      currentPageId: 0,
      marks: [],
      users: [{user_id: 0, user_name: 'ALL'}],
      userId: 0,
    };
  },
  computed: {
    currentMarks() {
      return this.marks.filter((item) => this.userId == 0 || item.user_id === this.userId)
    }
  },
  created() {
    // console.log(this.list)
    this.marks = this.list.map((item) => {
      return {
        ...item,
        ...item.data
      }
    })
    let i,
      users = [{user_id: 0, user_name: 'ALL'}];
    for(i = 0; i < this.list.length; i++) {
      const {user_id, user_name} = this.list[i]
      if(users.findIndex(item => item.user_id === user_id) === -1) {
        users.push({user_id, user_name})
      }
    }
    this.users = users
  },
  methods: {
    selectMark(item, index) {
      this.selectedIndex = index
    },
  }
};
</script>

<style scoped>
.mark-area {
  position: fixed;
  width: 70%;
  top: 50px;
  left: 0;
  bottom: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  overflow: hidden;
}
.right-area{
  width: 30%;
  float: right;
}
.markitem {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  box-sizing: border-box;
  position: absolute;
  z-index: 999;
  cursor: pointer;
  border: 2px solid transparent;
}
.markitembox{
  position: absolute;
  z-index: 999;
  cursor: pointer;
  padding: 4px;
  border: 2px solid transparent;
}
.markitemhover{
  box-shadow: 0 0 20px #f00
}
.markitem:hover{
  box-shadow: 0 0 20px #f00
}
.markitembox:hover{
  box-shadow: 0 0 20px #f00
}
.innermark{
  width: 20px;
  height: 20px;
  border-radius: 10px;
  margin: 3px;
}
.select-users{
  position: fixed;
  top: 5px;
  right: 30%;
  width: 100px;
  height: 40px;
}
</style>