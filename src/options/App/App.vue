<template>
    <div id="options">
        <div>
            <img src="@/assets/logo.png" alt="">
            <strong id="title">this is options page</strong>
            <button @click="addItem">Add</button>
        </div>
        <table id="engine-list">
            <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Pattern</th>
                <th>Incognito</th>
                <th>Operations</th>
            </tr>
            </thead>
            <tbody>
            <tr class="engine-item" v-for="(item, index) in engineList" :key="item.tempId">
                <td class="engine-id">
                    <input v-if="inEdit[item.tempId]" type="text" v-model="item.id">
                    <template v-else>
                        {{ item.id }}
                    </template>
                </td>
                <td class="engine-name">
                    <input v-if="inEdit[item.tempId]" type="text" v-model="item.title">
                    <template v-else>
                        {{ item.title }}
                    </template>
                </td>
                <td class="engine-pattern">
                    <input v-if="inEdit[item.tempId]" type="text" v-model="item.pattern">
                    <template v-else>
                        {{ item.pattern }}
                    </template>
                </td>
                <td class="engine-is-incognito">
                    <div>
                        <input :id="`check-${item.tempId}`" type="checkbox" v-model="item.incognito"
                               @change="saveEdit(item, false)">
                        <label :for="`check-${item.tempId}`">{{ item.incognito ? "是" : "否" }}</label>
                    </div>
                </td>
                <td class="engine-pattern">
                    <div class="operations">
                        <template v-if="inEdit[item.tempId]">
                            <button @click="saveEdit(item)">Save</button>
                            <button @click="cancelEdit(item)">Cancel</button>
                        </template>
                        <template v-else>
                            <button @click="editLine(item)">Edit</button>
                            <button @click="deleteItem(item, index)">Delete</button>
                        </template>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script lang="ts" setup>

import {ref} from "vue";
import {loadEngineList, TEngineItem} from "@/options/App/App";

const md5 = require("md5")


type TEditEngineItem = TEngineItem & {
    // 编辑用临时id
    tempId: string
}

const engineList = ref<TEditEngineItem[]>([])

const inEdit = ref<{ [index: string]: boolean }>({})

const addItem = () => {
    const tempId = md5(Date.now())
    engineList.value.push({
        tempId,
        id: md5(Date.now()),
        title: "",
        pattern: "",
        incognito: false
    })
    inEdit.value[tempId] = true
}
const editLine = (item: TEditEngineItem) => {
    inEdit.value[item.tempId] = true
}

const cancelEdit = (item: TEditEngineItem) => {
    inEdit.value[item.tempId] = false
}

const saveEdit = (item: TEditEngineItem, _cancelEdit = true) => {
    saveEngines().then(() => {
        _cancelEdit && cancelEdit(item)
    })
}

const saveEngines = () => new Promise((resolve, reject) => {
    chrome.storage.local.set({[dataKey]: engineList.value}).then(() => {
    })
})

const deleteItem = (item: TEditEngineItem, index: number) => {
    if(confirm(`Delete ${item.title}?`)) {
        engineList.value.splice(index, 1)
        saveEngines().then(() => {})
    }
}

const dataKey = "ENGINE-LIST"
const loadEngines = () => {
    loadEngineList().then((dataList) => {
        engineList.value = dataList.map(item => ({
            ...item,
            tempId: md5(item.id)
        }))
    })
}

loadEngines()

</script>
<style lang="scss">
@import "common";
@import "common.table-bordered";

html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0
}

* {
    font-size: 16px;
}

#options {
    width: 75%;
    text-align: left;
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    > div {
        display: flex;
        align-items: center;

        > img {
            width: 48px;
            margin-right: 12px;
        }
    }

    #title {
        flex-grow: 1;
        font-size: 3rem;
        color: #0000;
        background-image: linear-gradient(90deg, pink, #FFC0CBa0, aqua, #00FFFF20);
        -webkit-background-clip: text;
    }

}

th, td {
    padding: 6px 12px;
}

tr {
    > td:first-child {
        width: 108px;
    }

    > td:nth-child(2) {
        width: 256px;
    }

    > td:last-child {
        width: 128px;
    }

    td > input {
        width: 100%;
    }

    &:nth-child(even) {
        background-color: #d9ecff;
    }

    th:last-child {
        width: 168px;
    }

    div.operations > button {
        width: fit-content;
        margin-right: 12px;
        color: #fff;

        &:nth-child(1) {
            background-color: $color-primary;
        }

        &:nth-child(2) {
            color: #333;
        }

        &:nth-child(3) {
            color: #333;
        }

        &:nth-child(4) {
            background-color: $color-danger;
        }
    }
}
</style>
