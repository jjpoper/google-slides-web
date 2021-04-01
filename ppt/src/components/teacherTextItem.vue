<template>
    <div class="parent">
    <div class="parent_1" v-for="index in 2" :key="index">
        <div class="parent_2" v-for="index in 4" :key="index">
            <div class="grid-content">
                菲菲南非efe fef ejfkalfjaklfjekalfjkalfj akfjaklfjeakfef
                c1
                2
                4
                5
                6
                7
                8
                9
                ef
                e
                fe
                f
                efelfj eakwlfjaklf jaklf ejakfl ajfklajfkal 
                残那地方你打发 纷纷发阿胶反馈阿胶啊快疯了就饿啊快来发就啊快放假啊快了饭就饿啊了放假啊快来发就啊快发阿杰
            </div>
            <p class="stduent_name">王舒克</p>
        </div>
    </div>
    </div>
</template>

<style scoped>
    .parent{
        display: flex;
        flex-direction: column;
        line-height: auto;
    }
    .parent_1{
        display: flex;
        flex-direction: row;
        width: 100%;
        line-height: 120px;

    }
    .parent_2{
        display: flex;
        flex-direction: column;
        width: 100%;
        line-height: 120px;
        padding: 10px;

    }
    .stduent_name{
        font-family: "PingFang SC";
        line-height: 20px;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        display: flex;
        border-radius: 4px;
        min-height: 100px;
        padding: 10px;
        background-color: white;
        border: 1px solid #e5e9f2;
        line-height: 20px;
        text-align: left;
    }
    p{
        text-align: left;
    }

</style>

<script>
export default {

    data(){
        return {
            
        }
    },
    created(){
        console.log("text template created!!")

    },
    methods:{

    }
}
</script>