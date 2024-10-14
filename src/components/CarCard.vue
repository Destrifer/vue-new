<template>
  <div class="car-card">
    <router-link
      :to="{
        name: 'CarDetails',
        params: {
          id: carId,
          image: image,
          model: model,
          transmission: transmission,
          seats: seats,
          engine_capacity: engine_capacity,
          engine_hp: engine_hp,
          deposit: deposit,
          rent_period_days: rent_period_days,
          rate_subtotal: rate_subtotal,
          fromId: formFromId,
          fromDate: formFromDate,
          toDate: formToDate
        }
      }"
    >
      <img :src="image" alt="Car image" class="car-image" />
      <h4>{{ model }}</h4>
    </router-link>
    <!-- Остальная информация по машине -->
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
    rate_subtotal: Number,
    formFromId: Number,        // Передаем данные формы
    formFromDate: String,
    formToDate: String
  }
};
</script>

<style scoped>
.car-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px 0;
}
.car-image {
  width: 100%;
  height: auto;
}
</style>
