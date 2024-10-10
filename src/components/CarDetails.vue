<template>
  <div>
    <h2>Car Details for ID: {{ carId }}</h2>
    <!-- Здесь будет выводиться информация о машине -->
    <div v-if="car">
      <img :src="car.images[0].image" alt="Car Image" />
      <p>Model: {{ car.model }}</p>
      <p>Transmission: {{ car.transmission }}</p>
      <p>Seats: {{ car.seats }}</p>
      <!-- Другие параметры машины -->
    </div>
    <p v-else>Loading car details...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['carId'],
  data() {
    return {
      car: null // Данные о машине
    };
  },
  async created() {
    try {
      const response = await axios.get(`https://new.mycarrental.ru/api/v2/car/${this.carId}`);
      this.car = response.data;
    } catch (error) {
      console.error('Error fetching car details:', error);
    }
  }
};
</script>
