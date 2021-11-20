<template>
  <div class="dashpptlist" v-if="studentAllSlides" >
    <div class="dash-left" @click="prev"></div>
    <div class="inner-swiper" ref="innerSwiper">
      <div v-for="(item, index) in studentAllSlides" :key="index"
            :ref="currentPageIndex === index ? 'activeRef': ''"
            :tabindex="currentPageIndex === index ? '0' : ''"
            @click="changeToPage(index)"
            class="ppt-list-item-outer">
        <div v-bind:class="
            currentPageIndex == index
              ? 'ppt_content image_parent_focus'
              : 'ppt_content '">
          <div
            class="image_parent"
            :style="`background-image:url(${item.thumbnail_url})`"
          >
            <!-- <el-popover
              placement="right"
              width="100"
              trigger="hover"
              v-if="getPageStudent(index) > 0"
            >
              <div class="student_name">{{ getStudentName(index) }}</div>
              <div class="student_flag" slot="reference">
                <svg
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="0 0 64 64"
                  enable-background="new 0 0 64 64"
                  xml:space="preserve"
                  fill="#fff"
                >
                  <path
                    d="M58,64c0-11-7-20-16.7-23.6l0,0c-0.1-0.1-0.3-0.1-0.4-0.2c2.2-2.3,3.9-5.6,4.6-10.5c1,0.1,2.3-0.8,2.7-2.7
  c0.5-1.9,1.4-4.8,0.3-5.2c-0.3-0.1-0.6,0-0.6,0.1v-5c0-5.5-0.9-10.9-6.7-13.2c-1-2.3-1.3-3.9-1.3-3.9c-2.6,2.4-12.8,3.9-12.8,3.9
  h0.1C14.6,4.9,16,9.1,16,17v5.1c0-0.1-0.4-0.3-0.7-0.1c-1,0.3-0.5,3.2-0.2,5.1c0.4,1.7,2,3,3.1,2.8c0.8,5,2.2,8.4,4.3,10.5
  C12.9,44,6,53,6,64H58z"
                  />
                </svg>
                <div class="student_count">1</div>
              </div>
            </el-popover> -->
          </div>
          <i class="index-tag">{{index+1}}/{{studentAllSlides.length}}</i>
        </div>
      </div>
    </div>
    <div class="dash-left dash-right" @click="next"></div>
  </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
export default {
  props: {
    changePage: {
      type: Function
    }
  },
  computed: {
    ...mapState({
      studentAllSlides: state => state.student.studentAllSlides,
      currentPageIndex: state => state.student.currentPageIndex,
    })
  },
  mounted() {
    this.focus()
    console.log('=====')
  },
  watch: {
    currentPageIndex() {
      // this.$nextTick(() => {
      //   if(this.$refs.activeRef) {
      //     this.$refs.activeRef[0].focus();
      //   }
      // });
    }
  },
  methods: {
    // ...mapActions("student", ["setStudentPageIndex"]),
    next() {
      // this.setStudentPageIndex(Math.min(this.currentPageIndex + 1, this.studentAllSlides.length - 1))
      this.moveSlow(this.$refs.innerSwiper.scrollLeft, this.$refs.innerSwiper.offsetWidth)
    },
    prev() {
      // this.setStudentPageIndex(Math.max(this.currentPageIndex - 1, 0))
      this.moveSlow(this.$refs.innerSwiper.scrollLeft, -this.$refs.innerSwiper.offsetWidth)
    },
    changeToPage(index) {
      this.changePage(index + 1)
    },
    focus() {
      this.$nextTick(() => {
        if(this.$refs.activeRef) {
          // this.$refs.activeRef[0].focus();
          this.moveSlow(0, this.$refs.activeRef[0].offsetLeft - this.$refs.innerSwiper.offsetWidth / 2)
        }
      });
    },
    moveSlow(distance, total) {
      this.$refs.innerSwiper.scrollLeft = distance + total
      return
      // 正向滚动 和 反向滚动
      if (this.lastItemIndex < this.itemIndex) {
        // 每隔1毫秒移动一小段距离，直到移动至目标至为止，反之亦然
        if (distance < total) {
          distance += step
          this.$refs.idSwiperImg.scrollLeft = distance
          setTimeout(() => {
            this.moveSlow(distance, total, step)
          }, 1)
        } else {
          this.$refs.idSwiperImg.scrollLeft = total
        }
      } else if (this.lastItemIndex > this.itemIndex) {
        if (distance > total) {
          distance -= step
          this.$refs.idSwiperImg.scrollLeft = distance
          setTimeout(() => {
            this.moveSlow(distance, total, step)
          }, 1)
        } else {
          this.$refs.idSwiperImg.scrollLeft = total
        }
      }
    }
  },
}
</script>