<template>
  <div>
    <table class="w-full table-auto text-left">
      <!-- 这里可以放一个操作区域，用于创建新的对象。 -->
      <thead class="bg-gray-100">
        <th class="text-sm px-4 py-4">物理接口名称</th>
        <th class="text-sm px-4 py-4">模式</th>
        <th class="text-sm px-4 py-4">网桥</th>
	<th class="text-sm px-4 py-4">操作</th>
      </thead>
      <tbody>
        <tr class="border-b" v-for="obj in objects" :key="obj.ObjectId">
          <td class="px-4 py-4">{{ obj.Object.Name }}</td>
          <td class="px-4 py-4">{{ obj.Object.Mode }}</td>
          <td class="px-4 py-4">{{ obj.Object.BridgeName }}</td>
	  <td class="px-4 py-4 flex">
	    <a href="/phyif/edit">编辑</a>
	    <a href="/phyif/delete">删除</a>
	  </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup="setup" lang="ts">
  import { ref } from 'vue'
  import { getObjects } from "@/api/glx"

  const objects = ref([])

  const loadPhyIfs = async() => {
    let result = await getObjects('PhysicalInterface')
    console.log("result " + result.data.Objects)
    objects.value.data = result.data.Objects
  }

  loadPhyIfs()
</script>

<script lang="ts">
export default {
  name: "PhysicalInterface",
  props: {},
  data() {
    return {};
  },
};
</script>
