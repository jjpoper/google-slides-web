<template>
  <div class="remark-modal">
    <div class="remark-mask-inner">
      <div class="pointer-area"
        @click="markup($event)"
        @mousedown="startMove($event)"
        @mousemove="mouseMoving($event)"
        @mouseup="mouseEnd($event)"
        @mouseleave="mouseEnd($event)"
        onselectstart="return false"
        @drag="pauseEvent($event)"
        >
        <template v-for="(item, index) in marks.concat(currentMark)">
          <div
            :key="item.id"
            v-if="item.pointType !== 'box'" 
            :class="`markitem ${currentRemarkIndex === index ? 'markitemhover' : ''}`"
            :style="`top:${item.top}px;left:${item.left}px;`"
            @mousedown.stop="selectMark(item, index)"
            @click.stop
          >
            <div class="innermark" :style="`background-color:${item.background || 'red'}; `"/>
          </div>
          <div
            :key="item.id"
            v-else-if="item.pointType === 'box'"
            :class="`markitembox ${currentRemarkIndex === index ? 'markitemhover' : ''}`"
            :style="`top:${item.top - 6}px; left:${item.left - 6}px;`"
            @mousedown.stop="selectMark(item, index)"
            @click.stop
          >
            <div
              :style="`width:${item.width}px;
              height:${item.height}px;
              border: 2px solid ${item.background}`"
            />
          </div>
        </template>  
        <div v-if="markType === 2 && isBoxing" class="dragbg" @click.stop/>
        <div
          v-if="markType === 2 && isBoxing"
          :style="`width:${Math.abs(nextPosition.offsetX - currentPosition.offsetX)}px;
          height:${Math.abs(nextPosition.offsetY - currentPosition.offsetY)}px;
          position: absolute;
          left: ${Math.min(currentPosition.offsetX, nextPosition.offsetX)}px;
          top: ${Math.min(currentPosition.offsetY, nextPosition.offsetY)}px;
          border: 2px solid ${this.color}`">
        </div>
      </div>
      <div class="canvasmodal" @mouseleave="leaveModal" v-show="modalVisable">
        <i class="el-icon-circle-close closemodal" style="font-size: 30px" @click="hideModal"></i>
        <div class="colorList">
          <span v-for="item in colors" :key="item" @click="changeColor(item)" :style="`background-color: ${item}`" class="colors"></span>
        </div>
      </div>
      <div class="canvasfooter">
        <el-tooltip content="change color" placement="top">
          <div :style="`background-color: ${color}`"  @click="showModal"></div>
        </el-tooltip>
        <el-tooltip content="mark" placement="top">
          <div class="eraser" @click="changeMarkType(1)">
            <svg
              t="1622035315247"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5489"
              width="32"
              height="32"
            >
              <path
                d="M197.973333 546.133333c-3.413333-3.413333-10.24-6.826667-17.066666-3.413333-6.826667 0-10.24 6.826667-10.24 13.653333-6.826667 68.266667-44.373333 150.186667-98.986667 218.453334-6.826667 6.826667-3.413333 17.066667 0 23.893333l37.546667 37.546667-105.813334 105.813333c-3.413333 6.826667-3.413333 13.653333-3.413333 17.066667 0 6.826667 6.826667 10.24 13.653333 13.653333l136.533334 34.133333h3.413333c3.413333 0 10.24-3.413333 13.653333-3.413333l54.613334-54.613333 20.48 20.48c3.413333 3.413333 6.826667 3.413333 13.653333 3.413333 3.413333 0 6.826667 0 10.24-3.413333l51.2-30.72c58.026667-37.546667 116.053333-61.44 170.666667-68.266667 6.826667 0 13.653333-6.826667 13.653333-10.24 3.413333-6.826667 0-13.653333-3.413333-17.066667L197.973333 546.133333zM993.28 116.053333l-68.266667-68.266666c-34.133333-34.133333-92.16-40.96-133.12-10.24L204.8 477.866667c-3.413333 3.413333-6.826667 6.826667-6.826667 13.653333 0 3.413333 0 10.24 3.413334 13.653333l334.506666 334.506667c3.413333 3.413333 6.826667 3.413333 13.653334 3.413333 3.413333 0 10.24-3.413333 13.653333-6.826666L1003.52 249.173333c30.72-40.96 27.306667-95.573333-10.24-133.12z"
                :fill="`${markType == 1 ? color : 'rgb(212 208 208)'}`"
                p-id="5490"
              />
            </svg>
          </div>
        </el-tooltip>
        <el-tooltip content="select area" placement="top">
          <div class="eraser" @click="changeMarkType(2)">
            <svg t="1624363538135" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4366" width="32" height="32"><path d="M896 773.888V250.112c37.248-13.184 64-48.32 64-90.112a95.68 95.68 0 1 0-186.112-32H250.112A95.68 95.68 0 0 0 64 160c0 41.728 26.816 76.928 64 90.112v523.776A95.68 95.68 0 0 0 160 960c41.728 0 76.928-26.752 90.112-64h523.776c13.184 37.248 48.384 64 90.112 64a96 96 0 0 0 96-96c0-41.728-26.752-76.928-64-90.112z m-704 0V250.112c27.136-9.664 48.448-30.976 58.112-58.112h523.776c9.6 27.136 30.912 48.512 58.112 58.112v523.776c-27.2 9.6-48.512 30.912-58.112 58.112H250.112A95.424 95.424 0 0 0 192 773.888z" p-id="4367"
            :fill="`${markType == 2 ? color : 'rgb(212 208 208)'}`"></path></svg>
          </div>
        </el-tooltip>
        <el-tooltip content="color palette" placement="top">
          <div @click="showDiy" style="cursor: pointer">
            <svg t="1621982841375" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1892" width="32" height="32"><path d="M512 1024C230.4 1024 0 793.6 0 512S230.4 0 512 0s512 230.4 512 512-230.4 512-512 512z" fill="#EC6646" p-id="1893"></path><path d="M619.664 259.504l-74.472-15.992-147.808 17.352s-18.352-16.56-8.16-66.384c-60.16 26.432-55.064 106.76-55.064 106.76s-99.656 111.84-108.08 158.616c-8.416 46.768-14.864 94.56-5.096 145.392 9.776 50.84 78.768 143.032 78.768 143.032l185.768 275.024c8.776 0.464 17.6 0.696 26.48 0.696 281.6 0 512-230.4 512-512 0-32.72-3.232-64.712-9.176-95.768l-395.16-156.728z" fill="#BF4231" p-id="1894"></path><path d="M648.248 670.168c47.976-3.288 87.272-24.488 117.088-61.944 39.456-49.568 44.968-106.08 27.896-164.824-28.112-96.72-92.4-158.592-185.904-188.712-21.456-6.912-66.656-24.992-158.648-3.664-16.776 3.592-24.136 6.256-39.648 12.552 0 0-86.488 46.544-111.752 73.264-43.512 46.016-69.12 105.232-77.048 167.824-13.256 104.592 38.432 211.024 124.064 270.552 45.216 31.424 100.776 51.424 156.168 51.88 29.968 0.248 55.944-10.872 64.952-41.928 5.056-17.424 1.24-32.296-7.896-47.448-8.04-13.336-20.856-22.736-11.848-39.776" fill="#DACEB6" p-id="1895"></path><path d="M646.76 679.432a6.306 6.306 0 0 1-6.28-5.864 6.308 6.308 0 0 1 5.848-6.72c45.728-3.136 83.616-23.184 112.592-59.592 35.496-44.592 44.504-98.128 26.776-159.128-26.792-92.2-87.952-154.264-181.784-184.48l-3.936-1.296c-23.176-7.664-66.304-21.968-151.376-2.24-16.504 3.528-23.712 6.168-38.704 12.256-3.192 1.336-6.888-0.232-8.2-3.464a6.292 6.292 0 0 1 3.464-8.2c15.728-6.4 23.312-9.16 40.696-12.888 88.384-20.48 135.456-4.912 158.072 2.576l3.84 1.264c98.048 31.584 161.984 96.504 190.016 192.952 18.936 65.168 9.168 122.528-29.016 170.504-31.28 39.288-72.184 60.928-121.584 64.312-0.128 0-0.28 0.008-0.424 0.008M499.92 836.36h-0.992c-54.464-0.448-111.184-19.288-159.704-53.016-90.312-62.776-140.056-171.312-126.72-276.512 8.352-65.856 35.568-125.096 78.688-171.336a6.312 6.312 0 0 1 8.904-0.312 6.306 6.306 0 0 1 0.312 8.904c-41.312 44.288-67.392 101.112-75.408 164.32-12.552 99.048 36.24 205.392 121.408 264.592 46.472 32.304 100.672 50.328 152.632 50.752 31.624 0.672 51.576-12.32 58.856-37.392 4.12-14.208 1.88-27.296-7.248-42.44-1.656-2.752-3.528-5.328-5.36-7.84-7.28-10-15.536-21.336-6.656-38.128 1.64-3.064 5.44-4.256 8.512-2.632a6.292 6.292 0 0 1 2.632 8.512c-4.992 9.424-1.664 14.712 5.704 24.832 2.032 2.808 4.112 5.672 5.96 8.744 10.952 18.16 13.672 34.832 8.552 52.456-8.72 30.016-33.584 46.496-70.072 46.496" fill="#474341" p-id="1896"></path><path d="M725.272 496.496c0 25.16-20.392 45.552-45.552 45.552s-45.552-20.392-45.552-45.552 20.392-45.552 45.552-45.552 45.552 20.392 45.552 45.552" fill="#E9495B" p-id="1897"></path><path d="M679.72 546.456c-27.544 0-49.96-22.408-49.96-49.96s22.408-49.96 49.96-49.96c27.544 0 49.96 22.408 49.96 49.96 0 27.544-22.408 49.96-49.96 49.96m0-91.096c-22.688 0-41.144 18.456-41.144 41.144s18.456 41.136 41.144 41.136 41.144-18.448 41.144-41.136-18.456-41.144-41.144-41.144" fill="#474341" p-id="1898"></path><path d="M617.512 356.52c0 25.16-20.392 45.552-45.552 45.552s-45.552-20.392-45.552-45.552 20.392-45.552 45.552-45.552 45.552 20.392 45.552 45.552" fill="#92BE33" p-id="1899"></path><path d="M571.968 406.48c-27.544 0-49.96-22.408-49.96-49.96s22.408-49.96 49.96-49.96 49.96 22.408 49.96 49.96c-0.008 27.552-22.416 49.96-49.96 49.96m0-91.096c-22.688 0-41.144 18.456-41.144 41.144s18.456 41.136 41.144 41.136 41.144-18.448 41.144-41.136c-0.008-22.688-18.464-41.144-41.144-41.144" fill="#474341" p-id="1900"></path><path d="M355.208 361.896c-11.368 8.28-18.76 21.696-18.76 36.84 0 25.16 20.392 45.552 45.552 45.552 13.424 0 25.488-5.808 33.824-15.048l-14.52-54.944-46.096-12.4z" fill="#EC6646" p-id="1901"></path><path d="M382 448.696c-27.544 0-49.96-22.408-49.96-49.96 0-15.928 7.688-31.024 20.568-40.408a4.416 4.416 0 0 1 6.16 0.968c1.432 1.968 1 4.72-0.968 6.16a41.294 41.294 0 0 0-16.944 33.272c0 22.688 18.456 41.144 41.144 41.144 11.624 0 22.768-4.96 30.56-13.592 1.616-1.8 4.408-1.96 6.224-0.32 1.816 1.632 1.952 4.416 0.32 6.224A50.046 50.046 0 0 1 382 448.696" fill="#474341" p-id="1902"></path><path d="M367.56 559.816c0 25.16-20.392 45.552-45.552 45.552s-45.552-20.392-45.552-45.552 20.392-45.552 45.552-45.552 45.552 20.392 45.552 45.552" fill="#F7BE15" p-id="1903"></path><path d="M322.008 609.776c-27.544 0-49.96-22.408-49.96-49.96s22.408-49.96 49.96-49.96c27.544 0 49.96 22.408 49.96 49.96s-22.416 49.96-49.96 49.96m0-91.096c-22.688 0-41.144 18.456-41.144 41.144s18.456 41.136 41.144 41.136 41.144-18.448 41.144-41.136-18.456-41.144-41.144-41.144" fill="#474341" p-id="1904"></path><path d="M456.432 698.68c0 25.16-20.392 45.552-45.552 45.552s-45.552-20.392-45.552-45.552 20.392-45.552 45.552-45.552 45.552 20.392 45.552 45.552" fill="#0F95BC" p-id="1905"></path><path d="M410.88 748.64c-27.544 0-49.96-22.408-49.96-49.96s22.408-49.96 49.96-49.96 49.96 22.408 49.96 49.96-22.416 49.96-49.96 49.96m0-91.096c-22.688 0-41.144 18.456-41.144 41.144s18.456 41.136 41.144 41.136 41.144-18.448 41.144-41.136c0-22.688-18.456-41.144-41.144-41.144M748.288 566.328a4.42 4.42 0 0 1-3.856-6.552c5.552-9.984 9.744-20.52 12.464-31.336 0.6-2.352 2.952-3.76 5.352-3.2a4.416 4.416 0 0 1 3.2 5.352c-2.912 11.56-7.392 22.816-13.312 33.464a4.384 4.384 0 0 1-3.848 2.272M764.336 515.496c-0.144 0-0.272-0.008-0.416-0.016a4.412 4.412 0 0 1-3.984-4.8c4.56-48.816-13.336-98.712-50.392-140.496a4.414 4.414 0 0 1 0.368-6.224 4.392 4.392 0 0 1 6.224 0.376c38.704 43.632 57.368 95.896 52.576 147.16a4.398 4.398 0 0 1-4.376 4" fill="#474341" p-id="1906"></path><path d="M550.712 552.856c-24.752-46.208-48.096-84.968-70.736-118.608l-55.112 29.496c15.512 37.68 36.48 81.968 61.36 128.448 66.008 123.328 134.432 215.336 152.824 205.488 17.016-9.104-14.76-102.224-71.904-213.784" fill="#FDFBF8" p-id="1907"></path><path d="M636.4 804.592c-43.12 0.024-150.944-200.504-155.728-209.432-24.12-45.056-45.44-89.664-61.632-129.008a6.298 6.298 0 0 1 2.856-7.952l55.12-29.496a6.322 6.322 0 0 1 8.192 2.04c23.832 35.416 47.072 74.4 71.064 119.152a6.3 6.3 0 1 1-11.104 5.952c-22.72-42.4-44.744-79.528-67.24-113.344l-45.064 24.112c15.752 37.656 36.056 79.92 58.912 122.608 74.976 140.096 133.008 205.56 144.384 202.88 6.864-6.448-8.104-75.448-74.624-205.328a6.308 6.308 0 0 1 2.736-8.48 6.294 6.294 0 0 1 8.48 2.736c10.664 20.832 103.232 204.024 69.264 222.216-1.712 0.912-3.592 1.344-5.616 1.344" fill="#474341" p-id="1908"></path><path d="M425.256 464.168l54.36-29.096 67.904 114.376v5.184l-62.208 32.584z" fill="#8B7A5C" p-id="1909"></path><path d="M401.624 379.792l20.904-11.184 57.088 66.464-54.36 29.096z" fill="#FDFBF8" p-id="1910"></path><path d="M425.264 470.464c-0.848 0-1.688-0.168-2.472-0.504a6.38 6.38 0 0 1-3.6-4.096l-23.64-84.368a6.312 6.312 0 0 1 3.088-7.256l20.904-11.192a6.3 6.3 0 0 1 7.752 1.448l57.096 66.472c1.24 1.448 1.76 3.384 1.4 5.256a6.294 6.294 0 0 1-3.216 4.4l-54.36 29.088a6.068 6.068 0 0 1-2.952 0.752m-16.216-87.496l20.16 71.944 40.512-21.688-48.688-56.68-11.984 6.424zM485.568 592.544a6.312 6.312 0 0 1-5.608-3.408 6.296 6.296 0 0 1 2.704-8.488l64.192-33.096a6.304 6.304 0 0 1 5.784 11.2l-64.192 33.096a6.336 6.336 0 0 1-2.88 0.696" fill="#474341" p-id="1911"></path><path d="M343.96 346.4c14.328 26.776 46.784 37.336 72.472 23.584 25.696-13.752 34.904-46.608 20.576-73.384-5.432-10.16-13.488-17.968-22.776-23.016-8.312-7-18.512-11.776-25.744-19.904-14.32-16.104-11.312-44.384 6.064-57.12-19.872-3.088-40.912 10.728-47.976 29.552-24.752 65.984-7.08 111.952-2.616 120.288" fill="#F7BE15" p-id="1912"></path><path d="M392.4 382.288c-21.584 0-42.816-12.008-54-32.92v0.008c-0.264-0.496-26.016-50.08 2.288-125.48 8.368-22.288 32.392-37.096 54.832-33.56a6.296 6.296 0 0 1 2.752 11.304c-6.856 5.032-11.368 13.36-12.384 22.88-1.008 9.512 1.648 18.616 7.296 24.976 3.856 4.32 8.848 7.696 14.144 11.272 3.48 2.352 7.072 4.776 10.464 7.584 10.472 5.816 19.024 14.536 24.768 25.256 15.944 29.808 5.552 66.552-23.16 81.92a56.94 56.94 0 0 1-27 6.76m-12.616-178.584c-11.896 3.272-22.792 12.592-27.312 24.624-26.304 70.12-3.2 114.672-2.952 115.104v0.008c12.672 23.672 41.36 33.088 63.944 20.992 22.584-12.088 30.664-41.192 17.984-64.864-4.68-8.728-11.672-15.8-20.224-20.44a6.396 6.396 0 0 1-1.048-0.72c-3.032-2.544-6.368-4.8-9.904-7.192-5.696-3.856-11.584-7.832-16.488-13.352-8-9-11.8-21.648-10.416-34.68 0.752-7.088 2.984-13.744 6.416-19.48M478.856 521.728c-6.064-12.936-12.416-25.576-19.584-37.944-2.864-4.952-10.544-0.48-7.672 4.48 7.16 12.368 13.52 25.016 19.584 37.944 2.424 5.184 10.088 0.672 7.672-4.48M496.128 553.936a157.57 157.57 0 0 1-7.632-13.552c-2.568-5.112-10.232-0.616-7.672 4.488a161.83 161.83 0 0 0 7.632 13.544c3.04 4.832 10.728 0.376 7.672-4.48" fill="#474341" p-id="1913"></path><path d="M382.384 308.68c-18.184-28.824-36.536-59.848-26.16-95.032 1.624-5.496-6.952-7.848-8.568-2.368-11.072 37.536 7.512 70.896 27.056 101.88 3.04 4.832 10.736 0.376 7.672-4.48M359.92 327.536c-10.432-20.064-20.192-40.2-18.08-63.392 0.52-5.688-8.368-5.656-8.888 0-2.248 24.648 8.208 46.552 19.288 67.872 2.648 5.08 10.32 0.592 7.68-4.48M256.784 478.264c-0.4 0-0.808-0.048-1.216-0.176a4.402 4.402 0 0 1-3.024-5.448c12.632-44.024 35.688-84.856 66.696-118.08a4.41 4.41 0 0 1 6.44 6.024c-30.048 32.208-52.408 71.8-64.656 114.488a4.406 4.406 0 0 1-4.24 3.192M245.624 557.264h-0.008a4.406 4.406 0 0 1-4.4-4.416c0.032-18.656 1.856-37.376 5.408-55.624 0.48-2.408 2.808-3.904 5.176-3.488a4.43 4.43 0 0 1 3.488 5.176 285.434 285.434 0 0 0-5.248 53.96 4.42 4.42 0 0 1-4.416 4.392M418.272 792.704c-0.544 0-1.096-0.104-1.632-0.312a241.914 241.914 0 0 1-40.704-20.88 4.41 4.41 0 0 1-1.336-6.088 4.428 4.428 0 0 1 6.096-1.336 232.544 232.544 0 0 0 39.208 20.12 4.412 4.412 0 0 1 2.464 5.728 4.42 4.42 0 0 1-4.096 2.768M491.296 808.968c-16.016 0-35.128-3.472-57.296-10.424a4.406 4.406 0 0 1-2.888-5.528 4.396 4.396 0 0 1 5.528-2.888c57.256 17.968 91.808 11.664 102.72-18.736a4.41 4.41 0 0 1 5.632-2.664 4.4 4.4 0 0 1 2.664 5.632c-8.272 23.056-27.16 34.608-56.36 34.608M425.272 470.464a6.298 6.298 0 0 1-2.976-11.856l54.352-29.096a6.308 6.308 0 0 1 8.528 2.592 6.286 6.286 0 0 1-2.592 8.52l-54.352 29.096c-0.944 0.504-1.96 0.744-2.96 0.744" fill="#474341" p-id="1914"></path></svg>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
import { ModalEventsTypeEnum } from "@/socket/socketEvents";
import colorSelector from '@/utils/color'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      ModalEventsTypeEnum,
      currentPosition: {
        left: 0,
        top: 0,
        content_width: 0,
        content_height: 0,
        offsetX: 0,
        offsetY: 0,
        background: '#caf982',
        width: 0,
        height: 0,
        pointType: 'point'
      },
      currentMark: [],
      nextPosition: {offsetX: 0, offsetY: 0},
      buttonVisiable: false,
      recordVisiable: false,
      sendBusyStatus: false,
      modalVisable: false,
      color: '#caf982',
      colors: ['#caf982', 'red', '#ec808d', '#facd91', '#ffff80', '#80ffff', '#81d3f8', '#8080ff', '#c280ff'],
      widthValue: 3,
      markType: 1, // 1 == point  2 = box
      isBoxing: false,
      buttonPosition: {left: 0, top: 0},
    };
  },
  computed: {
    ...mapState({
      // currentReamrkList: state => state.remark.currentReamrkList,
      allRemarks: state => state.remark.allRemarks,
      currentInputType: state => state.remark.currentInputType,
      currentRemarkIndex: state => state.remark.currentRemarkIndex,
      currentRemarkOptions: state => state.remark.currentRemarkOptions,
      currentPageIndex: state => state.student.currentPageIndex,
      studentAllSlides: state => state.student.studentAllSlides,
    }),
    marks() {
      let list = []
      console.log(this.studentAllSlides, this.allRemarks, '====allRemarks')
      if(this.studentAllSlides.length > 0 && this.allRemarks.length > 0) {
        list = this.allRemarks.filter(
          item => item.page_id === this.currentPageId
        );
      }
      return list;
    },
    currentPageId() {
      return this.studentAllSlides[this.currentPageIndex].page_id
    }
  },
  watch: {
    currentRemarkOptions() {
      if(!this.currentRemarkOptions && this.sendBusyStatus) {
        // sendBusyStatus 表示当前有一次操作未完成
        this.closeRecord()
      }
    }
  },
  mounted() {
    // const selector = document.getElementById('diycolor_comment');
    // colorSelector.init(selector);
    console.log(this.currentReamrkList, 'currentReamrkList')
  },
  beforeDestroy() {
    // colorSelector.destory()
    // document.getElementById('diycolor_comment').innerHTML = ''
  },
  methods: {
    ...mapActions("remark", [
      "addOneRemarkItem",
      "changeRemarkIndex",
      "deleteOneRemarkItem",
      "setCurrentRemarkOptions"
    ]),
    resetPosition() {
      this.currentPosition = {
        left: 0,
        top: 0,
        content_width: 0,
        content_height: 0,
        offsetX: 0,
        offsetY: 0,
        background: '#caf982'
      },
      this.nextPosition = {offsetX: 0, offsetY: 0}
    },
    markup(e) {
      console.log('click')
      if(this.markType === 1) {
        // 正在进行 comment 记录，不允许打点
        if(this.recordVisiable) return false
        const { offsetX, offsetY } = e;
        const left = offsetX - 15;
        const top = offsetY - 15;
        const { offsetHeight, offsetWidth } = e.target;
        this.currentPosition = {
          left,
          top,
          content_width: offsetWidth,
          content_height: offsetHeight,
          offsetX,
          offsetY,
          background: this.color,
        };
        this.markPointer()
      }
    },
    startMove(e){
      console.log('mousedown')
      if(this.recordVisiable) return false
      if(this.markType === 2) {
        this.isBoxing = true
        const { offsetX, offsetY } = e;
        const left = offsetX - 15;
        const top = offsetY - 15;
        const { offsetHeight, offsetWidth } = e.target;
        this.currentPosition = {
          left,
          top,
          content_width: offsetWidth,
          content_height: offsetHeight,
          offsetX,
          offsetY,
          background: this.color,
        };
        this.nextPosition = {
          offsetX,
          offsetY
        }
      }
    },
    mouseMoving(e) {
      if(this.markType === 2 && this.isBoxing) {
        const { offsetX, offsetY, clientX, clientY } = e;
        // console.log(offsetX, offsetY, clientX, clientY)
        this.nextPosition = {
          offsetX: clientX,
          offsetY: clientY - 50
        }
      }
    },
    mouseEnd() {
      if(this.isBoxing) {
        console.log('mouseEnd')
        this.markBox()
        this.isBoxing = false
      }
    },
    // 增加box标记
    markBox() {
      this.currentPosition = {
        ...this.currentPosition,
        width: Math.abs(this.nextPosition.offsetX - this.currentPosition.offsetX),
        height: Math.abs(this.nextPosition.offsetY - this.currentPosition.offsetY),
        left: Math.min(this.currentPosition.offsetX, this.nextPosition.offsetX),
        top: Math.min(this.currentPosition.offsetY, this.nextPosition.offsetY),
        pointType: 'box'
      }
      this.currentMark.push(this.currentPosition);
      this.startInputComment()
    },
    pauseEvent(e){
      console.log('pauseEvent')
      if(e.stopPropagation) e.stopPropagation();
      if(e.preventDefault) e.preventDefault();
      e.cancelBubble=true;
      e.returnValue=false;
      return false;
    },
    // 增加点击标识
    markPointer() {
      this.currentPosition = {
        ...this.currentPosition,
        pointType: 'point'
      }
      this.currentMark.push(this.currentPosition);
      // this.buttonPosition = {
      //   top: this.currentPosition.top,
      //   left: this.currentPosition.left
      // }
      // this.buttonVisiable = false;
      // this.$nextTick(() => {
      //   this.buttonVisiable = true;
      // });
      this.startInputComment()
    },
    // 打开纪录框
    startInputComment() {
      // 这次操作未完成发送
      this.sendBusyStatus = true;
      this.recordVisiable = true
      this.setCurrentRemarkOptions(this.currentPosition)
      this.changeRemarkIndex(-1)
    },
    closeRecord() {
      console.log("end record");
      this.recordVisiable = false;
      if (this.sendBusyStatus) {
        // 没有发送要删除这次打点
        this.currentMark = [];
      }
      this.sendBusyStatus = false
    },
    showModal() {
      this.modalVisable = true
    },
    hideModal() {
      this.modalVisable = false
    },
    showDiy() {
      colorSelector.show(this.color, (rgb) => {
        // console.log(d)
         const selectorColor = colorSelector.utils.rgb2txt(rgb);
         console.log(selectorColor)
         this.changeColor(selectorColor)
      });
    },
    changeColor(color) {
      this.color = color
    },
    changeMarkType(type) {
      this.markType = type
      this.resetPosition()
    },
    selectMark(item, index) {
      this.changeRemarkIndex(index)
      if(this.recordVisiable) {
        this.closeRecord();
      }
    },
    leaveModal() {
      if(this.modalVisable) {
        this.hideModal()
      }
    },
  }
};
</script>

<style scoped>
.remark-modal{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
}
.remark-mask-inner{
  position: relative;
  width: 100%;
  height: 100%;
}
.pointer-area {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.right-area{
  width: 0px;
  float: right;
}
.markitem {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  box-sizing: border-box;
  position: absolute;
  z-index: 999;
  cursor: pointer;
  border: 2px solid transparent;
}
.markitembox{
  position: absolute;
  z-index: 999;
  cursor: pointer;
  padding: 4px;
  border: 2px solid transparent;
}
.markitemhover{
  box-shadow: 0 0 20px #f00
}
.markitem:hover{
  box-shadow: 0 0 20px #f00
}
.markitembox:hover{
  box-shadow: 0 0 20px #f00
}
.markpos {
  z-index: 1;
  opacity: 0;
}
.innermark{
  width: 20px;
  height: 20px;
  border-radius: 10px;
  margin: 3px;
}
.buttonlist {
  /* width: 100px;
  height: 40px; */
  display: flex;
  justify-content: space-around;
}
.item {
  width: 50px;
  cursor: pointer;
}
.record-container {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #fff;
  padding: 50px 30px 30px;
  box-shadow:#333 0px 0px 20px
}
.del-button{
  width: 20px;
  height: 20px;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}
.canvasfooter {
  width: 100%;
  height: 50px;
  line-height: 50px;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  box-sizing: border-box;
  background-color: #fff;
}
.canvasfooter > div {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin: 0 30px;
  cursor: pointer;
  line-height: 30px;
}
.eraser {
}
#keyword-box {
  margin: 10px 0;
}
.canvasmodal{
  width: 100%;
  height: 200px;
  position: absolute;
  bottom: 50px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border:1px solid rgba(0, 0, 0, 0.5);
  background-color: #fff;
  line-height: 20px;
}
.widthlist{
  width: 100px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
}
.widthlist .item{
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: auto;
  position: relative;
}
.widthlist .icon{
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid #999;
}
.icontext{
  position: absolute;
  right: -20px;
}
.colorList{
  width: 150px;
  display: flex;
  flex-wrap: wrap;
  margin-left: 0;
}
.colorList .colors{
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #999;
  margin: 5px;
  cursor: pointer;
}
.closemodal{
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
.dragbg{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 9999;
}
</style>