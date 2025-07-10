<script setup>
import { computed } from 'vue';

const props = defineProps({
  project: {
    type: Object,
    default() {
      return {}
    },
  },
});

const displayImgs = computed(() => {
  return [
    {
      type: 'image/webp',
      src1x: props.project.displayImg.replace('.jpg', '.webp'),
      src2x: props.project.displayImg.replace('.jpg', '@2x.webp'),
    },
    {
      type: 'image/jpg',
      src1x: props.project.displayImg,
      src2x: props.project.displayImg.replace('.jpg', '@2x.jpg'),
    },
  ]
});

const hoverImgs = computed(() => {
  return [
    {
      type: 'image/webp',
      src1x: props.project.hoverImg.replace('.jpg', '.webp'),
      src2x: props.project.hoverImg.replace('.jpg', '@2x.webp'),
    },
    {
      type: 'image/jpg',
      src1x: props.project.hoverImg,
      src2x: props.project.hoverImg.replace('.jpg', '@2x.jpg'),
    },
  ]
});

</script>

<template>
  <nuxt-link
    class="portfolio-thumbnail"
    :to="`/portfolio/${project.slug}`"
  >
    <div class="client-img">
      <picture>
        <source
          v-for="(img, index) in displayImgs"
          :key="index"
          :type="img.type"
          :srcset="`${img.src1x} 1x, ${img.src2x} 2x`"
        >
        <img
          :src="project.displayImg"
          :alt="project.name"
          class="img-fluid main-img"
          width="355"
          height="213"
        >
      </picture>
      <picture>
        <source
          v-for="(img, index) in hoverImgs"
          :key="index"
          :type="img.type"
          :srcset="`${img.src1x} 1x, ${img.src2x} 2x`"
        >
        <img
          :src="project.hoverImg"
          :alt="project.name"
          class="img-fluid hover-img"
          width="355"
          height="213"
        >
      </picture>
    </div>
    <div class="info">
      <div class="client-name">
        {{ project.name }}
      </div>
      <div class="project-meta">
        <div
          v-if="project.city"
          class="client-location"
        >
          {{ project.city }}, {{ project.state }}
        </div>
        <button class="btn btn-sm btn-primary">
          View Project
        </button>
      </div>
    </div>
  </nuxt-link>
</template>

<style lang="scss" scoped>
.portfolio-thumbnail {
  @include transition(box-shadow 0.3s ease-in-out);
}
.portfolio-thumbnail {
  border: 1px solid $sanmarino;
  box-shadow: $box-shadow-1;

  display: flex;
  flex-direction: column;

  div.info {
    padding: 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
    .client-name {
      font-size: 1rem; // 16px
      line-height: 1.3;
      color: $black;
      margin-bottom: 0.5rem;
      flex: 1;
    }
    .project-meta,
    .client-location {
      font-size: 0.875rem; // 14px
      color: $middle-gray;
    }
    .project-meta {
      .client-location {
        margin-bottom: 0.25rem; // 4px
      }
      @media (min-width: $grid-md) {
        display: flex;
        align-items: center;
        > *:not(.client-location) {
          margin-left: auto;
        }
      }
    }
  }
  &:hover {
    box-shadow: $box-shadow-2;
    div.client-img {
      .main-img {
        opacity: 0;
        visibility: hidden;
      }
      .hover-img {
        opacity: 1;
        visibility: visible;
        transform: scale(1.05);
      }
    }
    .btn {
      background-color: $goblin;
    }
  }
}

div.client-img {
  overflow: hidden;
  position: relative;
  img {
    display: block;
    max-width: 100%;
    width: 100%;
    height: auto;
    @include transition(all 0.3s ease-in-out);
  }
  .hover-img {
    opacity: 0;
    visibility: hidden;
    position: absolute;
    top: 0;
  }
}
</style>
