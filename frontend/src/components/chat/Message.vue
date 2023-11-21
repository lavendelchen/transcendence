

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

@import "../../assets/base.css";
.message {
    background-color: white;
    color: black;
    font-size: var(--font-size-tiny);
    width: 80%;
    padding: 5px;
    display: block;
    margin-bottom: 20px;
    float: left;
}

p {
    padding: 0px 5px;
    text-align: left;
}

.myself {
    float: right !important;
}

</style>