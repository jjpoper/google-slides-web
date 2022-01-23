<template>
  <div @click.stop="deletefn" class="delete-button"></div>
</template>
<script>
export default {
  props: {
    deletefn: {
      type: Function,
      default: () => null
    }
  }
}
</script>
<style scoped>
.delete-button {
  width: 30px;
  height: 30px;
  border-radius: 17px;
  background-image: url(../../assets/picture/mdel.png);
  background-size: 30px 30px;
  background-repeat: no-repeat;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  background-color: #afafaf;
  z-index: 9999;
}
.delete-button:hover {
  background-color: tomato;
}
</style>