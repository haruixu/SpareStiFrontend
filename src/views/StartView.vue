<template>
  <div class="background-container">
      <div class="overflow-hidden md:relative absolute max-md:-left-2/3 right-0 left-0">
          <img src="@/assets/start_page/sti.png" alt="Background" class="min-w-[1420px] h-auto overflow-hidden">
      </div>
      <div class="flex flex-col items-center pt-40 absolute top-0 left-0 right-0 z-10">
          <img src="@/assets/start_page/Spare.png" alt="Spare" class="md:w-1/6 w-1/3  h-auto" />
          <img src="@/assets/sparesti2.png" alt="Sparesti" class="md:w-5/12 w-10/12 h-auto md:mt-4 mt-20" />
          <p class="mt-2 lg:text-2xl text-lg font-bold">GJØR SPARING TIL EN LEK!</p>
      </div>

      <div class="flex flex-col items-end mr-3 justify-center space-y-4 z-20 absolute inset-0 -top-3/4 md:left-3/4 left-1/4 md:w-1/6 md:right-1/3 md:mt-44">
            <button
                class="md:py-3 md:px-0 md:w-3/4 py-2 px-12 w-1/2 border border-[#95E35D] shadow-lg rounded-lg transition-all duration-500 bg-[#95E35D] hover:bg-white text-sm md:text-base"
                @click="goToLogin"
            >
                Start her
            </button>
            <button
                class="md:py-3 md:px-0 md:w-3/4 py-2 px-12 w-1/2 border border-[#95E35D] shadow-lg rounded-lg transition-all duration-500 bg-white hover:bg-[#95E35D] text-sm md:text-base"
                @click="goToLogin"
            >
                Logg inn
            </button>
        </div>

        <div class="invisible md:visible absolute -bottom-80 right-0 mr-4 pr-10 w-1/4">
            <h2>Kom igang med målene dine! 🚀</h2>
            <p>Sett deg et sparemål og utfordre deg selv til å spare mer. 🎯</p>
        </div>

        <div class="invisible md:visible absolute -bottom-[1450px] right-0 mr-4 pr-10 w-1/4">
          <h2>Gi slipp på dårlige vaner! 🍻</h2>
          <p>Sett deg et spareutfordringer, bra for lommeboka og helsa! 🦾</p>
        </div>

        <div class="absolute md:-bottom-[600px] -bottom-[500px] md:left-10 left-10 md:ml-2 md:pl-10 md:w-1/3 w-5/6">
            <h2>Spar til din neste ferie! 🏖️☀️️</h2>
            <p> Ferie er viktig for å lade batteriene 🔋. Spar til din neste ferie og nyt livet!</p>
              <div class="absolute top-50 left-10 right-10 h-24 overflow-hidden bg-[url('@/assets/start_page/skyer.png')] bg-repeat-x bg-center animate-clouds">
              </div>
              <div class="absolute top-80 left-10 right-10 h-24 overflow-hidden bg-[url('@/assets/start_page/strand.png')] bg-repeat-x bg-center animate-beach">
              </div>
              <div class= "absolute -bottom-52 left-10 right-10 h-24 bg-[url('@/assets/start_page/fly.png')] bg-contain bg-no-repeat bg-center z-10">
              </div>
              <div class="flame1 absolute -bottom-36 md:left-60 left-44 h-2 w-8 rounded-lg bg-blue-100 animate-flame z-9">
              </div>
              <div class="flame2 absolute -bottom-48 md:left-[258px] left-48 h-2 w-10 rounded-lg bg-blue-100 animate-flame z-9">
        </div>

      </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
    router.push('/login')
}
</script>

