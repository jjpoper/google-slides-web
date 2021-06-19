<template>
  <div class="page">
    <div v-if="!(class_name && class_name != 'unnamed')">
      <p>
        <b
          >Enter a name for this class room to quickly find and review these
          students response later.
        </b>
      </p>
      <br />
      <el-input
        placeholder="Ex: 'Class Room 1'"
        v-model="input_name"
      ></el-input>
    </div>

    <div class="confirmCloseOpts">
      <el-button type="danger" class="confirmBtn" @click="closeClass()"
        >End Session {{ input_name ? "" : "Without Nameing" }}</el-button
      >
      <el-button @click="cancelEndClass()">Cancel</el-button>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-content: flex-start;
}
.confirmCloseOpts {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 20px;
}
.confirmBtn {
  margin-left: 20px;
}
</style>


<script>
export default {
  props: {
    cancelEndClass: {
      type: Function,
    },
    endClassroom: {
      type: Function,
    },
    class_name: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      input_name: "",
    };
  },
  mounted() {
    if (this.class_name && this.class_name != "nunamed") {
      this.input_name = this.class_name;
    }
    console.log(this.class_name);
  },
  methods: {
    closeClass() {
      this.endClassroom(this.input_name);
    },
  },
};
</script>