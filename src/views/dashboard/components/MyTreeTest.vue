<template>
  <div>
    <ul>
      <li v-for="item in list" :key="item.id">
        <slot :row="item">{{ item.uname }}</slot>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  }
}
</script>
