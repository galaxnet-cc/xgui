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
        <h1 class="text-xl py-4">创建对象类型：{{ route.params.type }}</h1>
        <div>
            <form>
                <div class="mb-6" v-for="(v, k) in obj">
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{ k }}</label>
                    <!-- obj[x]方式允许x是变量，这样可以绑定回到ref对象上。 -->
                    <input
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        v-model="obj[k]" required />
                </div>
                <div class="py-4 text-base font-medium text-red-500">
                    {{ saveResult }}
                </div>
                <button type="button" @click="onSubmit"
                    class="ml-8 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    创建
                </button>
                <button type="button" @click="router.go(-1)"
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
    switch (route.params.type) {
        case "Bridge":
            objTemplate = {
                Name: "bridge2",
                BviEnable: true,
                Mtu: 1500,
                BviIpAddrWithPrefix: "192.168.2.1/24",
                BviIp6AddrWithPrefix: ""
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
                IntEdgeEnable: false,
                DnsInterceptEnable: false,
                DnsIpCollectEnable: false,
                AccRouteLabel: "0xffffffffff",
                MinQosLevel: 0,
                MaxQosLevel: 7,
            }
            break
        case "SegmentAccProperties":
            objTemplate = {
                Segment: 0,
                AccIp1: "222.222.222.222",
                BatchRouteFilePath: "",
                BatchRouteFibType: ""
            }
            break
        case "SegmentProperties":
            objTemplate = {
                Segment: 1,
                E2EIp1: "1.1.1.1/32"
            }
            break
        case "Link":
            objTemplate = {
                LinkId: 1,
                LocalWanName: "WAN1",
                RemoteIp: "1.1.1.1",
                //RemotePort: 2288,
                TunnelId: 1,
                RouteLabel: "0xffffffffff",
                IsTcp: false,
                NoEncryption: false,
                QosLevel: 0,
            }
            break
        case "Tunnel":
            objTemplate = {
                TunnelId: 1,
            }
            break
        case "EdgeRoute":
            objTemplate = {
                Segment: 0,
                DestPrefix: "8.8.8.8/32",
                RouteProtocol: "overlay",
                NexthopType: "overlay",
                NexthopIp: "127.0.0.1",
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
                TunnelId1: 1,
                // 为0则忽略。
                TunnelId2: 0
            }
            break
        case "RouteLabelFwdEntry":
            objTemplate = {
                RouteLabel: "0x100",
                TunnelId1: 1,
                TunnelId2: 0
            }
            break
        case "BusinessPolicy":
            objTemplate = {
                Name: "bizpol1",
                Priority: 1,
                SrcAddressWithPrefix: "192.168.88.0/24",
                DstAddressWithPrefix: "0.0.0.0/0",
                DirectEnable: true,
                OverlayEnable: false,
                AccEnable: false,
                SteeringType: 0,
                SteeringMode: 0,
                SteeringInterface: "WAN1",
                AppId: 65535,
                RouteLabel: "0xffffffffff",
                SrcAddrGroup: "",
                DstAddrGroup: "",
                SrcPortGroup: "",
                DstPortGroup: "",
                QosLevel: 0,
                RateLimitEnable: false,
                UpRateLimit: 0,
                DownRateLimit: 0,
                RateBurst: 0
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
                AppId: 65535,
                SrcAddrGroup: "",
                DstAddrGroup: "",
                SrcPortGroup: "",
                DstPortGroup: "",
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
        case "DhcpAndDnsSettings":
            objTemplate = {
                Name: "default",
                StartIP: "192.168.88.100",
                IPNum: 8,
                NetMask: "255.255.255.0",
                LeaseTime: "1h",
                AccUpstreamDnsServer1: "",
                AccUpstreamDnsServer2: "",
                LocalUpstreamDnsServer1: "",
                LocalUpstreamDnsServer2: "",
                AccDomainList: "",
                LocalDomainList: "",
                DhcpEnable: false,
                LocalDnsServerEnable: false,
                OptionCode1: 3,
                OptionValue1: "192.168.88.1",
                OptionCode2: "",
                OptionValue2: ""
            }
            break
        case "PortMapping":
            objTemplate = {
                Interface: "WAN1",
                ExternalPort: 7777,
                Protocol: "tcp",
                Segment: 0,
                InternalAddr: "169.254.100.2",
                InternalPort: 7777
            }
            break
        case "AddrGroup":
            objTemplate = {
                AddrGroupName: "addrGroup1",
                IpAddrWithPrefix1: "1.1.1.1/32",
                IpAddrWithPrefix2: ""
            }
            break
        case "PortGroup":
            objTemplate = {
                PortGroupName: "portGroup1",
                ProtocolType1: "tcp",
                PortList1: "7777",
                ProtocolType2: "",
                PortList2: ""
            }
            break
        case "VRRPSetting":
            objTemplate = {
                VRID: 1,
                Segment: 0,
                VIP: "",
                Priority: 254,
                Bridge: "default",
                AdvInterval: 1,
                Unicast: false,
                PeerAddress: ""
            }
            break
        case "Probe":
            objTemplate = {
                Name: "probe1",
                Type: "WAN",
                IfName: "WAN1",
                Mode: "CMD_PING",
                DstAddr: "1.1.1.1",
                DstPort: 1111,
                Interval: 2,
                Timeout: 1,
                FailThreshold: 5,
                OkThreshold: 10
            }
            break
        case "AccIpBinding":
            objTemplate = {
                AccIp: "11.11.11.22",
                OutIp1: "111.111.111.111",
                OutIp2: ""
            }
            break
        default:
            break
    }

    // assign to the reactive value.
    obj.value = Object.assign({}, objTemplate)
}

const onSubmit = async () => {
    // We need do this because vue will bind the modified all object field with string type.
    let objUpdate = Object.assign({}, obj.value)
    //console.log("before convert, objUpdate is " + JSON.stringify(objUpdate))
    // Use the original object field type to do the conversion if the value is changed to string.
    for (const prop in objTemplate) {
        switch (typeof (objTemplate[prop])) {
            case "number":
                if (typeof (objUpdate[prop]) != "number") {
                    objUpdate[prop] = parseInt(objUpdate[prop], 10)
                }
                break
            case "boolean":
                if (typeof (objUpdate[prop]) != "boolean") {
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
    switch (route.params.type) {
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
            {
                let tunnels = []
                let tunnel1 = {}
                tunnel1.TunnelId = objUpdate.TunnelId1
                tunnels.push(tunnel1)
                if (objUpdate.TunnelId2 !== 0) {
                    let tunnel2 = {}
                    tunnel2.TunnelId = objUpdate.TunnelId2
                    tunnels.push(tunnel2)
                }
                objUpdate.NexthopTunnels = tunnels
            }
            break
        case "RouteLabelFwdEntry":
            {
                let tunnels = []
                let tunnel1 = {}
                tunnel1.TunnelId = objUpdate.TunnelId1
                tunnels.push(tunnel1)
                if (objUpdate.TunnelId2 !== 0) {
                    let tunnel2 = {}
                    tunnel2.TunnelId = objUpdate.TunnelId2
                    tunnels.push(tunnel2)
                }
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
        case "DhcpAndDnsSettings":
            {
                let options = []
                let option1 = {}
                option1.OptionCode = objUpdate.OptionCode1
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
                if (objUpdate.IpAddrWithPrefix2 !== "") {
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
        case "AccIpBinding":
            {
                let members = []
                let member1 = {}
                member1.IpAddr = objUpdate.OutIp1
                members.push(member1)
                if (objUpdate.OutIp2 !== "") {
                    let member2 = {}
                    member2.IpAddr = objUpdate.OutIp2
                    members.push(member2)
                }
                objUpdate.OutIps = members
            }
            break
        case "LogicalInterface":
            {
                let members = []
                let member1 = {}
                member1.IpAddr = objUpdate.AdditionalIp1
                members.push(member1)
                if (objUpdate.AdditionalIp2 !== "") {
                    let member2 = {}
                    member2.IpAddr = objUpdate.AdditionalIp2
                    members.push(member2)
                }
                objUpdate.AdditionalIps = members
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
