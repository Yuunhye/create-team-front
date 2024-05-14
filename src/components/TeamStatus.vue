<template>
    <div class = "team-status">
        <div class = "user">
            <div class = "user-div" v-for = "(user, i) in Object.keys(membersById)" :key="i">
                <div class = "user-info">
                    <img class="user-img" :src="getLeaderImg(i)">
                    <img class="boss" src="../assets/boss.png"> 
                    <div class = "name">
                        <p>{{ membersById[user].user_name }}</p>
                        <p v-if="user == userName" class = "me"> &nbsp; me</p>
                    </div>
                    <div class = "white-space"></div>
                    <div class = "team">
                        <div v-for="(memberId, i) in teamMember[user]" :key="i" class="member-img">
                            <img :src="getMemberTierImg(memberId)">
                            <p>{{ members[memberId][0] }}</p>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
//import { defineEmits } from 'vue';
import {defineProps} from 'vue';

const props = defineProps({
    membersById :{
        type: Object,
    },
    teamMember : {
        type: Object,
    },
    members: {
        type: Object
    }
})

const getMemberTierImg = (memberId) => {
    return require(`../assets/tier/${props.members[memberId][1]}.png`);
}
const getLeaderImg = (n) => {
    return require(`../assets/random/r${n}.png`)
}

</script>
<style scoped>

.user{
    margin-right: 70px;
    margin-left: 70px;
    margin-top: 100px;
    overflow-x: auto;
}
.user-div{
    display: flex;
}
.user-info{
    width: 70vw;
    min-width: 1300px;
    height: 100px;
    background-color: rgba(255, 255, 255, 0.267);
    display: flex;
    align-items: center;
    margin: 0 auto;
    margin-top: 15px;
    overflow: hidden;
    text-overflow: ellipsis;  
    white-space: nowrap; 	
}
.user-img{
    width: 72px;
    height: 72px;
    border-radius: 100%;
    margin-left: 30px;
}
.member-img{
    margin-left: 30px;
    display: flex;
    align-items: center;
    color: white;
    font-size: 23px;
}
.member-img img{
    width: 50px;
    height: 40px;
}
.member-img p{
    margin-left: 10px;
}
.team{
    width: 200px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-left: 20px;
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
    width: 250px;
    display: flex;
    align-items: center;
}
.white-space{
    height: 100px;
    border: none;
    border-left: 12px solid;
    border-color: #3773ff87;
    background-color: rgba(255, 255, 255, 0.267);
    /* border: solid;
    border-color: #7A5C29; */

}
</style>
