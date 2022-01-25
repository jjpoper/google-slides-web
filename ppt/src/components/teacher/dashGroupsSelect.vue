<template>
  <div class="student-list-item select-header" v-if="allGroups.length > 0">
    <el-select v-model="currentGroupId" placeholder="All" @change="changeGroup" style="background: #fff">
      <el-option
        label="ALL"
        value="">
      </el-option>
      <el-option
        v-for="item in allGroups"
        :key="item.group_id"
        :label="item.group_name"
        :value="item.group_id">
      </el-option>
    </el-select>
  </div>
</template>
<script>
import { controlProject } from '@/socket/socket.teacher'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      allGroups: state => {
        return state.teacher.allGroups.filter(item => item.members && item.members.length > 0)
      }
    }),
    ...mapGetters({
      currentPageId: 'student/currentPageId',
    }),
  },
  data() {
    return {
      currentGroupId: '',
    }
  },
  methods: {
    ...mapActions("teacher", ["changeGroupMembers"]),
    ...mapActions("student", ["changeSelectedGroup"]),
    changeGroup(id) {
      if(!id) {
        this.changeGroupMembers([])
        return
      }
      const data = this.allGroups.filter(item => item.group_id == id)[0]
      console.log(data)
      const list = data.members.map(item => item.user_id)
      console.log(list)
      // 分组切换后，选择状态取消
      this.changeSelectedGroup([])
      controlProject({
        controlType: 9,
        result: []
      })
      this.changeGroupMembers(list)
    },
  }
}
</script>
<style scoped>
  .res-inner{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: #ebe7e7;
    border: 1px solid rgba(216, 216, 216, 1);
    border-radius: 4px;
  }
</style>