<template>
    <div class="parent">
        <div class="input_parent" v-for="(item,index) in arr" :key="index">
            <el-input
                type="textarea"
                :autosize="{ minRows: 3}"
                placeholder="请输入内容(按Ctrl+Enter键发送)"
                v-model="item.value"
                @keyup.ctrl.enter.native="send(index)">
            </el-input>
        </div>
        <el-button type="text" @click="addInput()" :disabled="addDisable">+Add Other One</el-button>
    </div>
</template>

<style scoped>
    .parent{
        display: flex;
        flex-direction:column;
        padding: 20px;
    }
    .input_parent{
        display: flex;
        padding-bottom:20px; 
    }
    /* .grid-content {
        border-radius: 4px;
        min-height: 100px;
        padding: 10px;
        border: 1px solid #e5e9f2;
    } */
    el-input{
        color: #303133;
        font-family: "PingFang SC";
    }
    el-button{
        font-family: "Microsoft YaHei";
        font-size: large;
    }
      

</style>

<script>
export default {

    data(){
        return {
            arr:[
                {value:'',id:1}
            ],
            addDisable:false,
            maxCount:3,
            inputCount:1
        }
    },
    created(){
        console.log("text template created!!")

    },
    methods:{
        addInput:function(){
            this.inputCount++;
            var item = {value:'',id:this.inputCount}
            this.arr.push(item);
            this.addDisable = this.inputCount>=this.maxCount;
        },
        send:function(index){
            var text = this.arr[index].value;
            console.log("id=="+this.arr[index].id)
            if(text){
                console.log("send msg="+text)
            }else{
                this.$alert('Input some words!', 'Note',{
                    confirmButtonText: 'Ok',
                    callback:action=>{

                    }
                });
            }
        }

    }
}
</script>