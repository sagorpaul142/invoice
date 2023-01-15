<template>
  <template v-if="pageLoader">
    <div class="overlayed"/>
    <div class="loader"/>
  </template>
</template>

<script>
export default {
  name: "CustomPageLoader",
  props: {
    pageLoader: Boolean
  }
}
</script>

<style scoped>

.loader {
  border-radius: 50%;
  border: 3px solid #013a6d;
  border-left-color: transparent;
  width: 50px;
  position: fixed;
  left: calc(50% - 25px);
  top: calc(50% - 25px);
  height: 50px;
  -webkit-animation: spin .75s linear infinite; /* Safari */
  animation: spin .75s linear infinite;
  z-index: 1026;
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.overlayed {
  background-color: #EFEFEF;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1026;
  top: 0;
  left: 0;
  opacity: 0.8; /* in FireFox */
  filter: alpha(opacity=50); /* in IE */
}


</style>