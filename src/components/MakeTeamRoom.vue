<template>
    <div class="bg">
        <div v-if="countdownStatus==true" class="countdown">
            <p>{{ countdown }}</p>
        </div>
        <div class = "top">
            <div class = "convert-page-btn" @click="changePage">
                <p>Team</p>
            </div>
            <div v-if="change==false" class = "status">
                <p>최고가</p>
                <p>{{ max_num }}</p>
            </div>
            <div class="timer">
                <p>{{ seconds }}초</p>
            </div>
        </div>
        <div v-if="change==false" class = "team-room">
            <div class = "user">
                <div class = "user-div" v-for = "(user, i) in Object.keys(membersById)" :key="i">
                    <div class = "user-info">
                        <img class="user-img" :src="getLeaderImg(i)">
                        <img class="boss" src="../assets/boss.png"> 
                        <div class = "name">
                            <p class = "user-name">{{ membersById[user].user_name }}</p>
                            <p v-if="user == userName" class = "me"> &nbsp; me</p>
                        </div>
                        <div class="user-ready" v-if="readyStatus[user] == true && userCnt!=readyUserCnt">
                            <p>Ready</p>
                        </div>
                        <div v-if="userCnt == readyUserCnt" class = "team">
                            <img v-for="(memberId, i) in teamMember[user]" :key="i" class="member-img" :src="getMemberImg(memberId)">
                        </div>
                        <div v-if="userCnt == readyUserCnt" class = "info">
                            <div class="coin">
                                <img src="../assets/coin.png"> 
                                <p>{{ membersById[user].coin }}</p>
                            </div>
                            <div class="teammember">
                                <i class="fa fa-user" aria-hidden="true"></i>
                                <p>{{teamMember[user].length + 1}} / 5</p>
                            </div>
                        </div>
                    </div>
                    <div class = "auction">
                        <p>{{ messages[user] }}</p>
                    </div>
                </div>
            </div>
            <RandomCard :selected="selected" :next="next" :randomMembers="randomMembers" @select="changeSelected" @end="stopTimer"></RandomCard>
            <div v-if="userCnt == readyUserCnt && teamMember[userName] != 5" class = "chatting">
                <div class = "chat-div">
                    <input type="text" v-model="numberInput" @input="validateInput" placeholder="값을 입력하세요" @keypress="handleKeyDown">
                    <div class="submit-icon" @click="submitMessage">
                        <i class="fa-regular fa-paper-plane"></i>
                    </div>       
                </div>
            </div>
            <div v-if="userCnt != readyUserCnt" :class="{'ready': readyStatus[userName]==true}" class="not-ready" @click="changeReadyStatus">
                <p>Ready</p>
            </div>
        </div>
        <TeamStatus :membersById="membersById" :teamMember="teamMember" @change="changePage" :members="randomMembers['members']" v-else>
        </TeamStatus>
    </div>
</template>
<script setup>
import TeamStatus from "./TeamStatus.vue";
import RandomCard from './RandomCard.vue';
import io from 'socket.io-client';
import {ref, defineProps} from 'vue';
import { onBeforeMount } from 'vue';
import axios from 'axios';

const url = process.env.VUE_APP_SERVER_URI;
const props = defineProps({
    userName:{
        type: String,
        default: ""
    },
    roomName: {
        type: String,
        default: ""
    }
})

const max_num = ref(0);
const messages = ref({});
const membersById = ref({});
const members = ref();
const numberInput = ref();
const teamMember = ref({});
const selectedTeam = ref('');
const selected = ref(false);
const readyStatus = ref({});
const userCnt = ref(0);    //방 안에 존재하는 유저 수
const readyUserCnt = ref(0);    //준비완료된 유저 수
const seconds = ref(15);
const timer = ref();
const next = ref(false);
const randomMembers = ref({});
const countdown = ref(5);
const countdownStatus = ref(false);


const socket = io(url, {
    withCredentials: true,
    extraHeaders:{
        "extra-custom-headers": "localhost"
    }
})

// 컴포넌트가 마운트되기 전에 실행될 로직을 여기에 작성합니다.
onBeforeMount(() => {
  axios.get(url+`/users/${props.roomName}`)
        .then((res) => {
   
            members.value = res.data.users;

            //user_name과 유저 정보 연결
            (members.value).forEach((val) => {
              membersById.value[val.user_name] = val;
              messages.value[val.user_name] = 0;
              teamMember.value[val.user_name] = [];
              userCnt.value += 1; 
              readyStatus.value[val.user_name] = false;
            })
            
        })
        .catch((error) => {
          console.log(error);
        })
  
});

socket.emit("enter_room", props.roomName, props.userName, () => {
    console.log("입장");
})

//방에 처음 입장한 사람이면 실행됨
socket.on("join", (name) => {
    membersById.value[name] = {user_name:name, room_name:props.roomName, auction: 0, coin: 1000};
    messages.value[name] = 0;
    teamMember.value[name] = [];
    userCnt.value += 1; 
    readyStatus.value[name] = false;
})

//메세지 전송 관련
const validateInput = () => {
    // 입력값에서 숫자가 아닌 모든 문자를 제거
    numberInput.value = numberInput.value.replace(/[^0-9]/g, '');
}
const submitMessage = () => {
    if (Number(numberInput.value) <= membersById.value[props.userName]['coin']){
        if(numberInput.value > max_num.value){
            socket.emit("send_message", props.roomName, numberInput.value)
            numberInput.value = '';
        } else{
            alert("최고가보다 더 큰 값만 입력 가능합니다.");
        }
        
    } else{
        alert("금액 초과");
    }
    
}

socket.on("get_message", (name, message) => {
    max_num.value = Number(message);
    selectedTeam.value = name;
    messages.value[name] = Number(message);
})

const getLeaderImg = (n) => {
    return require(`../assets/random/r${n}.png`)
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && event.shiftKey) {
    return;

  } else if(event.key === 'Enter'){
    event.preventDefault();
    submitMessage();
  }
}

//타이머 관련
const startTimer = () => {
    timer.value = setInterval(() => {
        if(seconds.value == 0){
            if(max_num.value > 0){
                const coin = membersById.value[selectedTeam.value].coin - max_num.value;
                selected.value = true;
                membersById.value[selectedTeam.value].coin = coin;
                // socket.emit("successful_bid", props.roomName, selectedTeam.value, coin);
            } else{
                next.value = !next.value;
            }
            seconds.value = 15;
        }else{
            seconds.value -= 1;
        }
    }, 1000);
}

const stopTimer = () => {
    clearInterval(timer.value);
}

const changeSelected = (currentMember) => {
    teamMember.value[selectedTeam.value].push(currentMember);
    selected.value = false;
    next.value = !next.value;
    resetMessage();
    max_num.value = 0;
    selectedTeam.value = ''
}

const getMemberImg = (i) => {
    return require(`../assets/champ/${randomMembers.value.members[i][4]}.png`);
}

const resetMessage = () => {
    for (const key in messages.value){
        messages.value[key] = 0;
    }
}

//준비 상태 변경
const changeReadyStatus = () => {
    const status = !readyStatus.value[props.userName];
    if(status && readyUserCnt.value+1 == userCnt.value) {
        socket.emit("req_members_info", props.roomName);
    }
    socket.emit("req_change_ready_status", props.roomName, props.userName, status);
    
}
socket.on("res_members_info", (members) => {
    randomMembers.value = members;
})

socket.on("res_change_ready_status", (user_name, status) => {
    readyStatus.value[user_name] = status;
    if(status){
        readyUserCnt.value += 1;
        if (readyUserCnt.value == userCnt.value){
            startAuction();
        }
    }else{
        readyUserCnt.value -= 1;
    }
})

const startAuction = () => {
    countdownStatus.value = true;
    const interval = setInterval(() => {
        countdown.value -= 1
        if (countdown.value == 0){
            countdownStatus.value = false;
            clearInterval(interval);
            next.value = !next.value;
            startTimer();
        }
    }, 1000)
}

socket.on("user_disconnecting", (user_name) => {
    if(readyStatus.value[user_name] == true){
        readyStatus.value[user_name] = false;
        readyUserCnt.value -= 1;
    }
    clearInterval(timer.value);
})


const change = ref(false);

const changePage = () => {
    if (change.value == true) change.value = false;
    else change.value = true;
}
</script>

<style scoped>

.bg{
    height: 100vh;
    background-image: url("../assets/Bg.png");
    background-size: cover;
    background-position: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom:0;
    overflow-x: auto;
}
.team-room{
    display: flex;
}
.top{
    display: flex;
    justify-content: center;
    text-align: center;
    
}
.convert-page-btn{
    position: fixed;
    left:0;
    margin-left: 80px;
    margin-top: 20px;
    font-size: 25px;
    cursor: pointer;
}
.status{
    width: 300px;
    height: 85px;
    justify-content: center;
    text-align: center;
    font-size: 30px;
    margin-top: 20px;
}
.status p{
    margin: 0;
}

p{
    color: white;
}
.user{
    min-width: 350px;
    margin-right: 70px;
    margin-left: 7vw;
    overflow: scroll;
    max-height: 65vh;
}
.user-div{
    display: flex;
}
.user-info{
    min-width: 640px;
    width: 45vw;
    height: 95px;
    background-color: rgba(255, 255, 255, 0.267);
    display: flex;
    align-items: center;
    margin-top: 10px; 
}
.auction{
    width: 80px;
    min-width: 80px;
    height: 95px;
    border: none;
    border-left: 12px solid;
    border-color: #3773ff87;
    background-color: rgba(255, 255, 255, 0.267);
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
}
.user-img{
    width: 72px;
    height: 72px;
    border-radius: 100%;
    margin-left: 30px;
}
.member-img{
    width: 40px;
    height: 40px;
    border-radius: 100%;
    margin-right: 10px;
}
.team{
    width: 200px;
    height: 95px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
.boss{
    width: 40px;
    height: 40px;
    margin-left: 30px;
}
.name{
    font-size: 30px;
    margin-left: 15px;
    color: white;
    width: 180px;
    display: flex;
    align-items: center;
    white-space: nowrap; 
    overflow: hidden;  		
    margin-right: 10px;
}
.user-name{
    text-overflow: ellipsis;
    white-space: nowrap; 
    overflow: hidden;   
}   
.info{
    display: flex;
    flex-direction: column;
    margin-left: auto;
    margin-right: 20px;
}
.coin{
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
}
.coin img{
    width: 20px;
    height: 20px;
}
.teammember{
    margin-top: 12px;
    height: 20px;
    width: 70px;
    display: flex;
    align-items: center;
}
.coin p, .teammember p{
    font-size: 20px;
    margin-left: 5px;
}
.fa-user{
    font-size: 20px;
    color: #00FFF0;
    margin-right: 3.5px;
}
.me{
    color: #63FF76;
    font-size: 20px;
}
.select{
    width: 50px;
    height: 95px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 13px;
    margin-bottom: 10px;
}
.select i{
    font-size: 25px;
    cursor: pointer;
}
.select i:hover{
    color: #3772FF;
}
.selected{
    color: #3772FF;
}
.chatting{
    position: fixed;
    margin: 0 auto;
    bottom: 7%;
    left: 0;
    right: 0;
    margin: 0 auto;
}
.chat-div{
    display: flex;
    justify-content: center;
    align-items: center;
}
input{
    width: 130px;
    min-height: 39px;
    overflow: scroll;
    padding: 9px;
    padding-left: 15px;
    outline: none;
    border:none;
    margin-right: 5px;
    border-bottom: 3px solid white;
    resize: none;
    padding-right: 15px;
    padding-bottom: 0px;
    font-size: 20px;
    background-color:unset;
    color: white;
    text-align: center;
}
.submit-icon{
    cursor: pointer;
    border-radius: 100%;
    width: 30px;
    height: 30px;
    margin-top: 8px;
    margin-right: 20px;
    background-color: #3772FF;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}
.submit-icon i{
    margin-right: 2px;
}

.not-ready{
    position: fixed;
    bottom: 7%;
    left: 0;
    right: 0;
    margin: 0 auto;
    text-align: center;
    mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0)100%); /* 중앙은 선명하게, 바깥쪽은 흐려지게 */
    background-color: rgba(0, 0, 0, 0.658);
    border-style: solid;
    border-width: 1.5px;
    border-image: linear-gradient(to right, #0593A7, #026F8F) 1;
    width: 200px;
    height: 50px;
    justify-content: center;
    align-items: center;
    display: flex;
    cursor:pointer;
    
}
.not-ready:hover{
    background-image: linear-gradient(to right, #0593A7, #026F8F);
}
.ready{
    background-image: linear-gradient(to right, #0593A7, #026F8F);
}

.not-ready p{
    text-align: center;
    font-size: 30px;
}
.user-ready p{
    margin-left: 60px;
    font-size: 40px;
    font-style:italic;
    color: #63FF76;
    letter-spacing: 3px;
}
.timer{
    position: fixed;
    right:0;
    margin-right: 18.5vw;
    margin-top: 20px;
    font-size: 30px;
    color: white;
}
.countdown{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 100%;
    font-size: 300px;
    animation: shrinkDisappear 1s;
    animation-iteration-count: infinite;
}
@keyframes shrinkDisappear {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1); /* Start at normal size */
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0); /* End at zero size */
  }
}
</style>