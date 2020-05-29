<template>
    <div class="edit_module">
        <div class="three" id="three_id"></div>
        <div class="edit_three">
            编辑三维
        </div>
    </div>
</template>

<script lang="ts">
    import {
        Component,
        Vue
    } from 'vue-property-decorator'
    import {
        EditModule
    } from '@/class/EditModule'



    @Component({})
    export default class ThreeClass extends Vue {

        mounted() {
            setTimeout(() => {

                let element: HTMLElement | null = document.getElementById("three_id")
                if (element) {
                    let game: EditModule = new EditModule(element)
                    game.draw()

                }
            }, 10)
        }
    }
</script>

<style scoped>
    .edit_module {
        width: 100%;
        height: 100%;
    }

    .three {
        float: left;
        width: 75%;
        height: 100%;
        border: 1px solid red;
    }

    .edit_three {
        float: right;
        width: 25%;
        height: 100%;
        border: 1px solid red;
    }
</style>