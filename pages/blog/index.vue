<script setup>
definePageMeta({
  title: "Matt Crandell's Blog | Web Developer",
  description: 'Matt Crandel is a seasoned front end web developer with over ten years experience working with everything from small businesses to large corporations.'
});

const { data: posts } = await useAsyncData('blog', () => queryCollection('blog').order('date', 'DESC').all())

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
    <div class="post-grid">
      <PostCard
        v-for="post in posts"
        :key="post.path"
        :post="post"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.blog-index-container {
  padding: ($nav-height + 3rem) 2rem rem(32) 2rem;
  /* > * {
    max-width: $max-width;
    margin-left: auto;
    margin-right: auto;
  } */
}
.post-grid {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  max-width: $max-width;
  margin: 0 auto;
  //padding: 0 30px;
  @media (min-width: $grid-lg) {
    // grid-template-columns: repeat(2, 1fr);
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
