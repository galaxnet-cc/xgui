<template>
    <div>
        <button class="text-white text-xl bg-green-500 hover:bg-green-800 rounded" @click="gotoCreate(route.params.type)">创建</button>
    </div>
    <div class="container max-w-full my-8">
        <table class="table-auto text-left">
            <thead class="bg-gray-100 flex flex-wrap">
                <th class="text-base px-2 py-2" v-if="objects.length > 0" v-for="(v, k) in objects[0].Object">{{k}}</th>
                <th class="text-base px-2 py-2" v-if="objects.length > 0">操作</th>
            </thead>
            <tbody>
                <tr class="border-b flex flex-wrap" v-for="obj in objects" :key="obj.ObjectId">
                    <td v-for="(v, k) in obj.Object" class="px-2 py-2">{{ v }}</td>
                    <td class="">
                        <button class="text-white text-xl bg-green-500 hover:bg-green-800 rounded px-2" @click="gotoEdit(route.params.type, obj.ObjectId)">编辑</button>
                        <button class="text-white text-xl bg-green-500 hover:bg-green-800 rounded px-2 ml-4" @click="onDelete(route.params.type, obj.ObjectId)">删除</button>
                        <div class="text-red-500">
                            {{ saveResult }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
 import { ref } from 'vue'
 import { getObjects } from "@/api/glx"
 import { deleteObjectById } from "@/api/glx"
 import { useRoute } from 'vue-router'
 import { useRouter } from 'vue-router'

 const objects = ref([])
 const route = useRoute()
 const router = useRouter()
 const saveResult = ref('')

 const loadObjects = async() => {
     let result = await getObjects(route.params.type)
     objects.value = result.data.Objects
 }

 loadObjects()

 const gotoEdit = (objectType, objId) => {
     router.push("/edit/" + objectType + "/" + objId)
 }

 const gotoCreate = (objectType) => {
     router.push("/create/" + objectType)
 }

 const onDelete = async(objectType, objId) => {
     try {
         let result = await deleteObjectById(route.params.type, objId)
         if (result.status < 500) {
             saveResult.value = "删除成功"

             // reload object again.
             loadObjects()
         } else {
             saveResult.value = "删除失败，原因：" + result.data.Result
         }
     } catch (e) {
         let backendResponse = ""
         if (e.response) {
             // fwdmd API会通过410返回删除成功。
             if (e.response.status == 410) {
                 saveResult.value = "删除成功"

                 // reload object again.
                 loadObjects()
                 return
             }
             backendResponse = "后端异常，原因：" + JSON.stringify(e.response)
         } else {
             backendResponse = "网络错误，检查目标机器访问情况"
         }
         saveResult.value = "保存失败，" + backendResponse
         return
     }
 }
</script>

<script>
 export default {
     name: "ObjectList"
 }
</script>
