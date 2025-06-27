<script setup>
definePageMeta({
  title: "Matt Crandell's Blog | Web Developer",
  description: 'Matt Crandel is a seasoned front end web developer with over ten years experience working with everything from small businesses to large corporations.'
});

const { data: posts } = await useAsyncData('blog', () => queryCollection('blog').all())

// const { data: posts2 } = await useAsyncData('blog', () => queryCollection('blog').all())

// console.log(posts2.value);
</script>
<template>
  <div class="blog-index-container">
    <header class="page-header">
      <h1>Blog</h1>
    </header>
    <ContentRenderer
      v-if="posts"
      :value="posts"
    />
    <div
      v-for="post in posts"
      :key="post.path"
      class="mb-6"
    >
      <NuxtLink :to="post.path">
        <h2>{{ post.title }}</h2>
      </NuxtLink>
      <p class="text-gray-600">
        {{ post.description }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.blog-index-container {
  padding: ($nav-height + 3rem) 2rem 0 2rem;
  > * {
    max-width: $max-width;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
