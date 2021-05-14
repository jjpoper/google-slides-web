<template>
  <div class="page">
    <div class="menu_line" @click="open(1)" v-if="!isDashboard">
      <div class="v2pnav-option__icon mode-icon">
        <!--?xml version="1.0" encoding="utf-8"?-->
        <!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->

        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 64 64"
          style="enable-background: new 0 0 64 64"
          xml:space="preserve"
        >
          <path
            d="M60,9H28h-8H4c-2.2,0-4,1.8-4,4v16v8v16c0,2.2,1.8,4,4,4h16h8h32c2.2,0,4-1.8,4-4V13C64,10.8,62.2,9,60,9z M8,17h12v12H8V17
	z M8,49V37h12v12H8z M56,49H28V37v-8V17h28V49z"
          />
        </svg>
      </div>

      <div class="v2pnav-option__label">Open Dashboard in New Window</div>
    </div>

    <div class="menu_line" @click="openProject()" v-if="isDashboard">
      <div class="v2pnav-option__icon mode-icon">
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 64 64"
          style="enable-background: new 0 0 64 64"
          xml:space="preserve"
        >
          <path
            d="M60,9H28h-8H4c-2.2,0-4,1.8-4,4v16v8v16c0,2.2,1.8,4,4,4h16h8h32c2.2,0,4-1.8,4-4V13C64,10.8,62.2,9,60,9z M8,17h12v12H8V17
	z M8,49V37h12v12H8z M56,49H28V37v-8V17h28V49z"
          />
        </svg>
      </div>

      <div class="v2pnav-option__label">Open Project in new tab</div>
    </div>

    <div class="menu_line" @click="turnModel()" v-if="!isClosed">
      <div class="v2pnav-option__icon mode-icon">
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
        >
          <path
            d="M58,64c0-11-7-20-16.7-23.6l0,0c-0.1-0.1-0.3-0.1-0.4-0.2c2.2-2.3,3.9-5.6,4.6-10.5c1,0.1,2.3-0.8,2.7-2.7
	c0.5-1.9,1.4-4.8,0.3-5.2c-0.3-0.1-0.6,0-0.6,0.1v-5c0-5.5-0.9-10.9-6.7-13.2c-1-2.3-1.3-3.9-1.3-3.9c-2.6,2.4-12.8,3.9-12.8,3.9
	h0.1C14.6,4.9,16,9.1,16,17v5.1c0-0.1-0.4-0.3-0.7-0.1c-1,0.3-0.5,3.2-0.2,5.1c0.4,1.7,2,3,3.1,2.8c0.8,5,2.2,8.4,4.3,10.5
	C12.9,44,6,53,6,64H58z"
          />
        </svg>
      </div>

      <div class="v2pnav-option__label">
        Turn {{ current_model == "Student-Paced" ? "Off" : "On" }} Student-Paced
      </div>
    </div>

    <a class="menu_line" v-if="isClosed" @click="reStartClassRoom()"
      ><div class="v2pnav-option__icon mode-icon">
        <!--?xml version="1.0" encoding="utf-8"?-->
        <!-- Generator: Adobe Illustrator 18.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->

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
        >
          <path
            d="M60,4H42.5c0-2.2-1.8-4-4-4h-13c-2.2,0-4,1.8-4,4H4C1.8,4,0,5.8,0,8c0,2.2,1.8,4,4,4h1v35c0,2.8,2.2,5,5,5h11.2l-5.8,5
	c-1.7,1.4-1.9,4-0.4,5.6c0.8,0.9,1.9,1.4,3,1.4c0.9,0,1.8-0.3,2.6-1L32,53.3L43.4,63c0.8,0.6,1.7,1,2.6,1c1.1,0,2.2-0.5,3-1.4
	c1.4-1.7,1.2-4.2-0.4-5.6l-5.8-5H54c2.8,0,5-2.2,5-5V12h1c2.2,0,4-1.8,4-4C64,5.8,62.2,4,60,4z M51,44H13V12h38V44z"
          ></path>
        </svg>
      </div>
      <div class="v2pnav-option__label">Reopen Session</div></a
    >

    <a class="menu_line" @click="endLesson()" v-if="!isClosed">
      <div class="v2pnav-option__icon mode-icon">
        <!--?xml version="1.0" encoding="utf-8"?-->
        <!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->

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
        >
          <g>
            <path
              d="M32,38c-3.3,0-6-2.7-6-6V6c0-3.3,2.7-6,6-6s6,2.7,6,6v26C38,35.3,35.3,38,32,38z"
            />
          </g>
          <g>
            <g>
              <path
                d="M32,64C16.6,64,4,51.4,4,36c0-7.1,2.7-13.9,7.5-19.1c2.3-2.4,6.1-2.6,8.5-0.3c2.4,2.3,2.6,6.1,0.3,8.5
			c-2.8,3-4.3,6.8-4.3,10.9c0,8.8,7.2,16,16,16s16-7.2,16-16c0-4.1-1.5-7.9-4.3-10.9c-2.3-2.4-2.1-6.2,0.3-8.5
			c2.4-2.3,6.2-2.1,8.5,0.3c4.9,5.2,7.5,12,7.5,19.1C60,51.4,47.4,64,32,64z"
              />
            </g>
          </g>
        </svg>
      </div>
      <div class="v2pnav-option__label">End This Session</div>
    </a>

    <a
      class="menu_line"
      v-if="isClosed || current_model == 'Student-Paced'"
      @click="leavePage()"
    >
      <div class="v2pnav-option__icon mode-icon">
        <!--?xml version="1.0" encoding="utf-8"?-->
        <!-- Generator: Adobe Illustrator 20.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
        <svg
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 64 64"
          style="enable-background: new 0 0 64 64"
          xml:space="preserve"
        >
          <g>
            <path
              d="M21.3,27.9h20.5l-8.1-7.7c-1.4-1.4-1.4-3.3,0-4.8c0.7-0.7,1.6-0.9,2.5-0.9c0.9,0,1.8,0.4,2.5,1.1l16.7,16.6L38.8,48.9
		c-1.4,1.4-3.6,1.4-5,0c-1.4-1.4-1.4-4,0-5.5l8-8.5H21.3c-1.9,0-3.5-1.6-3.5-3.5S19.4,27.9,21.3,27.9z"
            />
          </g>
          <g>
            <path class="st0" d="M31.6,32.3" />
          </g>
          <g>
            <path
              d="M55.1,62.8h-47c-2.2,0-4-1.8-4-4v-53c0-2.2,1.8-4,4-4h47c2.2,0,4,1.8,4,4v12.1c0,2.2-1.8,4-4,4s-4-1.8-4-4V9.8h-39v45h39
		v-8.1c0-2.2,1.8-4,4-4s4,1.8,4,4v12.1C59.1,61,57.3,62.8,55.1,62.8z"
            />
          </g>
        </svg>
      </div>
      <div class="v2pnav-option__label">Leave Session</div>
    </a>
  </div>
</template>


<style scoped>
.page {
  min-height: 150px;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.menu_line {
  display: flex;
  height: 40px;
  align-items: center;
  fill: #29abe2;
  color: #29abe2;
  padding-left: 5px;
  cursor: pointer;
}
.menu_line:hover {
  background-color: #29abe2;
  fill: white;
  color: white;
}
.v2pnav-option__icon {
  width: 1.2em;
  height: 1.2em;
}
.mode-icon,
.mode-icon--dark-blue,
.mode-icon--dark-green-blue,
.mode-icon--live,
.mode-icon--student-paced,
.mode-icon--ended,
.mode-icon--off {
  width: 1.2em;
  height: 1.2em;
  position: relative;
}
.v2pnav-option__label {
  white-space: nowrap;
  margin-left: 0.9em;
  line-height: 1;
}
</style>

<script>
export default {
  props: {
    open: {
      type: Function,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },

    turnModel: {
      type: Function,
    },
    current_model: {
      type: String,
      default: "Insturctor-Paced",
    },
    isDashboard: {
      type: Boolean,
      default: false,
    },
    openProject: {
      type: Function,
    },
    slide_id: {
      type: String,
      default: "",
    },
    endLesson: {
      type: Function,
    },
    classRoomInfo: {
      type: Object,
      default: () => {
        return {};
      },
    },
    reopenClass: {
      type: Function,
    },
  },
  methods: {
    leavePage() {
      if (this.isDashboard) {
        let url = "https://docs.google.com/presentation/d/" + this.slide_id;
        console.log(this.slide_id);
        if (this.slide_id) {
          window.location = url;
        }
      } else {
        let url = "https://dev.classcipe.com/";
        window.location = url;
      }
    },

    reStartClassRoom() {
      console.log("reopen class!!");
      this.reopenClass();
    },
  },
};
</script>