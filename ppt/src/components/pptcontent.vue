<template>
  <div v-if="url" class="ppt">
    <div v-if="teacher" class="teacherppt" :style="`width: ${width}px; height: ${height}px; background-image:url(${url})`">
    </div>
    <div v-else class="ppt teacherppt" :style="`height: ${height}px; background-image:url(${url})`"></div>
    <div class="medialist">
        <div v-for="item in filterAddedMediaList" :key="item.url">
          <div v-if="item.type === 'image'" class="meidaitem teacherppt" :style="`background-image:url(${item.url})`"></div>
          <div v-if="item.type === 'iframe'" class="meidaitem teacherppt" >
            <iframe width="300" height="200" :src="getIframe(item.url)" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </div> 
      </div>
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
  flex-wrap: wrap;
  height: 100%;
  overflow-y: scroll;
  position: absolute;
  top: 0;
}
.meidaitem{
  width:300px; height: 200px;
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
    },
    filterAddedMediaList: {
      type: Array,
      function() {
        return [];
      },
    },
  },
  data() {
    return {
      width: 0,
      height: 0,
    }
  },
  mounted() {
    this.width = document.documentElement.clientWidth - 40;
    this.height = document.documentElement.clientHeight - 40;
    console.log(this.filterAddedMediaList)
  },
  methods: {
    getIframe(url){
      const formatId = url.split('?v=')[1]
      if(formatId) {
        return `https://www.youtube.com/embed/${formatId}`
      }
      return url
    }
  }
};
</script>
