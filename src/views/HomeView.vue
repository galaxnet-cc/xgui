<template>
  <div class="container mx-auto">
    <div>
      <ul
        class="flex flex-wrap text-xl font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 py-10"
      >
        <li class="mr-2">
          <router-link
            class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            to="/"
            >目标机器配置</router-link
          >
          <!-- History is the default tab here -->
        </li>
        <li class="mr-2">
          <router-link
            class="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            to="/phyif"
            >物理接口配置</router-link
          >
          <!-- History is the default tab here -->
        </li>
      </ul>
      <router-view></router-view>
    </div>
  </div>
</template>

<script></script>
