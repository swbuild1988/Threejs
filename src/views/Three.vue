<template>
    <div class="edit_module">
        <div class="three" id="three_id"></div>
        <div class="edit_three">
            编辑三维
            <Button type="primary" @click="addBox">添加立方体</Button>
            <Button @click="ok">确认</Button>
            <Button @click="cancel">取消</Button>
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

        entity!: EditModule

        mounted() {
            setTimeout(() => {

                let element: HTMLElement | null = document.getElementById("three_id")
                if (element) {
                    this.entity = new EditModule(element)
                    this.entity.draw()
                }
            }, 10)
        }

        addBox() {
            if (!this.entity) return

            this.entity.readyToAdd()
        }

        ok() {
            this.entity.addSure()
        }

        cancel() {
            this.entity.addCancle()
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