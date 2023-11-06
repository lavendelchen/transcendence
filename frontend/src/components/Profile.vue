<script setup lang="ts">

</script>
<template>
    <div class="profile">
        <div class="hero">
            <img src="../assets/img/profileCircle.svg" alt="PROFILE PICTURE">
            <div>
                <p>FIRSTNAME LASTNAME</p>
                <p>USERNAME</p>
            </div>
        </div>
        <div>
        </div>
    </div>
    
</template>
<style scoped>

    .profile {
        padding: 10px;
        border: 0.5px solid white;

    }
    .hero {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    img {
        height: 120px;
        width: 120px;
    }
</style>