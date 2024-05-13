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
                        <p>{{ memberInfo[currentMember][0] }}</p>
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
            <img v-if="userName=='관리자'" class = "arrow" src="../assets/ArrowRight.png" @click="passAndNext"/>
        </div>
       
        <!-- <div v-if="userName=='관리자'" class = "btn">
            <button class="admin complete" @click="completeAndNext">완료</button>
            <button class="admin" @click="passAndNext">넘기기</button>

        </div> -->
    </div>
</template>
<script setup>

import {ref, defineProps, watch, defineEmits} from 'vue';
import member from '../../public/member';

const emit = defineEmits(["select", "next-member"]);
const props = defineProps({
    userName:{
        type: String,
        default: ""
    },
    selected:{
        type: Boolean,
        default: false
    },
    cardMember:{
        type: Number,
        default: -1
    }
})

const currentMember = ref();
const memberInfo = member;
const restMember = ref([]);
const randomKey = ref(Object.keys(memberInfo));

watch(() => props.selected, (newValue) => {
    console.log(newValue)
    if (newValue) {
        if(restMember.value.length != 0) {
            restMember.value.pop();
            emit("select", currentMember.value);
        }
    } 
})

watch(() => props.cardMember, (newValue) => {
    if (newValue != -1) {
        currentMember.value = newValue;
    }
})

// const completeAndNext = () => {
//     if (currentMember.value != undefined){
//         memberInfo.value.splice(currentMember.value, 1);
//     } 
//     passAndNext();
    
// }
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
		// 무작위로 index 값 생성 (0 이상 i 이하)
    let j = Math.floor(Math.random() * i);
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffle(randomKey.value);

const passAndNext = () => {
    emit("select", -1);
    if (randomKey.value.length != 0){
        currentMember.value = randomKey.value.pop();
        restMember.value.push(currentMember.value);
    } else{
        if (restMember.value.length == 0) currentMember.value = null;
        else{
            randomKey.value = restMember.value;
            shuffle(randomKey.value);
            currentMember.value = randomKey.value.pop();
            restMember.value = [currentMember.value];
        }
    }
    emit("next-member", currentMember.value)
    
}
const getImageSrc = (num) => {
    return require (`../assets/champ/${memberInfo[num][4]}.png`);
}

const getFirstPosition = (num) => {
    return require(`../assets/position/${memberInfo[num][2]}.png`)
}
const getSecondPosition = (num) => {
    return require(`../assets/position/${memberInfo[num][3]}.png`)
}
const getTier = (num) => {
    return require(`../assets/tier/${memberInfo[num][1]}.png`)
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
    margin-right: 100px;
}
.panel{
    width: 450px;
    height: 580px;  
    background-color: rgba(0, 0, 0, 0.389);
    color: white;

}
.panel-img{
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-content: center;
    width: 350px;
    height: 350px;
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
    width: 120px;
    height: 90px;
    
}
.position{
    width: 70px;
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
.admin{
    margin-top: 20px;
    width: 241px;
    height: 40px;
    background-color: transparent;
    background-color: rgba(0, 0, 0, 0.658);
    color: #CDBE91;
    border-style: solid;
    border-width: 1px;
    border-color: #614A1F;
    cursor:pointer;
}
.admin:hover{
    background-color:black;
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
    font-size: 33px;
}
.arrow{

    justify-content: center;
    text-align: center;
    cursor: pointer;
    width: 40px;
    height :40px;
    margin-left: 20px;
}
</style>