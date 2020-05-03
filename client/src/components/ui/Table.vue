<template lang="jade">
  .table
    table
      thead(v-if="cols.length")
        tr
          th(v-for="col in cols") {{col.label || col}}
      tbody
        tr(v-for="row in rows"
          @click="rowClick(row)"
          :class="[row.classes, {clickable: settings.clickable, hint: row.hint}]"
          :title="row.hint ? row.hint: ''")
          td(v-for="cell in row.cells")
            template(v-if="isArray(cell)")
              template(v-for="it in cell")
                router-link.link(v-if="it && it.route" :to="{name: it.route.name, params: it.route.params}") {{it.route.label}}
                span(v-else) {{it}}

            template(v-else)
              router-link.link(v-if="cell && cell.route" :to="{name: cell.route.name, params: cell.route.params}"
                @click.native.stop :target="cell.route.target ? cell.route.target: '_self'") {{cell.route.label}}
              span(v-else-if="cell && cell.html" v-html="cell.html")
              span(v-else-if="cell && cell.linkText")
                a.link(:href="cell.linkHref" @click.prevent="$emit('on-link-click', cell.emitData)") {{cell.linkText}}
              span(v-else) {{cell}}
</template>

<script>
  export default {
    name: 'table-block',

    props: {
      cols: {
        type: Array,
        default() {
          return [];
        }
      },
      rows: {
        type: Array,
        default() {
          return [];
        },
        required: true
      },
      settings: {
        type: Object,
        default() {
          return {
            clickable: true
          };
        }
      }
    },

    methods: {
      isArray(it) {
        return Array.isArray(it);
      },

      rowClick(row) {
        if (!this.settings.clickable) return;
        this.$emit('rowClick', row.data);
      }
    }
  };
</script>
