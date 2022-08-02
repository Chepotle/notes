<template>
    <router-view />
</template>

<style lang="scss">
@import "@/assets/scss/mixin.scss";

* {
    box-sizing: border-box;
    margin: 0;
    font-family: "Open Sans", sans-serif;
    font-size: 14px;
}

.container {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0 15px;
}

.modal {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.7);
    &__alert {
        position: absolute;
        left: 50%;
        top: 30%;
        width: 30%;
        transform: translateX(-50%);
        @include media("max", "lg") {
            width: 50%;
        }
        @include media("max", "sm") {
            width: 70%;
        }
    }
}

input:focus-visible {
    outline: none;
}
</style>
