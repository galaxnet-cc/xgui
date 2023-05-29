<template>
    <div class="container pt-20">
        <div class="pb-8">
            参数说明：
            <ol>
                <li>
                    1. RouteLabelFwdEntry/EdgeRouteLabelFwdEntry表项中，如无需配置Tunnel2，则置为0即可，将在创建时忽略。
                </li>
            </ol>
        </div>
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
         case "SegmentAccProperties":
             elemObj.AccIp1 = elemObj.AccIps[0].Ip4Address
             delete elemObj.AccIps
             break
         case "SegmentProperties":
             elemObj.E2EIp1 = elemObj.E2EIps[0].Ip4Address
             delete elemObj.E2EIps
             break
         case "DhcpAndDnsSettings":
             elemObj.OptionCode1 = elemObj.Options[0].OptionCode
             elemObj.OptionValue1 = elemObj.Options[0].OptionValue
             if (elemObj.Options.length > 1) {
                 elemObj.OptionCode2 = elemObj.Options[1].OptionCode
                 elemObj.OptionValue2 = elemObj.Options[1].OptionValue
             } else {
                 elemObj.OptionCode2 = ""
                 elemObj.OptionValue2 = ""
             }
             delete elemObj.Options
             break
         case "EdgeRouteLabelFwdEntry":
         case "RouteLabelFwdEntry":
             if (elemObj.NexthopTunnels != null) {
                 elemObj.TunnelId1 = elemObj.NexthopTunnels[0].TunnelId
                 elemObj.TunnelId1Priority = elemObj.NexthopTunnels[0].TunnelPriority
                 if (elemObj.NexthopTunnels.length > 1) {
                     elemObj.TunnelId2 = elemObj.NexthopTunnels[1].TunnelId
                     elemObj.TunnelId2Priority = elemObj.NexthopTunnels[0].TunnelPriority
                 } else {
                     // support tunnel 2.
                     elemObj.TunnelId2 = "0"
                     elemObj.TunnelId2Priority = 90
                 }
                 delete elemObj.NexthopTunnels
             } else {
                 delete elemObj.NexthopTunnels
                 elemObj.TunnelId1 = "1"
                 elemObj.Tunnel1Priority = 100
                 // support tunnel 2.
                 elemObj.TunnelId2 = "0"
                 elemObj.TunnelId2Priority = 90
             }
             break
         case "AddrGroup":
             elemObj.IpAddrWithPrefix1 = elemObj.AddrGroupMembers[0].IpAddrWithPrefix
             if (elemObj.AddrGroupMembers.length > 1) {
                 elemObj.IpAddrWithPrefix2 = elemObj.AddrGroupMembers[1].IpAddrWithPrefix
             } else {
                 elemObj.IpAddrWithPrefix2 = ""
             }
             delete elemObj.AddrGroupMembers
             break
         case "PortGroup":
             elemObj.ProtocolType1 = elemObj.PortGroupMembers[0].ProtocolType
             elemObj.PortList1 = elemObj.PortGroupMembers[0].PortList
             if (elemObj.PortGroupMembers.length > 1) {
                 elemObj.ProtocolType2 = elemObj.PortGroupMembers[1].ProtocolType1
                 elemObj.PortList2 = elemObj.PortGroupMembers[1].PortList2
             } else {
                 elemObj.ProtocolType2 = ""
                 elemObj.PortList2 = ""
             }
             delete elemObj.PortGroupMembers
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
         case "SegmentAccProperties":
             {
                 let accIps = []
                 let accIp1 = {}
                 accIp1.Ip4Address = objUpdate.AccIp1
                 accIps.push(accIp1)
                 objUpdate.AccIps = accIps
             }
             break
         case "SegmentProperties":
             {
                 let E2EIps = []
                 let E2EIp1 = {}
                 E2EIp1.Ip4Address = objUpdate.E2EIp1
                 E2EIps.push(E2EIp1)
                 objUpdate.E2EIps = E2EIps
             }
             break
         case "EdgeRouteLabelFwdEntry":
         case "RouteLabelFwdEntry":
             {
                 let tunnels = []
                 let tunnel1 = {}
                 tunnel1.TunnelId = parseInt(objUpdate.TunnelId1, 10)
                 tunnel1.TunnelPriority = parseInt(objUpdate.TunnelId1Priority, 10)
                 tunnels.push(tunnel1)
                 delete objUpdate.TunnelId1

                 let tunnel2 = {}
                 tunnel2.TunnelId = parseInt(objUpdate.TunnelId2, 10)
                 tunnel2.TunnelPriority = parseInt(objUpdate.TunnelId2Priority, 10)
                 // use 0 as special value to remove tunnel in update.
                 if (tunnel2.TunnelId !== 0) {
                     tunnels.push(tunnel2)
                 }
                 delete objUpdate.TunnelId2

                 objUpdate.NexthopTunnels = tunnels
             }
             break
         case "DhcpAndDnsSettings":
             {
                 let options = []
                 let option1 = {}
                 option1.OptionCode = parseInt(objUpdate.OptionCode1, 10)
                 option1.OptionValue = objUpdate.OptionValue1
                 options.push(option1)
                 if (objUpdate.OptionCode2 !== "") {
                     let option2 = {}
                     option2.OptionCode = parseInt(objUpdate.OptionCode2, 10)
                     option2.OptionValue = objUpdate.OptionValue2
                     options.push(option2)
                 }
                objUpdate.Options = options
             }
             break
         case "AddrGroup":
             {
                 let members = []
                 let member1 = {}
                 member1.IpAddrWithPrefix = objUpdate.IpAddrWithPrefix1
                 members.push(member1)
                 if (objUpdate.MemberCode2 !== "") {
                     let member2 = {}
                     member2.IpAddrWithPrefix = objUpdate.IpAddrWithPrefix2
                     members.push(member2)
                 }
                objUpdate.AddrGroupMembers = members
             }
             break
         case "PortGroup":
             {
                 let members = []
                 let member1 = {}
                 member1.ProtocolType = objUpdate.ProtocolType1
                 member1.PortList = objUpdate.PortList1
                 members.push(member1)
                 if (objUpdate.ProtocolType2 !== "") {
                     let member2 = {}
                     member2.ProtocolType = objUpdate.ProtocolType2
                     member2.PortList = objUpdate.PortList2
                     members.push(member2)
                 }
                objUpdate.PortGroupMembers = members
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
