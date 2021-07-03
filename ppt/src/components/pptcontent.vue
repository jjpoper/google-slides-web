<template>
  <div v-if="url" class="ppt">
    <div v-if="teacher" class="teacherppt" :style="`width: ${width}px; height: ${height}px; background-image:url(${url})`">
      <div class="medialist">
        <div v-for="item in fileList" :key="item.url">
          <div v-if="item.type === 'image'" class="meidaitem teacherppt" :style="`background-image:url(${item.url})`"></div>
          <div v-if="item.type === 'iframe'" class="meidaitem teacherppt" >
            <iframe width="400" height="300" :src="item.url" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div> 
      </div>
    </div>
    <div v-else class="ppt teacherppt" :style="`height: ${height}px; background-image:url(${url})`"></div>
  </div>
</template>
<style scoped>
.teacherppt{
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center
}
.ppt{
  width: 100%;
  height: 100%;
  display: flow-root;
}
.medialist{
  display: flex;
  width: 100%;
  flex-direction: row;
}
.meidaitem{
  width:200px; height: 200px;
}
</style>

<script>
import { ModalEventsNameEnum } from '@/socket/socketEvents';
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
    teacher: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      width: 0,
      height: 0,
      fileList: []
    }
  },
  mounted() {
    this.width = document.documentElement.clientWidth - 40;
    this.height = document.documentElement.clientHeight - 40;
    EventBus.$on(ModalEventsNameEnum.ADD_NEW_MEDIA, (url) => {
      this.addMediaList(url);
    });
  },
  methods: {
    addMediaList(url) {
      this.fileList.push(url)
    }
  }
};
</script>
