<template>
  <div class="page">
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
          />
        </svg>
      </div>

      <div class="v2pnav-option__label">Open Dashboard in New Window</div>
    </div>

    <!-- <div class="menu_line" @click="open(0)">
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

      <div class="v2pnav-option__label">Open Dashboard in New Device</div>
    </div>-->

    <div class="menu_line" @click="_turnModel()">
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

      <div
        class="v2pnav-option__label"
      >Turn {{current_model=='student-paced'?'Off':'On'}} Student-Paced</div>
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
      type: Function
    },

    turnModel: {
      type: Function
    },
    current_model: {
      type: String,
      default: 'student-paced'
    }
  },
  methods:{
    _turnModel(){
      // if(this.current_model == 'student-paced'){
      //   this.current_model = 'Insturctor-Paced'
      // }else{
      //   this.current_model = 'student-paced'
      // }
      this.turnModel();
    }
  }
};
</script>