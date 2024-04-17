<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
    </nav>

    <main>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>

        <p>Paragraph</p>

        <button>Button</button>
        <br>
        <a href="#">Link</a>
        <div>Div</div>
        <section>Section</section>
        <article>Article</article>

        <RouterView />
    </main>
</template>

<style scoped>
nav {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 1rem 0;
}

nav a.router-link-exact-active {
    color: var(--color-text);
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}
</style>
