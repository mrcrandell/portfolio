<script setup>
const route = useRoute()

useHead({
  title: route.meta.title,
  meta: [
    { name: 'description', content: route.meta.description }
  ],
});
</script>
<template>
  <div>
    <AppHeader />
    <main class="main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/_fonts.scss' as *;
@use '~/assets/scss/_reboot.scss' as *;
@use '~/assets/scss/_global.scss' as *;
// @import '~/assets/scss/_blog-portfolio.scss';
@use '~/assets/scss/_typography.scss' as *;
@use '~/assets/scss/_buttons.scss' as *;
@use '~/assets/scss/_forms.scss' as *;
@use '~/assets/scss/_alerts.scss' as *;
@use '~/assets/scss/_masthead.scss' as *;
@use '~/assets/scss/pages/_intro.scss' as *;
@use '~/assets/scss/pages/_blog-portfolio.scss' as *;

</style>
