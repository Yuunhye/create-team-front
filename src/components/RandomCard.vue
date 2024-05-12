<template>
    <div class = "card">
        <div class = "panel-bg">
            <div v-if="currentMember != undefined" class = "panel">
                <div class="panel-img">
                    <img class="champion-img" :src="getImageSrc(currentMember)">
                </div>
                <div class="info">
                    <img class="tier" :src="getTier(currentMember)">
                    <p>{{ memberInfo[currentMember][0] }}</p>
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
        <div class = "btn">
            <button class="admin complete" @click="completeAndNext">완료</button>
            <button class="admin" @click="passAndNext">넘기기</button>
            <!-- <div class = "button">완료</div>
            <div class="button">넘기기</div> -->
        </div>
    </div>
</template>
<script setup>

import {ref} from 'vue';
import member from '../../public/member';

const currentMember = ref();
const memberInfo = ref(member);


const completeAndNext = () => {
    if (currentMember.value != undefined){
        memberInfo.value.splice(currentMember.value, 1);
    } 
    passAndNext();
    
}
const passAndNext = () => {

    if (memberInfo.value.length != 0){
        const randomIndex = Math.floor(Math.random() * memberInfo.value.length);
        currentMember.value = randomIndex;
    } else{
        currentMember.value = null;
    }
    
}
const getImageSrc = (num) => {
    return require (`../assets/champ/${memberInfo.value[num][4]}.png`);
}

const getFirstPosition = (num) => {
    return require(`../assets/position/${memberInfo.value[num][2]}.png`)
}
const getSecondPosition = (num) => {
    return require(`../assets/position/${memberInfo.value[num][3]}.png`)
}
const getTier = (num) => {
    return require(`../assets/tier/${memberInfo.value[num][1]}.png`)
}
</script>
<style scoped>
.card{
    margin-left: auto;
}
.panel-bg, .btn{
    display: flex;
    justify-content: flex-end;
    margin-right: 150px;
}
.panel{
    width: 400px;
    height: 600px;  
    margin-top: 80px;
    background-color: #020b1494;
    border-color: #614a1fd1;
    border-width: 4px;
    border-style:solid;
    color: white;

}
.panel-img{
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-content: center;
    width: 300px;
    height: 300px;
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
    opacity: 0.6;
}
.info{
    margin: 0 auto;
    text-align: center;
    opacity: 0.6;
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
    width: 195px;
    height: 40px;
    background-color: transparent;
    background-color: rgba(0, 0, 0, 0.658);
    color: #CDBE91;
    border-style: solid;
    border-width: 2px;
    border-color: #614A1F;
    cursor:pointer;
    opacity: 0.8;
}
.admin:hover{
    background-color:black;
}
.complete{
    margin-right: 17px;
}
</style>