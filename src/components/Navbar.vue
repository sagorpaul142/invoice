<template>
  <v-app-bar
      color="deep-purple accent-4"
      dense
      dark
  >
    <v-app-bar-nav-icon></v-app-bar-nav-icon>

    <router-link to="/" class="logo">
      <v-toolbar-title>Invoice</v-toolbar-title>
    </router-link>
  </v-app-bar>
</template>

<script>
export default {
  name: "NavbarComponent"
}
</script>

<style scoped>
.logo {
  color: #ffffff;
  text-decoration: none;
}

</style>