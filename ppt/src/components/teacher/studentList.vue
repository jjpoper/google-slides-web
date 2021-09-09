<template>
  <el-tabs v-model="activeTab" :stretch="true">
    <el-tab-pane :label="Student()" name="first">
      <el-table :data="studentList" style="width: 100%">
        <el-table-column
          prop="name"
          label="Student name"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="state"
          label="state"
          width="180"
        ></el-table-column>
        <el-table-column prop="operation" label="operation">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="opt(scope.$index, studentList)"
              type="text"
              size="small"
              >evaluate</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane :label="Teacher()" name="second">
      <el-table :data="teacherList" style="width: 100%">
        <el-table-column
          prop="name"
          label="Student name"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="state"
          label="state"
          width="180"
        ></el-table-column>
        <el-table-column prop="operation" label="operation">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="opt(scope.$index, teacherList)"
              type="text"
              size="small"
              >evaluate</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
.opts {
  color: #409eff;
}
</style>

<script>
export default {
  props: {
    studentList: {
      type: Array,
      default: [],
    },
    teacherList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      activeTab: "first",
    };
  },
  mounted() {
    // console.log(this.studentList);
  },

  methods: {
    Student() {
      let total = this.studentList.length;
      let onLine = 0;
      for (let i = 0; i < total; i++) {
        if ("online" == this.studentList[i].state) {
          onLine++;
        }
      }
      return "Student" + "  " + onLine + "/" + total;
    },
    Teacher() {
      let total = this.teacherList.length;
      let onLine = 0;
      for (let i = 0; i < total; i++) {
        if ("online" == this.teacherList[i].state) {
          onLine++;
        }
      }
      return "Teacher" + "  " + onLine + "/" + total;
    },
    opt(index, data) {
      // console.log(data[index].name);
    },
  },
};
</script>