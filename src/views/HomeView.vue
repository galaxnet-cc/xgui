<template>
    <div class="container mx-auto">
        <h1 class="text-2xl"> GLX协议栈配置工具 </h1>
        <!-- 这里增加$route.path使得不同ObjectList这个组件不复用 -->
        <div :key="$route.path">
            <ul class="flex flex-wrap text-xl font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 py-10">
                <li class="mr-2">
                    <router-link
                        class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                        to="/">目标机器配置</router-link>
                </li>
                <li class="mr-2" v-for="(v, k) in objects" :key="k">
                    <router-link
                        class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                        :to=getToUrl(k)>{{v}}</router-link>
                </li>
            </ul>
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
 const objects = {
     GlobalCfg: "全局配置",
     PhysicalInterface: "物理接口",
     L3SubInterface: "三层子接口",
     LogicalInterface: "逻辑接口",
     Bridge: "网桥",
     Segment: "网络分段",
     Link: "Link",
     Tunnel: "Tunnel",
     RouteLabelPolicy: "RouteLabelPolicy",
     EdgeRouteLabelFwdEntry: "EdgeRouteLabelFwdEntry",
     RouteLabelFwdEntry: "RouteLabelFwdEntry",
     EdgeRoute: "路由",
     BusinessPolicy: "业务策略",
     FirewallRule: "防火墙",
     DhcpAndDnsSettings: "DHCP&Dns",
     OspfSetting: "OSPF",
     OspfInterface: "OSPF接口",
     OverlayTrafficLimit: "Overlay流量限速",
     SegmentAccProperties: "网络分段加速属性",
     SegmentProperties: "网络分段属性",
     DpiSetting: "DPI设置",
     PortMapping: "端口映射",
     WanAggregateScheduler: "WAN Scheduler设置",
     AddrGroup: "地址组",
     PortGroup: "端口组",
     VRRPSetting: "VRRP",
     Probe: "探测",
     AccIpBinding: "加速ip绑定出口ip",
     CustomAccRegion: "自定义加速区域",
     CustomDnsAccRegion: "自定义dns加速区域"
 }

 const getToUrl = (objType) => {
     return "/objects/" + objType
 }
</script>
