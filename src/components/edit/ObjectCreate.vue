<template>
    <div class="container pt-20">
        <h1 class="text-xl py-4">创建对象类型：{{route.params.type}}</h1>
        <div>
            <form>
                <div class="mb-6" v-for="(v, k) in obj">
                    <label
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{k}}</label>
                    <!-- obj[x]方式允许x是变量，这样可以绑定回到ref对象上。 -->
                    <input
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        v-model="obj[k]"
                        required />
                </div>
                <div class="py-4 text-base font-medium text-red-500">
                    {{ saveResult }}
                </div>
                <button
                    type="button"
                    @click="onSubmit"
                    class="ml-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    创建
                </button>
                <button
                    type="button"
                    @click="router.go(-1)"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    返回
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
 import { reactive, ref } from 'vue'
 import { createObject } from "@/api/glx"
 import { useRoute } from 'vue-router'
 import { useRouter } from 'vue-router'

 const route = useRoute()
 const router = useRouter()
 const obj = ref({})
 const saveResult = ref("")

 let objTemplate = {}

 const initObjectTemplate = () => {
     switch(route.params.type) {
         case "Bridge":
             objTemplate = {
                 Name: "bridge2",
                 BviEnable: true,
                 BviIpAddrWithPrefix: "192.168.2.1/24"
             }
             break
         case "L3SubInterface":
             objTemplate = {
                 PhysicalInterface: "WAN1",
                 SubId: 100,
                 Type: "dot1q",
                 VlanId: 100
             }
             break
         case "Segment":
             objTemplate = {
                 Id: 1,
                 AccEnable: false,
                 IntEdgeEnable: false
             }
             break
         case "SegmentAccProperties":
             objTemplate = {
                 Segment: 0,
                 AccIp1: "222.222.222.222"
             }
             break
         case "Link":
             objTemplate = {
                 LinkId : 1,
                 LocalWanName: "WAN1",
                 RemoteIp: "1.1.1.1",
                 //RemotePort: 2288,
                 TunnelId: 1,
                 RouteLabel: "0xffffffffff",
                 IsTcp: false
             }
             break
         case "Tunnel":
             objTemplate = {
                 TunnelId: 1,
                 IsPassive: false
             }
             break
         case "EdgeRoute":
             objTemplate = {
                 Segment: 0,
                 DestPrefix: "8.8.8.8/32",
                 RouteProtocol: "overlay",
                 NexthopType: "overlay",
                 RouteLabel: "0x200",
                 AdvertiseEnable: false,
                 IsAcc: false,
                 IsAccReverse: false,
             }
             break
         case "RouteLabelPolicy":
             objTemplate = {
                 RouteLabel: "0x100",
                 Type: 0
             }
             break
         case "EdgeRouteLabelFwdEntry":
             objTemplate = {
                 RouteLabel: "0x100",
                 // TODO: how to support nexthop tunnel config ???
                 // 暂时只支持单tunnel配置
                 TunnelId1: 1,
             }
             break
         case "RouteLabelFwdEntry":
             objTemplate = {
                 RouteLabel: "0x100",
                 // TODO: how to support nexthop tunnel config ???
                 // 暂时只支持单tunnel配置
                 TunnelId1: 1,
             }
             break
         case "BusinessPolicy":
             objTemplate = {
                 Name: "bizpol1",
                 Priority: 1,
                 SrcAddressWithPrefix: "192.168.88.0/24",
                 DstAddressWithPrefix: "0.0.0.0/0",
                 DirectEnable: true,
                 SteeringType: 0,
                 SteeringMode: 0,
                 SteeringInterface: "WAN1",
                 AppId: 65535
             }
             break
         case "OspfSetting":
             objTemplate = {
                 Segment: 0,
                 OverlayAdvertiseEnable: true,
                 AreaId1: 1
             }
             break
         case "OspfInterface":
             objTemplate = {
                 Interface: "GE1",
                 AreaId: 1
             }
             break
         case "FirewallRule":
             objTemplate = {
                 Name: "fwrule0",
                 Segment: 0,
                 Priority: 100,
                 SrcAddressWithPrefix: "192.168.88.0/24",
                 DstAddressWithPrefix: "0.0.0.0/0",
                 L4Protocol: 0,
                 Action: "Deny",
                 AppId: 65535
             }
             break
         case "OverlayTrafficLimit":
             objTemplate = {
                 Segment: 0,
                 TxLimit: 4294967295,
                 RxLimit: 4294967295,
                 TxRxCombined: false
             }
             break
         case "DpiSetting":
             objTemplate = {
                 Name: "default",
                 DpiEnable: true
             }
             break
         case "HostStackDhcp":
             objTemplate = {
                 Name: "default",
                 GatewayIP: "192.168.88.1",
                 StartIP: "192.168.88.100",
                 EndIP: "192.168.88.200",
                 NetMask: "255.255.255.0",
                 LeaseTime: "1h"
             }
             break
         default:
             break
     }

     // assign to the reactive value.
     obj.value = Object.assign({}, objTemplate)
 }

 const onSubmit = async() => {
     // We need do this because vue will bind the modified all object field with string type.
     let objUpdate = Object.assign({}, obj.value)
     //console.log("before convert, objUpdate is " + JSON.stringify(objUpdate))
     // Use the original object field type to do the conversion if the value is changed to string.
     for (const prop in objTemplate) {
         switch (typeof(objTemplate[prop])) {
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
         case "EdgeRouteLabelFwdEntry":
             {
                 let tunnels = []
                 let tunnel1 = {}
                 tunnel1.TunnelId = objUpdate.TunnelId1
                 tunnels.push(tunnel1)
                 objUpdate.NexthopTunnels = tunnels
             }
             break
         case "RouteLabelFwdEntry":
             {
                 let tunnels = []
                 let tunnel1 = {}
                 tunnel1.TunnelId = objUpdate.TunnelId1
                 tunnels.push(tunnel1)
                 objUpdate.NexthopTunnels = tunnels
             }
             break
         case "OspfSetting":
             {
                 let areas = []
                 let area1 = {}
                 area1.AreaId = objUpdate.AreaId1
                 areas.push(area1)
                 objUpdate.Areas = areas
             }
             break
         default:
             break
     }

     console.log("after convert, objUpdate is " + JSON.stringify(objUpdate))
     // Use updated obj
     try {
         let result = await createObject(route.params.type, objUpdate)
         if (result.status < 500) {
             saveResult.value = "创建成功"
         } else {
             saveResult.value = "创建失败，原因：" + result.data.Result
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

 initObjectTemplate()
</script>

<script>
 export default {
     name: "ObjectCreate"
 }
</script>
