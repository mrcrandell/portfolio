<script setup>
const { data: posts } = await useAsyncData('blog', () =>
  queryCollection('blog').limit(4).order('date', 'DESC').all()
)
</script>

<template>
  <section
    id="blog"
    class="page"
  >
    <div class="content">
      <header class="page-header">
        <h1>Blog</h1>
      </header>
      <div class="post-grid">
        <PostCard
          v-for="post in posts"
          :key="post.path"
          :post="post"
        />
      </div>
      <div class="see-all-btn-container">
        <NuxtLink
          to="/blog"
          class="btn btn-primary"
        >
          See All Posts
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.post-grid {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  max-width: $max-width;
  margin: 0 auto;
  @media (min-width: $grid-lg) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.see-all-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;

  @media (min-width: $grid-lg) {
    justify-content: flex-end;
  }
}
</style>
