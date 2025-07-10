<script setup>
const isHeaderShown = ref(true);

</script>

<template>
  <header
    class="header"
    :class="{ 'is-hidden': !isHeaderShown }"
  >
    <div class="container">
      <div class="logo-container">
        <nuxt-link to="/">
          <AppLogo />
        </nuxt-link>
      </div>
      <AppNav />
    </div>
  </header>
</template>

<style lang="scss" scoped>

header.header {
  position: fixed;
  width: 100%;
  background: #fff;
  top: 0;
  left: 0;
  z-index: 20;
  border-bottom: 1px solid $sanmarino;
  transform: translate3d(0, 0, 0);
  transition: 0.1s all ease-out;
  box-shadow: $box-shadow-3;
  > .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 15px;
    @media (min-width: $grid-sm) {
      padding: 0 30px;
    }
    @media (min-width: $grid-md) {
      //grid-template-columns: 50% 50%;
      max-width: $max-width;
      margin: 0 auto;
    }
    .logo-container {
      min-width: 250px;
      max-width: 400px;
      max-height: 75px;
      padding: 15px 0;
      margin: 0 auto;
      @media (min-width: $grid-lg) {
        margin: 0;
      }
      a {
        display: block;
      }
    }
  }
  &.is-hidden {
    box-shadow: none;
    transform: translate3d(0, -100%, 0);
  }
}

</style>
