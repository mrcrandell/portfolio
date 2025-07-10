<template>
  <section
    id="about"
    class="page"
  >
    <BaseBackground>
      <picture>
        <source
          type="image/webp"
          media="(max-width: 767px)"
          srcset="
            ~assets/img/section-about/about-wallpaper-sm.webp    1x,
            ~assets/img/section-about/about-wallpaper-sm@2x.webp 2x
          "
        >
        <source
          type="image/jpg"
          media="(max-width: 767px)"
          srcset="
            ~assets/img/section-about/about-wallpaper-sm.jpg    1x,
            ~assets/img/section-about/about-wallpaper-sm@2x.jpg 2x
          "
        >
        <source
          type="image/webp"
          media="(min-width: 768px)"
          srcset="
            ~assets/img/section-about/about-wallpaper.webp    1x,
            ~assets/img/section-about/about-wallpaper@2x.webp 2x
          "
        >
        <source
          type="image/jpg"
          media="(min-width: 768px)"
          srcset="
            ~assets/img/section-about/about-wallpaper.jpg    1x,
            ~assets/img/section-about/about-wallpaper@2x.jpg 2x
          "
        >
        <img
          loading="lazy"
          class="img-fluid"
          src="~assets/img/section-about/about-wallpaper.jpg"
          alt="Contact"
        >
      </picture>
    </BaseBackground>
    <div class="content">
      <div>
        <picture>
          <source
            type="image/webp"
            srcset="
              ~assets/img/matt-crandell.webp    1x,
              ~assets/img/matt-crandell@2x.webp 2x
            "
          >
          <source
            type="image/jpg"
            srcset="
              ~assets/img/matt-crandell.jpg    1x,
              ~assets/img/matt-crandell@2x.jpg 2x
            "
            width="500"
            height="332"
          >
          <img
            src="~assets/img/matt-crandell.jpg"
            alt="Matt Crandell"
            width="500"
            height="332"
          >
        </picture>
      </div>
      <div>
        <header class="page-header">
          <h1>Hi, I'm Matt Crandell</h1>
        </header>
        <p>
          Ever since I launched my first website in 2001, I have had a great
          passion for web development. Currently, I am a full-time employee for
          a marketing company where I handle various projects to satisfy their
          web and app development needs. Always a tinkerer, I enjoy playing with
          various side projects and freelance work. I hold degrees in Graphic
          Design and Computer Information Systems from Ferris State University.
        </p>
      </div>
      <div>
        <picture>
          <source
            type="image/webp"
            srcset="~assets/img/charli-2023.webp 1x, ~assets/img/charli-2023@2x.webp 2x"
          >
          <source
            type="image/jpg"
            srcset="~assets/img/charli-2023.jpg 1x, ~assets/img/charli-2023@2x.jpg 2x"
          >
          <img
            src="~assets/img/charli-2023.jpg"
            alt="Charli"
            width="500"
            height="332"
          >
        </picture>
      </div>
      <div>
        <h2>Hi, I'm Charli</h2>
        <p>What I lack in coding knowledge, I make up in cuteness.</p>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
section#about {
  background: $rhino no-repeat center center fixed;
  color: #fff;
  position: relative;
  .content {
    position: relative;
    z-index: 9;
  }
  h1,
  h2 {
    color: #fff;
  }
  .page-header {
    border-color: #fff;
  }
  .featured-img:not(.post-card-featured-img) {
    &:before,
    &:after {
      opacity: 0.6;
    }
    img {
      min-width: 0;
      filter: blur(4px);
      -webkit-filter: blur(4px);
    }
  }
}
.content {
  display: grid;
  grid-gap: 2rem;
  @media (min-width: $grid-lg) {
    grid-template-columns: 40% 1fr;
    align-items: center;
    max-width: $max-width;
  }
}
img {
  display: block;
  width: 100%;
  max-width: 500px;
  height: auto;
  margin: 0 auto;
  box-shadow: $box-shadow-2;
  border: 2px solid $sanmarino;
}
</style>
