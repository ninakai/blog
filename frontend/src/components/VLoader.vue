<script setup>
import {LoaderPinwheel} from "lucide-vue-next";
</script>

<template>
    <LoaderPinwheel class="loader" color="#FFB308"
                    :size="27"
    ></LoaderPinwheel>
</template>

<style scoped>
@keyframes rotate {
    from {
        transform: rotate(360deg);
    }
}

.loader {
    display: block;
    margin: 0 auto;
    transition: all 0.5s ease;
    animation: rotate 1s linear infinite;
}
</style>
