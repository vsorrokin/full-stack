<template lang="jade">
  .navbar
    .left-part
      h4: router-link(:to="{name: 'home'}") Rrobad travel
    .right-part
      ul.social-links
        li: a(href="https://www.instagram.com/rrobad/" target="_blank"): i.icon-instagram
        li: a(href="http://rrobad.com/telegram"): i.icon-telegram
</template>

<script>
export default {
  name: 'Navbar',

}
</script>
