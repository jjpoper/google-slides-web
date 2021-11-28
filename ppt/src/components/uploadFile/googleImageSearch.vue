<template>
  <div class="page">
    <div
      class="loading_mask"
      v-if="loading"
      v-loading="loading"
      element-loading-text="loading..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      v-on:click.stop="doThis()"
    ></div>

    <div class="image_opt_area">
      <span style="margin-right: 10px">Image type</span>
      <el-select
        v-model="image_type_value"
        placeholder="Image type"
        @change="imageTypeChange"
        :clearable="select_clearable"
      >
        <el-option
          v-for="item in imageTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="image_opt_area" style="margin-top: 10px">
      <span>Image color</span>
      <div class="searchColor">
        <div
          style="width: 40px; height: 40px; display: flex"
          v-for="(item, index) in colors"
          :key="item"
        >
          <div
            @click="changeColor(index)"
            :style="`background-color: ${item};border: ${
              item == '#FFFFFF' ? '1px' : '0px'
            } solid #36425a`"
            class="colorsItem"
          >
            <div
              v-if="currentColor == item"
              style="
                width: 12px;
                height: 12px;
                background: #15c39a;
                border: 2px solid #ffffff;
                border-radius: 50%;
                opacity: 1;
                margin-top: 18px;
                margin-left: 18px;
              "
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div
      style="
        width: 100%;
        height: 1px;
        background-color: #d8d8d8;
        margin-top: 10px;
      "
    ></div>

    <div style="width: 80%">
      <div id="test"></div>
    </div>

    <!--  class="gcse-searchresults" data-defaultToImageSearch="true" data-image_filter="0" data-gname="storesearch" data-image_dominantcolor="" :data-image_type="image_type_value" data-disableWebSearch="true" -->

    <!-- <div id="image_result">
    </div>-->
  </div>
</template>

<style scoped>
.page {
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading_mask {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  z-index: 999;
  /*-moz-opacity: 0.1;*/
  /*filter: alpha(opacity=10);*/
  color: #15c39a;
}

.image_opt_area {
  display: flex;
  width: 80%;
  align-items: center;
  padding-left: 20px;
}

.colorsItem {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 5px;
  cursor: pointer;
}

.searchColor {
  height: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 10px;
}
</style>


<script>
var test11;
export default {
  props: {
    doneSelect: {
      type: Function,
      default: () => null
    }
  },
  data() {
    return {
      loading: false,
      image_type_value: "",
      imageTypes: [
        {
          value: "",
          label: "Any type"
        },
        {
          value: "clipart",
          label: "Clip art"
        },
        {
          value: "face",
          label: "Faces of people"
        },
        {
          value: "lineart",
          label: "Line drawings"
        },
        {
          value: "stock",
          label: "Stock photos"
        },
        {
          value: "photo",
          label: "Photographs"
        },
        {
          value: "animated",
          label: "Animated GIFs"
        }
      ],
      colors: [
        "#FF8D87",
        "#676EF9",
        "#FF6B5B",
        "#FFCE00",
        "#D67A00",
        "#FF9300",
        "#D9D9D9",
        "#1AE4A8",
        "#00A4FC",
        "#010001",
        "#FFFFFF"
      ],
      colorStr: [
        "pink",
        "purple",
        "red",
        "yellow",
        "brown",
        "orange",
        "gray",
        "teal",
        "blue",
        "black",
        "white"
      ],
      currentColor: "#00FFFFFF",
      currentColorIndex: -1,
      select_clearable: true
    };
  },
  created() {
    this.loadGooleScript();
  },
  mounted() {
    this.initCallback();
  },
  methods: {
    //显示提示
    slideAlert: function(msg, _type) {
      this.$message({
        message: msg,
        type: _type
      });
    },
    imageTypeChange() {
      console.log(this.image_type_value);
      let _this = this;
      this.lastSearchKey = test11.getInputQuery();
      document.getElementById("test").innerHTML = "";
      test11 = google.search.cse.element.render({
        div: "test",
        attributes: {
          disableWebSearch: true,
          image_type: _this.image_type_value,
          enableHistory: false,
          image_as_rights: "cc_publicdomain, cc_noncommercial, cc_nonderived",
          image_dominantcolor:
            _this.currentColorIndex == -1
              ? ""
              : _this.colorStr[_this.currentColorIndex]
        },
        tag: "search"
      });
      test11.execute(this.lastSearchKey);
    },
    changeColor(index) {
      if (this.currentColorIndex == index) {
        this.currentColorIndex = -1;
        this.currentColor = "#00FFFFFF";
      } else {
        this.currentColor = this.colors[index];
        this.currentColorIndex = index;
      }

      let _this = this;
      this.lastSearchKey = test11.getInputQuery();
      document.getElementById("test").innerHTML = "";
      test11 = google.search.cse.element.render({
        div: "test",
        attributes: {
          disableWebSearch: true,
          image_type: _this.image_type_value,
          enableHistory: false,
          image_as_rights: "cc_publicdomain, cc_noncommercial, cc_nonderived",
          image_dominantcolor:
            _this.currentColorIndex == -1
              ? ""
              : _this.colorStr[_this.currentColorIndex]
        },
        tag: "search"
      });
      test11.execute(this.lastSearchKey);
    },
    select(url) {
      console.log("select image", url);
      this.image_type_value = "";
      this.currentColorIndex = -1;
      this.currentColor = "#00FFFFFF";
      this.doneSelect(url);
    },
    insertImage(url) {
      console.log("insertImage", url);
    },
    doThis() {
      console.log("stop click");
    },

    initCallback() {
      const _this = this;
      const makeTwoPartCallback = () => {
        let urls;
        const readyCallback = (name, q, promos, results, resultsDiv) => {
          urls = [];
          for (const result of results) {
            urls.push(result["image"]);
          }
        };
        const renderedCallback = (name, q, promos, results) => {
          const removeEventListeners = element => {
            const clone = element.cloneNode(true);
            element.parentNode.replaceChild(clone, element);
            return clone;
          };
          for (let i = 0; i < results.length; ++i) {
            const element = removeEventListeners(results[i]);
            element.addEventListener("click", () => {
              console.log(urls[i].url);
              _this.select(urls[i].url);
            });
          }
        };

        const myInitCallback = function() {
          if (document.readyState == "complete") {
            // Document is ready when Search Element is initialized.
            // Render an element with both search box and search results in div with id 'test'.
            var divE = document.getElementById("test");
            divE.innerHTML = "";
            test11 = google.search.cse.element.render({
              div: "test",
              attributes: {
                disableWebSearch: true,
                image_type: _this.image_type_value,
                enableHistory: false,
                image_as_rights:
                  "cc_publicdomain, cc_noncommercial, cc_nonderived",
                image_dominantcolor:
                  _this.currentColorIndex == -1
                    ? ""
                    : _this.colorStr[_this.currentColorIndex]
              },
              tag: "search"
            });
            // google.search.cse.element.render({
            //   div: "image_result",
            //   attributes: {
            //     disableWebSearch: true,
            //     image_type: _this.image_type_value,
            //     image_dominantcolor:
            //       _this.currentColorIndex == -1
            //         ? ""
            //         : _this.colorStr[_this.currentColorIndex]
            //   },
            //   tag: "search"
            // });
            console.log("init call back 1", _this.image_type_value);
          } else {
            // Document is not ready yet, when Search Element is initialized.
            google.setOnLoadCallback(function() {
              // Render an element with both search box and search results in div with id 'test'.
              var divE = document.getElementById("test");
              divE.innerHTML = "";
              test11 = google.search.cse.element.render({
                div: "test",
                attributes: {
                  disableWebSearch: true,
                  enableHistory: false,
                  image_type: _this.image_type_value,
                  image_as_rights:
                    "cc_publicdomain, cc_noncommercial, cc_nonderived",
                  image_dominantcolor:
                    _this.currentColorIndex == -1
                      ? ""
                      : _this.colorStr[_this.currentColorIndex]
                },
                tag: "search"
              });

              // google.search.cse.element.render({
              //     div: "image_result",
              //     attributes: {
              //         disableWebSearch: true,
              //         image_type: _this.image_type_value,
              //     },
              //     tag: 'searchresults'
              // });
            }, true);
            console.log("init call back 2", _this.image_type_value);
          }
        };
        return {
          readyCallback,
          renderedCallback,
          myInitCallback
        };
      };
      const {
        readyCallback: imageResultsReadyCallback,
        renderedCallback: imageResultsRenderedCallback,
        myInitCallback: myInitializationCallback
      } = makeTwoPartCallback();
      window.__gcse ||
        (window.__gcse = {
          parsetags: "onload", // Defaults to 'onload'
          initializationCallback: myInitializationCallback,
          searchCallbacks: {
            image: {
              ready: imageResultsReadyCallback,
              rendered: imageResultsRenderedCallback
            }
          }
        });
    },

    loadGooleScript() {
      var gcse = document.createElement("script");
      gcse.type = "text/javascript";
      gcse.async = true;
      gcse.src = "https://www.google.com/cse/cse.js?cx=d29cfc91a5299e6d9";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(gcse, s);
    }
  }
};
</script>
