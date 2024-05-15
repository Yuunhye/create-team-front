<template>
    <div class = "card">
        <div class = "panel-bg">
            <div v-if="currentMember != undefined" class = "panel">
                <div class="panel-img">
                    <img class="champion-img" :src="getImageSrc(currentMember)">
                </div>
                <div class="info">
                    <div class = "nickname">
                        <img class="tier" :src="getTier(currentMember)">
                        <p>{{ members[currentMember][0] }}</p>
                    </div>
                    
                    <img class="position" :src="getFirstPosition(currentMember)">
                    <img class="position" :src="getSecondPosition(currentMember)">
                </div>
            </div>
            <div v-else class = "panel">
                <div class="panel-img none">
                    <img class="champion-img" src="../assets/champ/guess.png">
                </div>
                <div class="guess">
                    <!-- <i class="fa fa-question-circle" aria-hidden="true"></i> -->
                </div>
            </div>
        </div>
        <div v-if="currentMember != undefined" class = "member-cnt">
            <p>{{outMemberCnt}}/{{ memberCnt }}</p>
        </div>
    </div>
</template>
<script setup>

import {ref, defineProps, watch, defineEmits} from 'vue';
import Deque from '../class/Deque';

const emit = defineEmits(["select", "end"]);
const props = defineProps({
    selected:{
        type: Boolean,
        default: false
    },
    next : {
        type: Boolean,
        default: false
    },
    members: {
        type: Object
    },
    randomKey : {
        type: Int32Array,
        deafult: []
    }

})
const randomKey = ref(props.randomKey ? props.randomKey : [])
const currentMember = ref();
const memberCnt = ref(props.randomKey ? props.randomKey.length : 0);
const outMemberCnt = ref(1);
const deque = new Deque();

for (const key of randomKey.value){
    deque.append(key);
}

watch(() => props.selected, (newValue) => {
    if (newValue == true) {
        if (currentMember.value != null){
            deque.popleft();
            outMemberCnt.value ++;
            emit("select", currentMember.value);
        }
    }
})
watch(() => props.next, () => {
    passAndNext();
})

const passAndNext = () => {
    currentMember.value = deque.pop();
    console.log(currentMember.value);
    if (currentMember.value == null){
        emit("end");
    } else{
        deque.appendleft(currentMember.value);
    }
}
const getImageSrc = (num) => {
    return require (`../assets/champ/${props.members[num][4]}.png`);
}

const getFirstPosition = (num) => {
    return require(`../assets/position/${props.members[num][2]}.png`)
}
const getSecondPosition = (num) => {
    return require(`../assets/position/${props.members[num][3]}.png`)
}
const getTier = (num) => {
    return require(`../assets/tier/${props.members[num][1]}.png`)
}
</script>
<style scoped>
.card{
    margin-left: auto;
}
.panel-bg, .btn{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 7vw;
}
.panel{
    min-width: 450px;
    width: 24vw;
    min-height: 580px;  
    height: 65vh;
    background-color: rgba(0, 0, 0, 0.389);
    color: white;

}
.panel-img{
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-content: center;
    min-width: 350px;
    width: 20vw;
    min-height: 350px;
    height: 20vw;
    /* border-radius: 50%; */
    
    mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0)100%); /* 중앙은 선명하게, 바깥쪽은 흐려지게 */
    /* clip-path: polygon(0 15%, 100% 15%, 100% 85%, 0 85%); */
    background-color: white;
    position: relative;
    overflow: hidden;
    border-style: solid;
    border-width: 1.5px;
    border-color: #614A1F;
}
.info{
    margin: 0 auto;
    
}
.info p{
    font-size: 20px;
}
.tier{
    margin-top: 10px;
    width: 100px;
    height: 80px;
    
}
.position{
    width: 50px;
}
.guess{
    margin: 0 auto;
    margin-top : 60px;
    display: flex;
    justify-content: center;
    align-content: center;
    font-size: 100px;
    color: #0593A7;

}
.info{
    margin: 0 auto;
    text-align: center;
}

.champion-img{
    object-fit: cover;
    width: 100%;
    border-style: solid;
    border-width: 2px;
    border-color: black;
}
.complete{
    margin-right: 17px;
}
.nickname{
    display: flex;
    justify-content: center;
    text-align: center;
}
.nickname p{
    margin-left: 20px;
    font-size: 30px;
}
.member-cnt{
    color: white;
    font-size: 20px;
    width: 24vw;
    min-width: 450px;
    text-align: center;
}
</style>