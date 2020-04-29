<template>
    <div class="three" id="three_id"></div>
</template>

<script lang="ts">
    import {
        Component,
        Vue
    } from 'vue-property-decorator'
    import {
        Game
    } from '@/class/Game'



    @Component({})
    export default class ThreeClass extends Vue {

        mounted() {
            let element: HTMLElement | null = document.getElementById("three_id")
            if (element) {
                let game: Game = new Game(element)

                game.createScene()
                
            }
        }
    }
</script>

<style scoped>
    .three {
        width: 100%;
        height: 100%;
    }
</style>