<template>
  <transition name="el-fade-in">
    <div class="input-with-tag" @click.stop="">
      <el-input type="text" v-model="inputValue"
                class="my-login-input"
                @input="onInput"
                @focus="onFocus"
                @keydown.enter.native="onEnter">
      </el-input>
      <div
        v-show="showPopper"
        class="popover-option el-popper">
        <ul class="option-list">
          <li class="option-item" v-for="(optionItem, oIndex) in filterOptions" :key="oIndex" @click.stop="selectItem(optionItem)">
            <span class="option-item-text">{{optionItem.name}}</span>
          </li>
          <li class="option-item create-new" v-show="showCreate" @click.stop="createItem">
          <span class="create-new-item">
            <el-tag type="success" color="#15c39a22" class="create-new-tag" size="small">Create {{inputValue}}</el-tag></span>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>

import Popper from 'element-ui/src/utils/vue-popper';

export default {
  name: "inputWithTag",
  props: {
    options: {
      type: Array,
      default: () => []
    },
    defaultValue: {
      type: String,
      default: null
    }
  },
  mixins: [Popper],
  data() {
    return {
      inputValue: "",
      showPopper: false,
    };
  },
  watch: {
    defaultValue(val) {
      this.inputValue = val;
    }
  },
  computed: {
    filterOptions() {
      return this.options.filter(option => {
        return option.name.toLowerCase().indexOf(this.inputValue.toLowerCase()) > -1;
      });
    },
    showCreate () {
      return !this.filterOptions.find(option => option.name === this.inputValue) && this.inputValue;
    }
  },
  created() {
    console.log("inputWithTag created ", this.options, ' defaultValue ', this.defaultValue);
    if(this.defaultValue) {
      this.inputValue = this.defaultValue
    }
  },
  methods: {
    onInput(event) {
      this.showPopper = true
    },
    onFocus(event) {
      console.log('onFocus', this.inputValue);
      this.showPopper = true
    },
    onBlur(event) {
      console.log('onBlur', this.inputValue);
      this.showPopper = false
    },
    onEnter(event) {
      console.log('onEnter', this.inputValue);
      this.$emit("select-or-create-option", this.inputValue.trim());
      this.showPopper = false
    },
    createItem () {
      console.log('createItem', this.inputValue.trim());
      this.$emit("select-or-create-option", this.inputValue.trim());
      this.showPopper = false
    },
    selectItem (item) {
      console.log('selectItem', item);
      this.$emit('select-or-create-option', item.name)
      this.inputValue = item.name
      this.showPopper = false
    },
    hiddenPoppers() {
      this.showPopper = false
    }
  }
}
</script>

<style scoped>

.input-with-tag {
  position: relative;
  z-index: 200;
}

.my-login-input {
  border-radius: 6px;
  border: 1px solid #D8D8D8;
  cursor: pointer;
  width: 101%;
}

.my-login-input:hover {
  border-color: #15c39a;
}

.popover-option {
  position: absolute;
  background: #fff;
  top: 48px;
  width: 101%;
  box-shadow: 0 2px 12px 0 #00000020;
}

ul, li {
  list-style: none;
  padding: 0;
  margin: 0;
  background: #fff;
}

.option-list {
  padding: 5px 0;
  max-height: 200px;
  overflow-y: scroll;
}

.option-item {
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 15px;
  cursor: pointer;
}

.option-item:hover {
  background: #fafafa;
}

.create-new-tag {
  color: #15c39a;
}

</style>
