<template>
  <div>
    <h1>{{ message }}</h1>
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      message: 'Hello, Vue!',
      items: [],
    };
  },
  mounted() {
    axios.get('/.netlify/functions/api/items')
    .then(response => {
      this.items = response.data;
    })
    .catch(error => {
      console.error(error);
    });
  },
};
</script>