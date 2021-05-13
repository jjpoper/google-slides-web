<template>
  <div class="page">
    <div :v-if="!class_name || class_name === 'unnamed'">
      <p>
        <b
          >Enter a name for this class room to quickly find and review these
          students response later.
        </b>
      </p>
      <br />
      <el-input placeholder="Ex: 'Class Room 1'" v-model="room_name"></el-input>
    </div>

    <div class="confirmCloseOpts">
      <el-button
        type="danger"
        class="confirmBtn"
        @click="endClassroom(room_name)"
        >End Session {{ room_name ? "" : "Without Nameing" }}</el-button
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
    room_name: {
      type: String,
      default: "",
    },
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
};
</script>
