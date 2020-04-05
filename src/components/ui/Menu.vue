<template>
  <ul class="tooltip-menu"
      :class="[classes, {visible}]"
      v-click-outside="hide">
    <li v-for="item in list" :key="item.id" :class="item.class">
      <div class="item-content"
           :data-test-id="item.id"
           @click.stop="handler(item, element)">
        <div class="label">{{ item.label }}</div>
        <div v-if="item.subLabel" class="sub-label">{{item.subLabel}}</div>
      </div>
    </li>
  </ul>
</template>

<script>
  import ClickOutside from 'vue-click-outside';

  export default {
    name: 'vue-menu',

    model: {
      prop: 'visible',
      event: 'change'
    },

    props: {
      list: {
        type: Array,
        required: true
      },
      element: {
        default: null
      },
      handler: {
        type: Function,
        required: true
      },
      visible: Boolean,
      classes: String
    },

    methods: {
      hide() {
        this.$emit('change', false);
      }
    },

    directives: {
      ClickOutside
    }
  };
</script>
