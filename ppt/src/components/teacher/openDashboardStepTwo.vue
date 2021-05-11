<template>
  <div class="page">
    <div class="content">
      <img src="../../assets/step_two.jpg" />
      <div class="text">
        <p class="dashboard-tips__paragraph">
          We’ve gone ahead and opened the
          <strong>Teacher Dashboard</strong> for you. To assign this as homework, you can:
        </p>
        <br />
        <p class="dashboard-tips__paragraph">Copy the link below and send it to your students.</p>

        <br />
        <a class="dashboard-tips__paragraph__link" @click="copyUrl()">
          <span class="icon">
            <!--?xml version="1.0" encoding="utf-8"?-->
            <!-- Generator: Adobe Illustrator 20.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
            <svg
              version="1.1"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 64 64"
              style="enable-background:new 0 0 64 64;"
              xml:space="preserve"
            >
              <g>
                <g>
                  <g>
                    <path
                      d="M25.6,36.5c-0.9-0.9-0.9-2.4,0-3.3c0.9-0.9,2.4-0.9,3.3,0c2.8,2.8,7.4,2.8,10.3,0l10.9-10.9c2.8-2.8,2.8-7.4,0-10.3
				c-2.8-2.8-7.4-2.8-10.3,0L28.9,23c-0.9,0.9-2.4,0.9-3.3,0c-0.9-0.9-0.9-2.4,0-3.3L36.6,8.7c4.7-4.7,12.2-4.7,16.9,0
				s4.7,12.2,0,16.9L42.5,36.5C37.9,41.2,30.3,41.2,25.6,36.5z"
                    />
                    <path
                      d="M34.1,41c-3.3,0-6.6-1.3-9.1-3.8l0,0l0,0l0,0c-0.6-0.6-1-1.5-1-2.4s0.3-1.7,1-2.4c1.3-1.3,3.4-1.3,4.7,0
				c2.4,2.4,6.4,2.4,8.8,0l10.9-10.9c2.4-2.4,2.4-6.4,0-8.8c-2.4-2.4-6.4-2.4-8.8,0L29.6,23.7c-1.3,1.3-3.4,1.3-4.7,0
				c-0.6-0.6-1-1.5-1-2.4c0-0.9,0.3-1.7,1-2.4L35.9,8c2.4-2.4,5.7-3.8,9.1-3.8l0,0c3.5,0,6.7,1.3,9.1,3.8c2.4,2.4,3.8,5.7,3.8,9.1
				s-1.3,6.7-3.8,9.1L43.2,37.2C40.7,39.7,37.4,41,34.1,41z M27.3,33.5c-0.3,0-0.7,0.1-0.9,0.4c-0.3,0.3-0.4,0.6-0.4,0.9
				s0.1,0.7,0.4,0.9l0,0c4.3,4.3,11.2,4.3,15.5,0l10.9-10.9c2.1-2.1,3.2-4.8,3.2-7.7s-1.1-5.7-3.2-7.7S47.9,6.2,45,6.2
				s-5.7,1.1-7.7,3.2L26.3,20.4c-0.3,0.3-0.4,0.6-0.4,0.9c0,0.4,0.1,0.7,0.4,0.9c0.5,0.5,1.4,0.5,1.9,0l10.9-10.9
				c3.2-3.2,8.5-3.2,11.7,0c3.2,3.2,3.2,8.5,0,11.7L39.9,33.9c-1.6,1.6-3.6,2.4-5.8,2.4c-2.2,0-4.3-0.9-5.8-2.4
				C28,33.7,27.6,33.5,27.3,33.5z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <path
                      d="M9.1,55.3c-4.7-4.7-4.7-12.2,0-16.9l10.9-10.9c4.7-4.7,12.2-4.7,16.9,0c0.9,0.9,0.9,2.4,0,3.3c-0.9,0.9-2.4,0.9-3.3,0
				c-2.8-2.8-7.4-2.8-10.3,0L12.5,41.7c-2.8,2.8-2.8,7.4,0,10.3c2.8,2.8,7.4,2.8,10.3,0L33.7,41c0.9-0.9,2.4-0.9,3.3,0
				c0.9,0.9,0.9,2.4,0,3.3L26,55.3C21.4,59.9,13.8,59.9,9.1,55.3z"
                    />
                    <path
                      d="M17.6,59.7c-3.3,0-6.6-1.3-9.1-3.8l0,0c-5-5-5-13.2,0-18.3l10.9-10.9c5-5,13.2-5,18.3,0c1.3,1.3,1.3,3.4,0,4.7
				c-1.3,1.3-3.4,1.3-4.7,0c-1.2-1.2-2.7-1.8-4.4-1.8s-3.2,0.6-4.4,1.8L13.2,42.4c-2.4,2.4-2.4,6.4,0,8.8c2.4,2.4,6.4,2.4,8.8,0
				l10.9-10.9c1.3-1.3,3.4-1.3,4.7,0s1.3,3.4,0,4.7L26.7,56C24.2,58.5,20.9,59.7,17.6,59.7z M9.9,54.5c4.3,4.3,11.2,4.3,15.5,0
				l10.9-10.9c0.5-0.5,0.5-1.4,0-1.9c-0.5-0.5-1.4-0.5-1.9,0L23.4,52.6c-3.2,3.2-8.5,3.2-11.7,0s-3.2-8.5,0-11.7L22.7,30
				c1.6-1.6,3.6-2.4,5.8-2.4s4.3,0.9,5.8,2.4c0.5,0.5,1.4,0.5,1.9,0c0.5-0.5,0.5-1.4,0-1.9c-4.3-4.3-11.2-4.3-15.5,0L9.9,39.1
				C5.6,43.3,5.6,50.3,9.9,54.5L9.9,54.5z"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </span> Copy Link
        </a>
      </div>
    </div>

    <div class="opts">
      <el-button @click="closeTwo()" type="primary">
        <b>Go to Teacher Dashboard</b>
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    closeTwo: {
      type: Function
    },
    copyUrl: {
      type: Function
    }
  }
};
</script>

<style scoped>
.page {
  display: flex;
  width: 100%;
  flex-direction: column;
}
img {
  width: 200px;
  height: 250px;
}
.opts {
  display: flex;
  padding-top: 20px;
  width: 100%;
  align-items: center;
  flex-direction: row-reverse;
}
.text {
  margin-left: 20px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}
.content {
  display: flex;
}

.dashboard-tips__paragraph {
  color: #354242;
  font-size: 15px;
  line-height: 1.2;
  font-family: ProximaNovaSoft-Regular, sans-serif;
  font-weight: normal;
  font-style: normal;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
}

.dashboard-tips__paragraph__link {
  font-family: ProximaNovaSoft-SemiBold, sans-serif;
  font-weight: normal;
  font-style: normal;
  cursor: pointer;
}

a,
a:link,
a:active,
a:hover,
a:visited {
  color: #29abe2;
  text-decoration: none;
  outline: none;
}

.icon,
.u-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: #29abe2;
}
</style>