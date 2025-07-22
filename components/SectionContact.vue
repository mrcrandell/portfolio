<script setup>
// import { VueReCaptcha, useReCaptcha } from 'vue-recaptcha-v3';
// const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();
// import { load } from 'recaptcha-v3';
// const runtimeConfig = useRuntimeConfig();
const contactValidation = useContactValidation();
// const { vueApp } = useNuxtApp();
// import { VueReCaptcha, useReCaptcha } from 'vue-recaptcha-v3'
// const { vueApp } = useNuxtApp();
//const recaptchaInstance = useReCaptcha();
// const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();

/*vueApp.use(VueReCaptcha, {
  siteKey: runtimeConfig.public.invisibleRecaptchaSiteKey,
  loaderOptions: {
    autoHideBadge: true,
  },
}); */

// console.log(runtimeConfig.public.invisibleRecaptchaSiteKey)

const alert = ref({
  show: false,
  status: '',
  message: '',
});
const name = ref('');
const email = ref('');
const messageText = ref('');
// const recaptchaToken = ref('');
const token = ref(null);
const turnstileRef = ref(null);
// const submitText = ref('Submit');
const isLoading = ref(false);
const errorsRaw = ref([]);

const errors = computed(() => {
  const errors = {};
  errorsRaw.value.forEach(error => {
    const [field] = error.path;
    errors[field] = error.message;
  });
  return errors;
});
const submitText = computed(() => {
  return isLoading.value ? 'Sending...' : 'Send';
});
// const errors = ref({});

async function submitForm() {
  // recaptchaToken.value = await useVueRecaptcha();
  // await recaptchaInstance?.recaptchaLoaded();
  // const token = await recaptchaInstance?.executeRecaptcha('contact')
  errorsRaw.value = [];
  isLoading.value = true;
  /* const recaptcha = await load(runtimeConfig.public.invisibleRecaptchaSiteKey, {
    autoHideBadge: true
  })
  recaptchaToken.value = await recaptcha.execute('contact'); */

  const formData = {
    name: name.value,
    email: email.value,
    messageText: messageText.value,
    // recaptchaToken: recaptchaToken.value,
    token: token.value
  }

  const { error } = contactValidation.validate(formData, { abortEarly: false });
  // console.log(error?.details);
  if (error) {
    isLoading.value = false;
    alert.value = {
      show: true,
      status: 'danger',
      message: 'Please correct the errors in red on the form.',
    };
    errorsRaw.value = error.details;
    return;
  }
  // console.log(recaptchaToken.value);
  try {
    const data = await $fetch('/api/contact', {
      method: 'POST',
      body: formData,
    });
    // console.log(data);
    alert.value = {
      show: true,
      status: 'success',
      message: data.successMessage,
    };
    name.value = '';
    email.value = '';
    messageText.value = '';
    // recaptchaToken.value = '';
  } catch(error) {
    alert.value = {
      show: true,
      status: 'danger',
      message: 'Please correct the errors in red on the form.',
    };
    // console.log(error.data);
    errorsRaw.value = Array.isArray(error?.data) ? error?.data : [{ path: ['form'], message: error?.data?.message || 'Unknown error' }];
    // console.log(errors.value);
  } finally {
    isLoading.value = false;
    turnstileRef.value?.reset();
  }
}

/* onMounted(async () => {
  await recaptchaLoaded();
  console.log('o hi')
}); */
</script>

<template>
  <section
    id="contact"
    class="page"
  >
    <BaseBackground>
      <picture>
        <source
          type="image/webp"
          media="(max-width: 768px)"
          srcset="
            ~assets/img/section-contact/contact-wallpaper-sm.webp    1x,
            ~assets/img/section-contact/contact-wallpaper-sm@2x.webp 2x
          "
        >
        <source
          type="image/jpg"
          media="(max-width: 768px)"
          srcset="
            ~assets/img/section-contact/contact-wallpaper-sm.jpg    1x,
            ~assets/img/section-contact/contact-wallpaper-sm@2x.jpg 2x
          "
        >
        <source
          type="image/webp"
          media="(min-width: 768px)"
          srcset="
            ~assets/img/section-contact/contact-wallpaper.webp    1x,
            ~assets/img/section-contact/contact-wallpaper@2x.webp 2x
          "
        >
        <source
          type="image/jpg"
          media="(min-width: 768px)"
          srcset="
            ~assets/img/section-contact/contact-wallpaper.jpg    1x,
            ~assets/img/section-contact/contact-wallpaper@2x.jpg 2x
          "
        >
        <img
          loading="lazy"
          class="img-fluid"
          src="~assets/img/section-contact/contact-wallpaper.jpg"
          alt="Contact"
        >
      </picture>
    </BaseBackground>
    <div class="content">
      <header class="page-header">
        <h1>Contact</h1>
        <p>
          While I am not currently looking for new opportunities, I'd still love
          to hear from you. Whether you have a question or just want to say hi,
          use the form below and I'll get back with you.
        </p>
      </header>
      <div class="contact-grid">
        <form
          method="post"
          @submit.prevent="submitForm($event)"
        >
          <div
            v-if="alert.show"
            class="alert"
            role="alert"
            :class="'alert-' + alert.status"
          >
            {{ alert.message }}
          </div>
          <div class="form-group">
            <label for="contact-name">Name</label>
            <input
              id="contact-name"
              v-model="name"
              type="text"
              class="form-control"
              name="name"
              :class="{ 'is-invalid': errors.name }"
              placeholder="Name"
            >
            <div
              v-if="errors.name"
              class="invalid-feedback"
            >
              {{ errors.name }}
            </div>
          </div>
          <div class="form-group">
            <label for="contact-email">Email</label>
            <input
              id="contact-email"
              v-model="email"
              type="email"
              class="form-control"
              name="email"
              :class="{ 'is-invalid': errors.email }"
              placeholder="Email"
            >
            <div
              v-if="errors.email"
              class="invalid-feedback"
            >
              {{ errors.email }}
            </div>
          </div>
          <div class="form-group">
            <label for="message-text">Message</label>
            <textarea
              id="message-text"
              v-model="messageText"
              name="messageText"
              class="form-control"
              rows="6"
              :class="{ 'is-invalid': errors.messageText }"
              placeholder="Enter Message"
            />
            <div
              v-if="errors.messageText"
              class="invalid-feedback"
            >
              {{ errors.messageText }}
            </div>
          </div>
          <!-- <div class="form-group disclaimer">
            <small>This site is protected by reCAPTCHA and the Google
              <a href="https://policies.google.com/privacy">Privacy Policy</a>
              and
              <a href="https://policies.google.com/terms">Terms of Service</a>
              apply.
            </small>
          </div> -->
          <NuxtTurnstile
            ref="turnstileRef"
            v-model="token"
          />
          <div class="form-group form-group-submit">
            <button
              type="submit"
              class="btn btn-submit btn-primary"
              :disabled="isLoading"
            >
              <transition
                name="slide-fade"
                mode="out-in"
              >
                <span :key="submitText">{{ submitText }}</span>
              </transition>
            </button>
          </div>
        </form>
        <div class="contact-info">
          <p>Phone <a href="tel:+12483835376">248-383-5376</a></p>
          <p>
            Email
            <a href="mailto:me@mattcrandell.com">me@mattcrandell.com</a>
          </p>
          <h3>Matt Crandell's R&eacute;sum&eacute;</h3>
          <p>
            <a
              href="/resume.pdf"
              target="_blank"
              class="btn btn-primary"
              title="Download Matt Crandell's R&eacute;sum&eacute; as PDF"
            >Download My R&eacute;sum&eacute;</a>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
@use "sass:math";
section#contact {
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
  .disclaimer {
    line-height: 1.2;
  }
}
.contact-grid {
  display: grid;
  grid-gap: 2rem;
  @media (min-width: $grid-md) {
    grid-template-columns: 60% 1fr;
  }
}
.contact-info {
  padding-top: 29px;
  p {
    font-size: 1.25rem; // 20px
    margin-bottom: math.div($paragraph-margin-bottom, 2);
    @media (min-width: $grid-lg) {
      font-size: 1.5625rem; // 25px
    }
    a:not(.btn) {
      display: inline-block;
      padding: 0 0.5rem;
      color: #fff;
      font-weight: $font-weight-normal;
      &:hover {
        color: $link-hover-color;
      }
    }
  }
}
</style>
