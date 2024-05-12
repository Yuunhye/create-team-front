<template>
  <FirstModal v-if="isEnter == false" @enterRoom="enterRoom"></FirstModal>
  <MakeTeamRoom v-else :userName="userName" :roomName="roomName"></MakeTeamRoom>
</template>

<script setup>
import { ref } from 'vue';
import FirstModal from './components/FirstModal.vue'
import MakeTeamRoom from './components/MakeTeamRoom.vue'

const isEnter = ref(false);
const userName = ref('');
const roomName = ref('');
const enterRoom = (data) => {
  isEnter.value = true;
  console.log(data)
  userName.value = data.userName;
  roomName.value = data.roomName;
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Do+Hyeon&family=Freeman&display=swap');
*{
    font-family: "Do Hyeon", sans-serif;
    font-weight: 400;
    font-style: normal;
}
</style>
