<template>
  <div class="layout-default">
    <header class="layout-default__header">
      <img
        class="layout-default__logo"
        src="@/assets/logo/long-green.svg"
        alt=""
      >
    </header>
    <main class="layout-default__main-container">
      <div class="layout-default__main">
        <router-view
          :key="$route.path"
          name="content"
        />
      </div>
    </main>
    <footer class="layout-default__footer">
      footer
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@use './default.scss';
</style>
