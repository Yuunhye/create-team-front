<template>
    <div class="chat">
       <h1>hi</h1>
    </div>
</template>
<script setup>

import {ref, defineProps} from 'vue';
import io from 'socket.io-client';

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




</script>
<style scoped>
.chat{
    color: white;
    margin-right: auto;
}

</style>