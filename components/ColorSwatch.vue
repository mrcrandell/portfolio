<script setup>
const props = defineProps({
  colorSwatch: {
    type: Object,
    default() {
      return {}
    },
  },
});

const style = computed(() => {
  const style = `
    color: ${getContrast(props.colorSwatch.hex)};
    background-color: ${props.colorSwatch.hex};
  `;
  return style;
});

function getContrast(hexcolor) {
  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === '#') {
    hexcolor = hexcolor.slice(1)
  }

  // If a three-character hexcode, make six-character
  if (hexcolor.length === 3) {
    hexcolor = hexcolor
      .split('')
      .map(function (hex) {
        return hex + hex
      })
      .join('')
  }

  // Convert to RGB value
  const r = parseInt(hexcolor.substr(0, 2), 16)
  const g = parseInt(hexcolor.substr(2, 2), 16)
  const b = parseInt(hexcolor.substr(4, 2), 16)

  // Get YIQ ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  // Check contrast
  return yiq >= 128 ? 'black' : 'white'
}
</script>
<template>
  <div
    class="color-swatch"
    :style="style"
  >
    {{ colorSwatch.name }}<br>
    {{ colorSwatch.hex }}
  </div>
</template>
<style lang="scss" scoped>
@use "sass:list";
.color-swatch {
  min-height: 100px;
  box-shadow: $box-shadow-3;
  font-size: 1rem;
  padding: 15px;
  // margin-bottom: 15px;
  border: 5px solid #fff;
  color: #fff;
  background-color: #eee;
  @each $color, $value in $colors {
    $i: list.index(($colors), ($color $value));
    &.swatch#{$i} {
      color: color-yiq($value);
      background-color: $value;
    }
  }
}
</style>
