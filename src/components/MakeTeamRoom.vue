<template>
    <div class="bg">
        <div class = "top">
            <div class = "convert-page-btn" @click="changePage">
                <p>Team</p>
            </div>
            <div v-if="change==false" class = "status">
                <p>최고가</p>
                <p>{{ max_num }}</p>
            </div>
        </div>
        
        <div v-if="change==false" class = "team-room">
            <div class = "user">
                <div class = "user-div" v-for = "(user, i) in Object.keys(membersById)" :key="i">
                    <div class = "user-info">
                        <img class="user-img" :src="getLeaderImg(i)">
                        <img class="boss" src="../assets/boss.png"> 
                        <div class = "name">
                            <p>{{ membersById[user].user_name }}</p>
                            <p v-if="user == userName" class = "me"> &nbsp; me</p>
                        </div>
                        <div class = "team">
                            <img v-for="(memberId, i) in teamMember[user]" :key="i" class="member-img" :src="getMemberImg(memberId)">
                        </div>
                        <div class = "info">
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
                    <div v-if="userName=='관리자'" class = "select" @click="selectTeam(user)">
                        <i :class="{'selected': selectedTeam==user}" class="fa fa-check-circle" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <RandomCard :cardMember="cardMember" :userName="userName" :selected="selected" @select="changeSelected" @next-member="nextMember"></RandomCard>
            <div v-if="userName!='관리자'" class = "chatting">
                <div class = "chat-div">
                    <input type="text" v-model="numberInput" @input="validateInput" placeholder="값을 입력하세요" @keypress="handleKeyDown">
                    <div class="submit-icon" @click="submitMessage">
                        <i class="fa-regular fa-paper-plane"></i>
                    </div>       
                </div>
            </div>
        </div>
        <TeamStatus :membersById="membersById" :teamMember="teamMember" @change="changePage" v-else>
        </TeamStatus>
    </div>
</template>
<script setup>
import TeamStatus from "./TeamStatus.vue";
import RandomCard from './RandomCard2.vue';
import io from 'socket.io-client';
import {ref, defineProps} from 'vue';
import { onBeforeMount } from 'vue';
import axios from 'axios';
import member from '../../public/member';

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
const selected = ref(true);
const cardMember = ref();

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

            //user_id 와 유저 정보 연결
            (members.value).forEach((val) => {
              membersById.value[val.user_name] = val;
              messages.value[val.user_name] = 0;
              teamMember.value[val.user_name] = [];
            })
            
        })
        .catch((error) => {
          console.log(error);
        })
  
});

socket.emit("enter_room", props.roomName, props.userName, () => {
    console.log("입장");
})

socket.on("join", (name) => {
    membersById.value[name] = {user_name:name, room_name:props.roomName, auction: 0, coin: 1000};
    messages.value[name] = 0;
    teamMember.value[name] = [];
})

socket.on("get_message", (name, message) => {
    if(max_num.value < Number(message)){
        max_num.value = Number(message);
    }
    messages.value[name] =Number(message);
})

const getLeaderImg = (n) => {
    return require(`../assets/random/r${n}.png`)
}

const validateInput = () => {
    // 입력값에서 숫자가 아닌 모든 문자를 제거
    numberInput.value = numberInput.value.replace(/[^0-9]/g, '');
}
const submitMessage = () => {
    if (Number(numberInput.value) <= membersById.value[props.userName]['coin']){
        socket.emit("send_message", props.roomName, numberInput.value)
        numberInput.value = '';
    } else{
        alert('금액 초과');
    }
    
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && event.shiftKey) {
    return;

  } else if(event.key === 'Enter'){
    event.preventDefault();
    submitMessage();
  }
}

const selectTeam = (user) => {
    if (selected.value == false){
        const coin = membersById.value[user].coin - Number(messages.value[user]);
        selected.value = true;
        selectedTeam.value = user;
        socket.emit("successful_bid", props.roomName, user, coin);
    }
}

socket.on("return_coin", (name, coin) => {
    membersById.value[name].coin = coin;
})

const changeSelected = (currentMember) => {
    if (currentMember != -1){
        socket.emit("req_add_member", props.roomName, selectedTeam.value, currentMember);
        
    } else{
        selected.value = false;
    }
}
socket.on("res_add_member", (team, memberId) => {
    teamMember.value[team].push(memberId);
})

const getMemberImg = (i) => {
    console.log("getMemberImg : ", i);
    return require(`../assets/champ/${member[i][4]}.png`);
}

const nextMember = (memberId)=> {
    socket.emit('req_next_member', props.roomName, memberId);
}

const resetMessage = () => {
    for (const key in messages.value){
        messages.value[key] = 0;
    }
}

socket.on('res_next_member', (memberId) => {
    cardMember.value = memberId;
    resetMessage();
    max_num.value = 0;
    selectedTeam.value = ''
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
    margin-right: 70px;
    margin-left: 70px;
}
.user-div{
    display: flex;
}
.user-info{
    width: 640px;
    height: 95px;
    background-color: rgba(255, 255, 255, 0.267);
    display: flex;
    align-items: center;
    margin-top: 10px;
}
.auction{
    width: 80px;
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
    overflow: hidden;
    width: 180px;
    display: flex;
    align-items: center;
    overflow: hidden;  		
    text-overflow: ellipsis;  
    white-space: nowrap; 
    margin-right: 10px;
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
</style>