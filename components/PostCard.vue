<script setup lang="ts">
import { format, parseISO } from 'date-fns';
const props = defineProps({
  post: {
    type: Object,
    default() {
      return {};
    },
  },
});
const formattedDate = computed(() =>
  props.post.date ? format(parseISO(props.post.date), 'MMMM d, yyyy') : ''
);
const datetime = computed(() =>
  props.post.date ? format(parseISO(props.post.date), 'yyyy-MM-dd') : ''
);
</script>

<template>
  <NuxtLink
    class="post-card"
    :to="post.path"
  >
    <div class="featured-img post-card-featured-img">
      <img
        v-if="post?.image"
        loading="lazy"
        class="img-fluid"
        :src="post.image"
        :alt="post?.image || ''"
      >
    </div>
    <div class="post-tile-content">
      <div class="entry-meta">
        {{ post?.category }}
      </div>
      <h1 class="entry-title">
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
      <button
        class="btn btn-sm btn-primary btn-read-more"
      >
        Read More
      </button>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.post-card {
  border: 1px solid $sanmarino;
  box-shadow: $box-shadow-1;
  display: flex;
  flex-direction: column;
  .post-card-featured-img {
    overflow: hidden;
    position: relative;
    img {
      display: block;
      max-width: 100%;
      width: 100%;
      height: auto;
      @include transition(all 0.3s ease-in-out);
    }
  }
  .post-tile-content {
    padding: rem(10);
    flex: 1;
    display: flex;
    flex-direction: column;
    .entry-title {
      font-size: 1rem; // 16px
      line-height: 1.3;
      color: $black;
      margin-bottom: 0.5rem;
      flex: 1;
    }
    .entry-meta {
      font-size: 0.875rem; // 14px
      color: $middle-gray;
    }
    .btn {
      margin-top: rem(8);
    }
  }
  &:hover {
    box-shadow: $box-shadow-2;
    .post-card-featured-img {
      img {
        transform: scaleX(1.05) scaleY(1.05);
      }
    }
    .btn {
      background-color: $goblin;
    }
  }
}
</style>
