<template>
    <div>
        <h1>OpenID Configuration</h1>
        <pre>{{ JSON.stringify(authorizationEndpoint, null, 2) }}</pre>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const authorizationEndpoint = ref(null);

const fetchAuthorizationEndpoint = async () => {
    try {
        const response = await fetch('http://localhost:8080/auth/authorization-request', {
            method: 'GET',
        });
        const result = await response.json();
        console.log(result)
    } catch (error) {
        console.error('Error fetching games:', error);
    }
};

onMounted(() => {
    fetchAuthorizationEndpoint()
});
</script>
