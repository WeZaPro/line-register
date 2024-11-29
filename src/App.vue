<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup></script>

<style>
nav {
  margin-bottom: 20px;
}
router-link {
  margin-right: 10px;
}
</style>
