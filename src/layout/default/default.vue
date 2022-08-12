<template>
  <div class="layout-default">
    <main>
      <router-view
        :key="$route.path"
        name="content"
      />
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use './default.scss';
</style>
