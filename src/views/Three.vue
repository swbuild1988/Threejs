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
            setTimeout(() => {

                let element: HTMLElement | null = document.getElementById("three_id")
                if (element) {
                    let width: number = element.offsetWidth
                    let height: number = element.offsetHeight
                    
                    let game: Game = new Game(element)

                    game.createScene()

                }
            }, 10)
        }
    }
</script>

<style scoped>
    .three {
        width: 100%;
        height: 100%;
        border: 1px solid red;
    }
</style>