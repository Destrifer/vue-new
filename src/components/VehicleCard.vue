<template>
  <div>
    <h1>Страница машины с ID: {{ $route.params.id }}</h1>
    <!-- Здесь можно сделать запрос на сервер для получения данных по id -->
  </div>
</template>

<script>
export default {
  mounted() {
    console.log("ID машины:", this.$route.params.id);
    // Здесь можно сделать запрос на сервер для получения данных машины по ID
  }
};
</script>
