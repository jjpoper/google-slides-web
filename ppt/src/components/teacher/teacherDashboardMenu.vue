<template>
  <div class="page">
    <div class="menu_line" @click="open(1)">
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
          ></path>
        </svg>
      </div>

      <div class="v2pnav-option__label" >
        Open Dashboard in New Window
      </div>
    </div>

        <div class="menu_line" @click="open(0)">
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
          ></path>
        </svg>
      </div>

      <div class="v2pnav-option__label" >
        Open Dashboard in New Device
      </div>
    </div>
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
  },
};
</script>