<template>
  <div>
    <h2>Информация о машине</h2>
    <img :src="car.image" alt="Car image" />
    <h3>{{ car.model }}</h3>
    <p><strong>Transmission:</strong> {{ car.transmission }}</p>
    <p><strong>Seats:</strong> {{ car.seats }}</p>
    <p><strong>Engine:</strong> {{ car.engine_capacity }}L ({{ car.engine_hp }} HP)</p>
    <p><strong>Deposit:</strong> {{ car.deposit }} р.</p>
    <p><strong>Rent period:</strong> {{ car.rent_period_days }} days</p>
    <p><strong>Total price:</strong> {{ car.rate_subtotal }} р.</p>

    <!-- Добавляем отображение данных формы -->
    <h4>Данные поиска:</h4>
    <p><strong>From Location ID:</strong> {{ car.fromId }}</p>
    <p><strong>From Date:</strong> {{ car.fromDate }}</p>
    <p><strong>To Date:</strong> {{ car.toDate }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      car: {}
    };
  },
  mounted() {
    this.car = this.$route.params; // Получаем данные из маршрута
  }
};
</script>
