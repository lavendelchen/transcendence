

<script setup lang="ts">
defineProps({
    message_name: String,
    message_content: String,
    from_myself: Boolean
});
</script>

<template>
<div class="message" v-bind:class="{ myself: from_myself }">
    <p class="message_name">{{ message_name }}</p>
    <p class="message_content">{{ message_content }}</p>
</div>
</template>

<style scoped>
.message {
    background-color: red;
    width: 80%;
    padding: 5px;
    font-size: 1rem;
    display: block;
    margin-bottom: 20px;
    /* height: fit-content; */
    float: left;
}

p {
    padding: 0px 5px;
}

.myself {
    float: right !important;
}

</style>