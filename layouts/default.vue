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
@import '~/assets/scss/_fonts.scss';
@import '~/assets/scss/_reboot.scss';
@import '~/assets/scss/_global.scss';
// @import '~/assets/scss/_blog-portfolio.scss';
@import '~/assets/scss/_typography.scss';
@import '~/assets/scss/_buttons.scss';
@import '~/assets/scss/_forms.scss';
@import '~/assets/scss/_alerts.scss';
@import '~/assets/scss/_masthead.scss';
@import '~/assets/scss/pages/_intro.scss';
@import '~/assets/scss/pages/_blog-portfolio.scss';

</style>
