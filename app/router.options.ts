export default {
  scrollBehavior(to: any) {
    if (to.hash) {
      return new Promise((resolve) => {
        // Wait for the DOM to update
        setTimeout(() => {
          resolve({
            el: to.hash,
            behavior: "smooth",
          });
        }, 300); // Adjust delay if needed
      });
    }
    return { top: 0 };
  },
};
