<template>
  <div>
    <h2>Информация о машине</h2>
    <img :src="car.image" alt="Car image" />
    <p><strong>Модель:</strong> {{ car.model }}</p>
    <p><strong>Трансмиссия:</strong> {{ car.transmission }}</p>
    <p><strong>Места:</strong> {{ car.seats }}</p>
    <p><strong>Объем двигателя:</strong> {{ car.engine_capacity }}L</p>
    <p><strong>Мощность двигателя:</strong> {{ car.engine_hp }} HP</p>
    <p><strong>Депозит:</strong> {{ car.deposit }} р.</p>
    <p><strong>Срок аренды:</strong> {{ car.rent_period_days }} дней</p>
    <p><strong>Общая стоимость:</strong> {{ car.rate_subtotal }} р.</p>
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
  },
  data() {
    return {
      car: {
        id: this.carId,
        image: this.image,
        model: this.model,
        transmission: this.transmission,
        seats: this.seats,
        engine_capacity: this.engine_capacity,
        engine_hp: this.engine_hp,
        deposit: this.deposit,
        rent_period_days: this.rent_period_days,
        rate_subtotal: this.rate_subtotal
      }
    };
  }
};
</script>
