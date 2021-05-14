<template>
  <div class="page">
    <img src="../../assets/class_logo.png" />

    <div v-if="showOpt">
      <div class="climate-message__text--secondary">
        That’s it! Your teacher has ended this lesson.
      </div>

      <div class="climate-message__text--primary">How did it go?</div>

      <div class="opt_area">
        <button
          class="climate-button--thumbs-up is-showing"
          @click="feedback('good')"
        >
          <div class="u-icon">
            <!--?xml version="1.0" encoding="utf-8"?-->
            <!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->

            <svg
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="97 62 22 22"
              enable-background="new 97 62 22 22"
              xml:space="preserve"
            >
              <g>
                <path
                  d="M118.2,74.2c0.5-0.6,0.8-1.3,0.8-2.1c0-0.7-0.3-1.4-0.8-1.9c-0.5-0.5-1.1-0.8-1.9-0.8h-3.8c0-0.1,0.1-0.2,0.1-0.3
		s0.1-0.2,0.2-0.3c0.1-0.1,0.1-0.2,0.1-0.3c0.2-0.3,0.3-0.6,0.4-0.8c0.1-0.2,0.2-0.5,0.3-0.9c0.1-0.4,0.1-0.7,0.1-1.1
		c0-0.2,0-0.4,0-0.6c0-0.1,0-0.4-0.1-0.6c0-0.3-0.1-0.5-0.2-0.7c-0.1-0.2-0.2-0.4-0.3-0.6c-0.2-0.2-0.3-0.4-0.6-0.6
		c-0.2-0.1-0.5-0.3-0.8-0.4s-0.7-0.2-1.1-0.2c-0.2,0-0.4,0.1-0.6,0.3c-0.2,0.2-0.3,0.4-0.5,0.7c-0.1,0.3-0.2,0.5-0.3,0.7
		c-0.1,0.2-0.1,0.5-0.2,0.9c-0.1,0.4-0.1,0.7-0.2,0.9c0,0.2-0.1,0.4-0.2,0.7c-0.1,0.3-0.3,0.5-0.4,0.7c-0.3,0.3-0.8,0.9-1.4,1.7
		c-0.4,0.6-0.9,1.2-1.4,1.7c-0.5,0.5-0.8,0.8-1,0.8c-0.2,0-0.4,0.1-0.6,0.3c-0.2,0.2-0.2,0.4-0.2,0.6v9.2c0,0.2,0.1,0.5,0.3,0.6
		c0.2,0.2,0.4,0.3,0.6,0.3c0.3,0,1,0.2,2.2,0.6c0.7,0.2,1.3,0.4,1.7,0.6c0.4,0.1,1,0.3,1.7,0.4c0.7,0.1,1.4,0.2,2,0.2h0.2h1h0.5
		c1.2,0,2.1-0.4,2.7-1.1c0.5-0.7,0.8-1.5,0.7-2.6c0.4-0.4,0.6-0.8,0.7-1.3c0.2-0.6,0.2-1.1,0-1.7c0.4-0.6,0.6-1.2,0.6-2
		C118.4,75,118.4,74.6,118.2,74.2z"
                />
                <path
                  d="M101.8,71.2h-4c-0.2,0-0.4,0.1-0.6,0.3c-0.2,0.2-0.3,0.4-0.3,0.6v9.2c0,0.2,0.1,0.5,0.3,0.6c0.2,0.2,0.4,0.3,0.6,0.3h4
		c0.2,0,0.4-0.1,0.6-0.3c0.2-0.2,0.3-0.4,0.3-0.6v-9.2c0-0.2-0.1-0.5-0.3-0.6C102.3,71.3,102.1,71.2,101.8,71.2z M100.3,80.1
		c-0.2,0.2-0.4,0.3-0.6,0.3c-0.2,0-0.5-0.1-0.6-0.3c-0.2-0.2-0.3-0.4-0.3-0.7c0-0.2,0.1-0.5,0.3-0.6c0.2-0.2,0.4-0.3,0.6-0.3
		c0.2,0,0.4,0.1,0.6,0.3c0.2,0.2,0.3,0.4,0.3,0.6C100.5,79.7,100.4,79.9,100.3,80.1z"
                />
              </g>
            </svg>
          </div>
        </button>

        <button
          class="climate-button--thumbs-down is-showing"
          @click="feedback('bad')"
        >
          <div class="u-icon">
            <!--?xml version="1.0" encoding="utf-8"?-->
            <!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->

            <svg
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="-20 22 22 22"
              style="enable-background: new -20 22 22 22"
              xml:space="preserve"
            >
              <g>
                <path
                  d="M-19.2,31.7c-0.5,0.6-0.8,1.3-0.8,2.1c0,0.7,0.3,1.4,0.8,1.9s1.1,0.8,1.9,0.8h3.8c0,0.1-0.1,0.2-0.1,0.3s-0.1,0.2-0.2,0.3
		c-0.1,0.1-0.1,0.2-0.1,0.3c-0.2,0.3-0.3,0.6-0.4,0.8c-0.1,0.2-0.2,0.5-0.3,0.9c-0.1,0.4-0.1,0.7-0.1,1.1c0,0.2,0,0.4,0,0.6
		c0,0.1,0,0.4,0.1,0.6c0,0.3,0.1,0.5,0.2,0.7s0.2,0.4,0.3,0.6c0.2,0.2,0.3,0.4,0.6,0.6c0.2,0.1,0.5,0.3,0.8,0.4s0.7,0.2,1.1,0.2
		c0.2,0,0.4-0.1,0.6-0.3s0.3-0.4,0.5-0.7c0.1-0.3,0.2-0.5,0.3-0.7c0.1-0.2,0.1-0.5,0.2-0.9s0.1-0.7,0.2-0.9c0-0.2,0.1-0.4,0.2-0.7
		c0.1-0.3,0.3-0.5,0.4-0.7c0.3-0.3,0.8-0.9,1.4-1.7c0.4-0.6,0.9-1.2,1.4-1.7s0.8-0.8,1-0.8s0.4-0.1,0.6-0.3c0.2-0.2,0.2-0.4,0.2-0.6
		v-9.2c0-0.2-0.1-0.5-0.3-0.6c-0.2-0.2-0.4-0.3-0.6-0.3c-0.3,0-1-0.2-2.2-0.6C-8.4,23-9,22.8-9.4,22.6c-0.4-0.1-1-0.3-1.7-0.4
		s-1.4-0.2-2-0.2h-0.2h-1h-0.5c-1.2,0-2.1,0.4-2.7,1.1c-0.5,0.7-0.8,1.5-0.7,2.6c-0.4,0.4-0.6,0.8-0.7,1.3c-0.2,0.6-0.2,1.1,0,1.7
		c-0.4,0.6-0.6,1.2-0.6,2C-19.4,30.9-19.4,31.3-19.2,31.7z"
                />
                <path
                  d="M-2.8,34.7h4c0.2,0,0.4-0.1,0.6-0.3C2,34.2,2.1,34,2.1,33.8v-9.2c0-0.2-0.1-0.5-0.3-0.6c-0.2-0.2-0.4-0.3-0.6-0.3h-4
		c-0.2,0-0.4,0.1-0.6,0.3c-0.2,0.2-0.3,0.4-0.3,0.6v9.2c0,0.2,0.1,0.5,0.3,0.6C-3.3,34.6-3.1,34.7-2.8,34.7z M-1.3,25.8
		c0.2-0.2,0.4-0.3,0.6-0.3s0.5,0.1,0.6,0.3c0.2,0.2,0.3,0.4,0.3,0.7c0,0.2-0.1,0.5-0.3,0.6c-0.2,0.2-0.4,0.3-0.6,0.3
		s-0.4-0.1-0.6-0.3c-0.2-0.2-0.3-0.4-0.3-0.6C-1.5,26.2-1.4,26-1.3,25.8z"
                />
              </g>
            </svg>
          </div>
        </button>
      </div>
    </div>
    <div class="end_note" v-else>
      <div class="climate-message__text--primary ng-scope">
        Your teacher has ended this session.
      </div>
      <div class="climate-message__text--secondary">
        Thanks for your feedback!
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #344141;
}
.climate-message__text--secondary {
  color: #b3b3b3;
  font-size: 1.3em;
}
.climate-message__text--primary {
  color: #ffffff;
  font-size: 2.15em;
}

img {
  width: 500px;
  height: 131px;
  margin-bottom: 20px;
}

.opt_area {
  display: flex;
  margin-top: 15px;
  justify-content: center;
}

.end_note {
  display: flex;
  flex-direction: column;
}

.climate-button--thumbs-up.is-showing {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.climate-button.is-showing,
.is-showing.climate-button--positive,
.is-showing.climate-button--neutral,
.is-showing.climate-button--negative,
.is-showing.climate-button--thumbs-up,
.is-showing.climate-button--thumbs-down {
  display: inline-block;
  opacity: 1;
  -webkit-animation-name: climate-button-in;
  animation-name: climate-button-in;
  -webkit-animation-duration: 0.2s;
  animation-duration: 0.2s;
  -webkit-animation-fill-mode: backwards;
  animation-fill-mode: backwards;
}
.climate-button .u-icon,
.climate-button--positive .u-icon,
.climate-button--neutral .u-icon,
.climate-button--negative .u-icon,
.climate-button--thumbs-up .u-icon,
.climate-button--thumbs-down .u-icon {
  display: block;
  width: 100%;
  height: 100%;
}

.climate-button,
.climate-button--positive,
.climate-button--neutral,
.climate-button--negative,
.climate-button--thumbs-up,
.climate-button--thumbs-down {
  display: none;
  width: 3.75em;
  height: 3.75em;
  margin: 0 0.75em;
  padding: 0.375em;
  background: #ffffff;
  border: 0;
  border-radius: 1.875em;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0) !important;
  -webkit-focus-ring-color: rgba(255, 255, 255, 0) !important;
  outline: none !important;
  cursor: pointer;
}

.icon,
.u-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
}

.climate-button--thumbs-up svg {
  fill: #7d9100;
}

.icon svg,
.u-icon svg {
  display: block;
}

.climate-button--thumbs-down svg {
  fill: #d95b5d;
}
</style>

<script>
import { feedbackClass } from "../../model/index";
export default {
  props: {
    token: {
      type: String,
      default: "",
    },
    class_id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showOpt: true,
    };
  },
  methods: {
    feedback(result) {
      feedbackClass(this.token, this.class_id, result)
        .then((res) => {
          this.showOpt = false;
        })
        .catch((res) => {});
    },
  },
};
</script>