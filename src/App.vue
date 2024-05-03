<script setup lang="ts">
import NavBarComponent from '@/components/NavBarComponent.vue'
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import HelpComponent from '@/components/HelpComponent.vue'
import Sti from '@/assets/sti.png'

const route = useRoute()

// Check if the navbar should be shown and return the paths that should not have the navbar
const showNavBar = computed(() => {
    // Check if the route is the home page, login page, registration page, forgot password page or configuration page
    return !(
        route.path == '/' ||
        route.path == '/registrer' ||
        route.path.startsWith('/logginn') ||
        route.path == '/forgotPassword' ||
        route.path.startsWith('/konfigurasjon')
    )
})

// Background image for the sti component
const backgroundImageStyle = computed(() => {
    if (dontShowSti.value) {
        return {
            backgroundImage: 'none'
        }
    } else {
        return {
            backgroundImage: `url(${Sti})`
        }
    }
})

// Check if the sti component should be shown and return the paths that should have the sti component
const dontShowSti = computed(() => {
    return (
        route.path == '/' ||
        route.path == '/registrer' ||
        route.path == '/logginn' ||
        route.path == '/forgotPassword' ||
        route.path.startsWith('/konfigurasjon') ||
        route.path == '/hjem' ||
        route.path.startsWith('/loggin')
    )
})

// Check if the help component should be shown and return the paths that should not have the help component
const showHelp = computed(() => {
    return !(
        route.path == '/' ||
        route.path == '/registrer' ||
        route.path == '/logginn' ||
        route.path == '/forgotPassword' ||
        route.path.startsWith('/konfigurasjon')
    )
})

// Help messages for the help component
const helpMessages = computed(() => {
    // Check the path and return the help messages for the specific path
    let messages = []

    if (route.path == '/hjem') {
        messages.push('Heisann, jeg er Spare!')
        messages.push('Jeg skal hjelpe deg med å spare penger 💵')
        messages.push('Du kan legge til sparemål og spareutfordringer!')
        messages.push('Sammen kan vi spare penger og nå dine mål! 🚀')
    } else if (route.path == '/profil') {
        messages.push('Du har kommet til profilen din 🐷')
        messages.push('Her kan du se en oversikt over dine profilinstillinger ⚙️')
        messages.push('Du kan også se dine fullførte sparemål og utfordringer!')
        messages.push('Du kan redigere profilen din ved å trykke på "Rediger bruker" 💎')
    } else if (route.path == '/profil/rediger') {
        messages.push('️Her kan du se og redigere dine profil-instillinger 🪄')
        messages.push('For å lagre endringene dine, trykk på "Lagre endringer" i høyre hjørne')
        messages.push(
            'Husk at passordet ditt må være minst 8 tegn langt, og inneholde minst ett tall, en stor bokstav, en liten bokstav, og et spesialtegn'
        )
    } else if (route.path == '/sparemaal') {
        messages.push('Du har kommet til sparemålene dine 🎯')
        messages.push(
            'Et sparemål kan være noe du ønsker å spare penger til, for eksempel en ferie 🏖️ eller en ny sykkel 🚴🏻'
        )
        messages.push(
            'Du kan lage nye sparemål ved å trykke på knappen "Opprett et nytt sparemål".'
        )
        messages.push(
            'Du kan også endre rekkefølgen på sparemålene dine ved å trykke på "Endre rekkefølge".'
        )
        messages.push(
            'Når du har fullført et sparemål, vil det dukke opp under "Fullførte sparemål".'
        )
        messages.push('Lykke til med målene dine! 🎀')
    } else if (route.path == '/spareutfordringer') {
        messages.push('Du har kommet til spareutfordringene dine 💰')
        messages.push(
            'En spareutfordring er en måte å bli kvitt dårlige vaner, samtidig spare penger for å nå dine mål ✨'
        )
        messages.push('Du kan opprette en ny utfordring ved å trykke på "Opprett en ny utfordring"')
        messages.push(
            'Du kan også endre rekkefølgen på utfordringene dine ved å trykke på "Endre rekkefølge".'
        )
        messages.push(
            'Når du har fullført en utfordring, vil den dukke opp under "Fullførte utfordringer".'
        )
        messages.push('Lykke til med utfordringene dine 🏆')
    } else if (route.path.startsWith('/sparemaal/oversikt')) {
        messages.push('Her har du en oversikt over sparemålet ditt 🗽')
        messages.push('Du kan redigere målet, markere det som ferdig eller slette det')
        messages.push(
            'Du kan også se hvor mye du har spart av målet ditt, og hvor mye du har igjen'
        )
    } else if (route.path.startsWith('/spareutfordringer/oversikt')) {
        messages.push('Her har du en oversikt over spareutfordringen din 🏔️')
        messages.push('Du kan redigere utfordringen, markere det som ferdig eller slette det')
        messages.push(
            'Du kan også se hvor mye du har spart av utfordringen din, og hvor mye du har igjen'
        )
    } else if (route.path.startsWith('/sparemaal/rediger/ny')) {
        messages.push('Her kan du opprette et nytt sparemål 🌸')
        messages.push(
            'Tittel er navnet på sparemålet, og beskrivelse er en kort forklaring på hva sparemålet går ut på.'
        )
        messages.push(
            'Kroner spart er hvor mye du har spart til nå, og av målbeløp er hvor mye du ønsker å spare.'
        )
        messages.push('Forfallsdato er datoen du ønsker å ha nådd sparemålet ditt.')
        messages.push('Lykke til med sparingen! 🌴')
    } else if (route.path.startsWith('/spareutfordringer/ny')) {
        messages.push('Her kan du opprette en ny utfordring ☕️')
        messages.push(
            'Tittel er navnet på utfordringen, og beskrivelse er en kort forklaring på hva utfordringen går ut på.'
        )
        messages.push(
            'Pris per sparing er hvor mye du sparer hver gang du sparer, og antall sparinger er hvor mange ganger du har spart.'
        )
        messages.push(
            'Av målbeløp er hvor mye du har spart til nå, og forfallsdato er når utfordringen skal være fullført.'
        )
        messages.push('Du kan selvsagt endre på dette senere!')
        messages.push('Lykke til med utfordringen din! 🎉')
    } else {
        messages.push('Hei! Jeg er Spare 🐷')
        messages.push('Jeg er her for å hjelpe deg med sparingen din 💰')
        messages.push('Kom igang nå 🔥')
    }
    return messages
})
</script>

<template>
    <HelpComponent v-if="showHelp" :speech="helpMessages" />
    <div
        class="min-h-screen bg-left-bottom bg-phone md:bg-pc bg-no-repeat"
        :style="backgroundImageStyle"
    >
        <NavBarComponent v-if="showNavBar" />

        <main class="mb-10">
            <RouterView />
        </main>
    </div>
</template>

<style>
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
