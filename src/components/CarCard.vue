<template>
  <div class="car-card">
    <!-- Ссылка на страницу машины -->
    <router-link :to="{ name: 'CarDetails', params: { id: carId } }">
      <img :src="image" alt="Car image" class="car-image" />
      <h4>{{ model }}</h4>
    </router-link>
    <p><strong>Transmission:</strong> {{ transmission }}</p>
    <p><strong>Seats:</strong> {{ seats }}</p>
    <p><strong>Engine:</strong> {{ engine_capacity }}L ({{ engine_hp }} HP)</p>
    <p><strong>Deposit:</strong> {{ deposit }} р.</p>
    <p><strong>Rent period:</strong> {{ rent_period_days }} days</p>
    <p><strong>Total price:</strong> {{ rate_subtotal }} р.</p>
  </div>
</template>

<script>
export default {
  props: {
    carId: {
      type: Number,
      required: true
    },
    image: String,
    model: String,
    transmission: String,
    seats: Number,
    engine_capacity: Number,
    engine_hp: Number,
    deposit: Number,
    rent_period_days: Number,
    rate_subtotal: Number
  }
};
</script>

<style scoped>
.car-card {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 8px;
  text-align: center;
}
.car-image {
  width: 100%;
  height: auto;
  max-width: 300px;
}
</style>
