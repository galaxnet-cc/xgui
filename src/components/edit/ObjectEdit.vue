<template>
    <div class="container pt-20">
        <h1 class="text-xl py-4">编辑对象类型：{{route.params.type}}，对象Id：{{route.params.id}}</h1>
        <div v-if="loaded">
            <form>
                <div class="mb-6" v-for="(v, k) in obj.Object">
                    <label
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{k}}</label>
                    <!-- obj[x]方式允许x是变量，这样可以绑定回到ref对象上。 -->
                    <input
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        v-model="obj.Object[k]"
                        required />
                </div>
                <div class="py-4 text-base font-medium text-red-500">
                    {{ saveResult }}
                </div>
                <button
                    type="button"
                    @click="onSubmit"
                    class="ml-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    保存
                </button>
                <button
                    type="button"
                    @click="router.go(-1)"
                    class="ml-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    返回
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
 import { reactive, ref } from 'vue'
 import { getObjectById } from "@/api/glx"
 import { updateObjectById } from "@/api/glx"
 import { useRoute } from 'vue-router'
 import { useRouter } from 'vue-router'

 const route = useRoute()
 const router = useRouter()
 const obj = ref({})
 const saveResult = ref("")

 let origObj = {}
 // We should guard for object full loaded, otherwise v-model above will make
 // component render exception due to access missing attribute of object.
 const loaded = ref(false)

 const loadObject = async() => {
     let result = await getObjectById(route.params.type, route.params.id)
     // Clone the original object to exclude it from vue reactive changes.
     origObj = Object.assign({}, result.data.Object)
     let elemObj = result.data.Object
     // Fix the nested structure in the result.
     switch (route.params.type) {
         case "EdgeRoute":
             elemObj.TunnelId1 = elemObj.NexthopTunnels[0].TunnelId
             if (elemObj.NexthopTunnels.length > 1) {
                 elemObj.TunnelId2 = elemObj.NexthopTunnels[1].TunnelId
             }
             delete elemObj.NexthopTunnels
             break
         case "RouteLabelFwdEntry":
             elemObj.TunnelId1 = elemObj.NexthopTunnels[0].TunnelId
             if (elemObj.NexthopTunnels.length > 1) {
                 elemObj.TunnelId2 = elemObj.NexthopTunnels[1].TunnelId
             }
             delete elemObj.NexthopTunnels
             break
         default:
             // regular object, no need to do special handling.
             break
     }
     obj.value = result.data
     loaded.value = true
 }

 const onSubmit = async() => {
     // We need do this because vue will bind the modified all object field with string type.
     let objUpdate = Object.assign({}, obj.value.Object)
     //console.log("before convert, objUpdate is " + JSON.stringify(objUpdate))
     // Use the original object field type to do the conversion if the value is changed to string.
     // 针对特殊对象进行加工，符合对象模型定义。
     switch(route.params.type) {
         case "EdgeRoute":
             {
                 let tunnels = []
                 let tunnel1 = {}
                 tunnel1.TunnelId = parseInt(objUpdate.TunnelId1, 10)
                 tunnels.push(tunnel1)
                 delete objUpdate.TunnelId1
                 if ("tunnel2" in objUpdate) {
                     let tunnel2 = {}
                     tunnel2.TunnelId = parseInt(objUpdate.TunnelId2, 10)
                     tunnels.push(tunnel2)
                     delete objUpdate.TunnelId2
                 }
                 objUpdate.NexthopTunnels = tunnels
             }
             break
         case "RouteLabelFwdEntry":
             {
                 let tunnels = []
                 let tunnel1 = {}
                 tunnel1.TunnelId = parseInt(objUpdate.TunnelId1, 10)
                 tunnels.push(tunnel1)
                 delete objUpdate.TunnelId1
                 if ("tunnel2" in objUpdate) {
                     let tunnel2 = {}
                     tunnel2.TunnelId = parseInt(objUpdate.TunnelId2, 10)
                     tunnels.push(tunnel2)
                     delete objUpdate.TunnelId2
                 }
                 objUpdate.NexthopTunnels = tunnels
             }
             break
         default:
             break
     }

     for (const prop in origObj) {
         switch (typeof(origObj[prop])) {
             case "number":
                 if(typeof(objUpdate[prop]) != "number") {
                     objUpdate[prop] = parseInt(objUpdate[prop], 10)
                 }
                 break
             case "boolean":
                 if(typeof(objUpdate[prop]) != "boolean") {
                     if (objUpdate[prop] == "true") {
                         objUpdate[prop] = true
                     } else {
                         objUpdate[prop] = false
                     }
                 }
                 break
             default:
                 // default is string, no special handling is needed.
                 break
         }
     }
     //console.log("after convert, objUpdate is " + JSON.stringify(objUpdate))
     // Use updated obj
     try {
         let result = await updateObjectById(route.params.type, route.params.id, objUpdate)
         if (result.status < 500) {
             saveResult.value = "保存成功"
         } else {
             saveResult.value = "保存失败，原因：" + result.data.Result
         }
     } catch (e) {
         let backendResponse = ""
         if (e.response) {
             backendResponse = "后端异常，原因：" + JSON.stringify(e.response)
         } else {
             backendResponse = "网络错误，检查目标机器访问情况"
         }
         saveResult.value = "保存失败，" + backendResponse
         return
     }
 }

 // Do init load.
 loadObject()
</script>

<script>
 export default {
     name: "ObjectEdit"
 }
</script>
