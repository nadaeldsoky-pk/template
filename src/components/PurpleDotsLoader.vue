<template>
  <div class="loader-container">
    <div class="dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
</template>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
.dots {
  display: flex;
  gap: 8px;
}
.dot {
  width: 12px;
  height: 12px;
  background-color: #6e3894;
  border-radius: 50%;
  animation: bounce 0.6s infinite alternate;
}
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}
</style>
