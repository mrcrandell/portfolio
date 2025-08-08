<script lang="ts" setup>
import { format, parseISO } from 'date-fns';
const route = useRoute();
const { data: post } = await useAsyncData(route.path, () => {
  return queryCollection('blog').path(route.path).first()
});
const formattedDate = computed(() =>
  post.value?.date ? format(parseISO(post.value.date), 'MMMM d, yyyy') : ''
);
const datetime = computed(() =>
  post.value?.date ? format(parseISO(post.value.date), 'yyyy-MM-dd') : ''
);

const postTitle = computed(() => {
  return `${post.value?.title} | Matt Crandell`;
});

// Set dynamic post metadata
useHead(() => ({
  title: postTitle.value,
  meta: [
    {
      name: 'description',
      content: post.value?.description || '',
    },
  ],
}));
</script>

<template>
  <article class="blog-post-container">
    <header class="post-masthead">
      <div class="featured-img">
        <img
          v-if="post?.image"
          loading="lazy"
          class="img-fluid"
          :src="post.image"
          :alt="post?.image || ''"
        >
      </div>
      <div class="post-header">
        <div clas="entry-meta">
          <span>{{ post?.category }}</span>
          <h1
            class="entry-title"
          >
            {{ post?.title }}
          </h1>
          <div class="entry-meta">
            <time
              class="updated"
              :datetime="datetime"
            >
              {{ formattedDate }}
            </time>
          <!-- <div class="read-time">
            {{ post.readTime }}
          </div> -->
          </div>
        </div>
      </div>
    </header>

    <ContentRenderer
      v-if="post"
      :value="post"
      class="post-content"
    />
  </article>
</template>

<style lang="scss" scoped>
/* .blog-post-container {
    // padding: 7.5rem 2rem 0 2rem;
    padding: ($nav-height + 3rem) 2rem 0 2rem;
    > * {
    max-width: $max-width;
    margin-left: auto;
    margin-right: auto;
  }
} */

code {

}

</style>
