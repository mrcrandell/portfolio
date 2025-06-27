<script lang="ts" setup>
import { format, parseISO } from 'date-fns';
const route = useRoute();
const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
});
const formattedDate = computed(() =>
  page.value?.date ? format(parseISO(page.value.date), 'MMMM d, yyyy') : ''
)
const datetime = computed(() =>
  page.value?.date ? format(parseISO(page.value.date), 'yyyy-MM-dd') : ''
)
</script>

<template>
  <div class="blog-page-container">
    <header class="page-header">
      <h1>{{ page?.title }}</h1>
      <time
        class="updated"
        :datetime="datetime"
      >
        {{ formattedDate }}
      </time>
    </header>
    <ContentRenderer
      v-if="page"
      :value="page"
    />
  </div>
</template>

<style lang="scss" scoped>
.blog-page-container {
    padding: 7.5rem 2rem 0 2rem;
}

</style>
