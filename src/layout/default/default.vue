<template>
  <div class="layout-default">
    <header class="layout-default__header">
      <a
        href="https://maudau.com.ua/"
        title="MAUDAU"
      >
        <img
          class="layout-default__logo"
          src="@/assets/logo/long-green.svg"
          alt=""
        >
      </a>
    </header>
    <main class="layout-default__main-container">
      <div class="layout-default__main">
        <router-view
          :key="$route.path"
          name="content"
        />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use './default.scss';
</style>
