<template>
  <div class="panel">
    <div v-if="currentModel == 'Student-Paced'" class="arrow_opts">
      <button class="control-bar__button">
        <div class="control-bar__icon" @click="lastPage()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.12 60.82">
            <title>icon-control-btn__arrow</title>
            <path
              d="M14.44,31.91A8.54,8.54,0,0,0,17,38l8.93,9L39.47,60.67a5.64,5.64,0,0,0,8.15,0,6.58,6.58,0,0,0,0-8.93l-6.59-7-6.41-7-5.81-5.88,5.81-5.68,6.6-7,6.59-7a6.57,6.57,0,0,0,0-8.92,5.65,5.65,0,0,0-4.07-1.73,5.75,5.75,0,0,0-4.08,1.74L26.1,16.75l-8.93,8.93A8.71,8.71,0,0,0,14.44,31.91Z"
              transform="translate(-14.44 -1.59)"
            />
          </svg>
        </div>
      </button>

      <button class="control-bar__button--large">
        <div class="pageIndex">{{ currentPage }} of {{ totalPage }}</div>
      </button>

      <!-- <strong class="pageIndex"></strong> -->

      <button class="control-bar__button">
        <div class="control-bar__icon" @click="nextPage()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 35.12 60.82"
            class="svg_right"
          >
            <title>icon-control-btn__arrow</title>
            <path
              d="M14.44,31.91A8.54,8.54,0,0,0,17,38l8.93,9L39.47,60.67a5.64,5.64,0,0,0,8.15,0,6.58,6.58,0,0,0,0-8.93l-6.59-7-6.41-7-5.81-5.88,5.81-5.68,6.6-7,6.59-7a6.57,6.57,0,0,0,0-8.92,5.65,5.65,0,0,0-4.07-1.73,5.75,5.75,0,0,0-4.08,1.74L26.1,16.75l-8.93,8.93A8.71,8.71,0,0,0,14.44,31.91Z"
              transform="translate(-14.44 -1.59)"
            />
          </svg>
        </div>
      </button>
    </div>

    <div class="info_area">
      <div class="checkboxs">
        <el-checkbox :value="currentAnswerd" style="color: #fff">
          slide {{ currentPage }}/{{ totalPage }}
        </el-checkbox>
      </div>
    </div>
    <el-tooltip content="mark up" placement="top">
      <div
        class="readchat"
        @click="showStudentQuestions"
        :style="{ color: unread ? 'red' : '#fff' }"
      >
        <svg t="1623162085091" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2180" width="32" height="32"><path d="M893.11 338.64a25 25 0 0 0 12.45-33 47.51 47.51 0 0 1-1.9-4.91c-6.34-19.57-3.34-24.43 8-38.25l0.23-0.28a206.17 206.17 0 0 0 20.92-33.42c14-28.24 17.67-53.33 10.79-74.59-8.76-27.05-25.68-46.92-48.93-57.45a92.27 92.27 0 0 0-38.38-8A121.38 121.38 0 0 0 819 95a108 108 0 0 0-66.71 61 24.93 24.93 0 0 0 46 19.19 58.2 58.2 0 0 1 36.06-32.77 72.33 72.33 0 0 1 22.09-3.83c24.57 0 35.19 16.87 39.77 31 5 15.58-10.82 45.85-23.17 61.48-20.12 24.57-29.3 46.38-16.77 85.07a94.33 94.33 0 0 0 3.89 10.07 24.9 24.9 0 0 0 30.37 13.46 25.75 25.75 0 0 0 2.58-1.03zM902.92 377.09c-12.82 4.15-20 17.53-16 29.89s17.64 19 30.47 14.85 20-17.54 16-29.89-17.65-19-30.47-14.85z" fill="#F9DB91" p-id="2181"></path><path d="M415.43 285.61a324.81 324.81 0 1 0 229.69 95.14 322.69 322.69 0 0 0-229.69-95.14zM237.61 804.54c-73.39 0-133.11-59.71-133.11-133.11s59.72-133.11 133.11-133.11S370.72 598 370.72 671.43 311 804.54 237.61 804.54z m488.75-133.11c0 73.4-59.72 133.11-133.11 133.11s-133.12-59.71-133.12-133.11 59.72-133.11 133.12-133.11S726.36 598 726.36 671.43z" fill="#FFD4C7" p-id="2182"></path><path d="M237.608101 671.437414m-94.122984 94.122984a133.11 133.11 0 1 0 188.245967-188.245967 133.11 133.11 0 1 0-188.245967 188.245967Z" fill="#AEF0FF" p-id="2183"></path><path d="M593.230211 671.46001m-129.550521 30.5767a133.11 133.11 0 1 0 259.101042-61.153401 133.11 133.11 0 1 0-259.101042 61.153401Z" fill="#AEF0FF" p-id="2184"></path><path d="M582.138895 310.874744a56.38 47.85 35.59 1 0 55.695586-77.823465 56.38 47.85 35.59 1 0-55.695586 77.823465Z" fill="#EF6A6A" p-id="2185"></path><path d="M731.18 299.86c-25.32-18.12-58.31-15.39-73.69 6.1s-7.32 53.59 18 71.71 58.32 15.39 73.69-6.1 7.32-53.57-18-71.71z" fill="#EF6A6A" p-id="2186"></path><path d="M894.52 352a38 38 0 0 0 22.89-51.69 37.6 37.6 0 0 1-1.38-3.57c-2.94-9.08-2.79-12.71-2.44-14.06 0.68-2.62 4.31-7.29 8.13-11.94v-0.06l0.23-0.28 0.07-0.1a216.83 216.83 0 0 0 22.39-35.72c15.61-31.39 19.48-59.78 11.51-84.39a114.42 114.42 0 0 0-21.25-39A97.91 97.91 0 0 0 900 84.92a105.2 105.2 0 0 0-43.75-9.18A134.29 134.29 0 0 0 815 82.59 121 121 0 0 0 740.27 151a37.92 37.92 0 1 0 70 29.19 45.26 45.26 0 0 1 28.07-25.4 59.58 59.58 0 0 1 18.08-3.2c8.71 0 21 2.28 27.41 22 0.77 2.37 0.55 9.84-5.15 22.76a136.76 136.76 0 0 1-15.79 26.57c-9.15 11.18-19 25-23.24 43-3.81 16.29-2.47 33.52 4.24 54.23a110.52 110.52 0 0 0 4.41 11.43A37.92 37.92 0 0 0 894.52 352zM872 320.83a82.92 82.92 0 0 1-3.38-8.73c-10.62-32.8-4-50.33 14.53-72.91 9.77-12.32 33.26-49.42 25.42-73.63-8.44-26.06-27.19-40-52.14-40a85.26 85.26 0 0 0-26.1 4.46 71.2 71.2 0 0 0-44.05 40.13 11.92 11.92 0 1 1-22-9.18A95 95 0 0 1 823 107.32a108.32 108.32 0 0 1 33.32-5.58 79.44 79.44 0 0 1 33 6.86c19.82 9 34.32 26.14 41.92 49.61 5.8 17.91 2.41 39.71-10.06 64.8a192.17 192.17 0 0 1-19.44 31.1 1.71 1.71 0 0 0-0.11 0.14c-13.33 16.22-18.46 25.42-10.33 50.51a62.22 62.22 0 0 0 2.41 6.26 11.92 11.92 0 0 1-6 15.77 10 10 0 0 1-1.25 0.48 11.9 11.9 0 0 1-14.46-6.44zM927.16 366.64a37.66 37.66 0 0 0-28.25-1.92c-19.62 6.36-30.54 27.11-24.33 46.26a35.81 35.81 0 0 0 18.59 21.3 37.42 37.42 0 0 0 16.43 3.79 38.21 38.21 0 0 0 11.81-1.88 37.65 37.65 0 0 0 21.76-18.11 35.9 35.9 0 0 0-16-49.44z m-6.92 37.19a12.08 12.08 0 0 1-15.68 5.08 10.09 10.09 0 0 1-5.25-5.94c-1.78-5.51 1.63-11.58 7.61-13.51a12.16 12.16 0 0 1 3.79-0.61 11.5 11.5 0 0 1 5 1.16 10.06 10.06 0 0 1 5.26 5.93 10.07 10.07 0 0 1-0.73 7.89zM759.76 379.14c19.52-27.28 10.1-67.59-21-89.85-19.36-13.86-42.63-17.51-62.15-11.71a64 64 0 0 0-1.91-13.11c-4.15-16.53-14.55-31.44-29.3-42s-32.22-15.59-49.21-14.19c-17.79 1.47-32.92 9.75-42.62 23.29a54.8 54.8 0 0 0-7.41 14.58 345.62 345.62 0 0 0-133-25.6C220.11 221.78 64 378.64 64 572v222.42a62.36 62.36 0 0 0 62.37 62.36h57.93a337.73 337.73 0 0 0 462.22 0h58a62.36 62.36 0 0 0 62.37-62.36V574.27A352.06 352.06 0 0 0 721.8 401.8c15.2-2.36 28.91-10.01 37.96-22.66zM574.7 246.7c5.18-7.23 13.57-11.68 23.62-12.51 1.16-0.09 2.32-0.14 3.49-0.14a49.26 49.26 0 0 1 28.45 9.56c9.74 7 16.56 16.63 19.22 27.19 2.45 9.78 0.95 19.16-4.23 26.39-11.18 15.63-36.1 17-55.55 3.1-9.75-7-16.57-16.63-19.22-27.19-2.48-9.79-0.96-19.16 4.22-26.4zM180.79 503l329.71 0.53 25-81.76 27 81.08 87.66 0.53c1.35 10.24 2.15 21.91 2.52 34.55a146.17 146.17 0 0 0-204.96 120.5h-64.58A146.16 146.16 0 0 0 178.2 537.92a346.11 346.11 0 0 1 2.59-34.92z m-28.11 253.36a120.11 120.11 0 1 1 84.93 35.18 119.34 119.34 0 0 1-84.93-35.18z m472.06 85.21a311.42 311.42 0 0 1-414.56 3.6q-0.06-15.1-0.1-30.23a146.2 146.2 0 0 0 173.06-130.51h64.58a146.23 146.23 0 0 0 181.36 128.68c-1.91 12.98-3.45 22.89-4.34 28.46z m53.44-85.21a120.11 120.11 0 1 1 35.18-84.93 119.32 119.32 0 0 1-35.18 84.93zM738.61 364c-11.18 15.62-36.1 17-55.55 3.09s-26.18-38-15-53.58c6-8.4 16-12.69 27-12.69a49.69 49.69 0 0 1 28.58 9.6c19.43 13.93 26.15 37.96 14.97 53.58z" fill="#512C56" p-id="2187"></path></svg>
      </div>
    </el-tooltip>
    <i
      class="el-icon-chat-dot-round readchat"
      @click="showStudentModal"
      :style="{ color: unread ? 'red' : '#fff' }"
    />
  </div>
</template>

<style scoped>
.arrow_opts {
  display: flex;
  width: auto;
  height: 100%;
}
.panel {
  display: flex;
  justify-content: start;
  width: 100%;
  height: 100%;
}
.svg_right {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.control-bar__button,
.control-bar__button--large,
.control-bar__button--lock {
  display: block;
  position: relative;
  height: auto;
  padding: 0.5em;
  background-color: transparent;
  border: 0px solid transparent;
  opacity: 1;
  text-align: center;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
  cursor: pointer;
}
.control-bar__icon,
.control-bar__icon--flip {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  width: 0.9em;
  height: auto;
  fill: #ffffff;
}

.control-bar__icon:hover {
  fill: #c0c0c0;
}

.control-bar__button--large {
  min-width: 4.375em;
  min-height: 50px;
}

.control-bar__label {
  position: relative;
  display: none;
  font-size: 13px;
  color: #ffffff;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
}
.icon {
  fill: #ffffff;
  cursor: pointer;
}
.icon:hover {
  fill: antiquewhite;
}
.icon_left {
  margin-left: 20px;
}
.pageIndex {
  color: white;
  font-size: 20px;
  height: 100%;
  display: flex;
  align-items: center;
}

.checkboxs {
  height: 100%;
  display: flex;
  align-items: center;
}

.info_area {
  width: auto;
  height: 100%;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}

.readchat {
  font-size: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 50px;
}
</style>
<script>
import { ClassRoomModelEnum } from "../../socket/socketEvents";
export default {
  props: {
    currentPage: {
      type: Number,
      default: 0,
    },
    totalPage: {
      type: Number,
      default: 0,
    },
    lastPage: {
      type: Function,
    },
    nextPage: {
      type: Function,
    },
    currentModel: {
      type: String,
      default: ClassRoomModelEnum.TEACHER_MODEL,
    },
    currentAnswerd: {
      type: Boolean,
    },
    unread: {
      type: Boolean,
      default: false,
    },
    showStudentModal: {
      type: Function,
    },
    showStudentQuestions: {
      type: Function,
    }
  },
};
</script>