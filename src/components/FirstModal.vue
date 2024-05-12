<template>
    <div class = "modal">
        <div class = "background">
            <div class ="title">
                <b>Enter The Room</b>
            </div>
            <div class = "room-number">
                <input type="text" v-model="roomName" placeholder="Room name" @keypress="handleKeyDown">
            </div>
            <div class = "name">
                <input type="text" v-model="userName" placeholder="User name" @keypress="handleKeyDown">
            </div>
            <div>
                <div class="button">
                    <i class="fa fa-arrow-circle-right" aria-hidden="true" @click="goToRoom"></i>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(["enterRoom"]);
const userName = ref('');
const roomName = ref('');

const goToRoom = () => {
    if (roomName.value == ""){
      alert("방 이름을 입력하세요.")  
    } else if (userName.value == ""){
        alert("이름을 입력하세요")
    } else{
        emit('enterRoom', {userName : userName.value, roomName: roomName.value});  
    }
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && event.shiftKey) {
    return;

  } else if(event.key === 'Enter'){
    event.preventDefault();
    goToRoom();
  }
}
</script>
<style scoped>
.modal{
    width: 100%;
    height: 100vh;
    background-image: url("../assets/Page 01.png");
    background-size: cover;
    background-position: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom:0;
}
.background{
    position: fixed;
    color: white;
    width: 550px;
    margin: 0 auto;
    margin-top: 10em;
    height: 450px;
    background-color: white;
    left: 0;
    right: 0;

}

.name, .room-number, .button, .title{
    display: flex;
    justify-content: center; /* 수평 중앙 정렬 */
    align-items: center; /* 수직 중앙 정렬 */
    margin-top: 30px;
}
.title{
    color: black;
    margin-top: 55px;
    font-size: 30px;
    margin-bottom: 40px;
}
input{
    width: 460px;
    height: 40px;
    padding: 10px;
    padding-left: 15px;
    background-color: #f3f3f3;
    border: 0;
}
.button{
    margin-top: 45px;
    
}
i{
    color: black;
    font-size: 55px;
    cursor: pointer;
}
i:hover{
    color: rgb(42, 42, 42);
}
</style>