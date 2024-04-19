<template>
  <div class="background-container">
      <div>
          <img src="@/assets/start_page/sti.png" alt="Background" class="w-full">

          <div class="flex flex-col items-center pt-40 absolute top-0 left-0 right-0 z-10">
              <img src="@/assets/start_page/Spare.png" alt="Spare" class="w-1/6 h-auto" />
              <img src="@/assets/SPARESTI.png" alt="SPARESTI" class="w-5/12 h-auto mt-2" />
              <p class="mt-2 text-2xl font-bold">GJØR SPARING TIL EN LEK!</p>
          </div>
          
          <div class="absolute top-1/4 lg:right-6 md:right-4 right-0 -translate-y-1/2 flex flex-col items-end space-y-6 lg:pr-28 md:pr-10 pr-2 z-20">
              <button
                  class="w-full py-3 px-16 border border-[#95E35D] shadow-lg rounded-lg transition-all duration-500 bg-[#95E35D] hover:bg-white text-sm lg:text-base"
                  @click=""
              >
                  Start her!
              </button>
              <button
                  class="w-full py-3 px-16 border border-[#95E35D] shadow-lg rounded-lg transition-all duration-500 bg-white hover:bg-[#95E35D] text-sm lg:text-base"
                  @click=""
              >
                  Logg inn
              </button>
          </div>
  
          <div class="absolute -bottom-80 right-0 mr-4 pr-10 w-50">
              <h3>Kom igang med målene dine! 🚀</h3>
              <p>Sett deg et sparemål og utfordre deg selv til å spare mer.</p>
          </div>

          <div class="ferie absolute -bottom-[600px] left-10 ml-2 w-50 pl-10">
              <h2>Spar til din neste ferie! 🏖️</h2>
              <p> Ferie er viktig for å lade batteriene. Spar til din neste ferie og nyt livet!</p>
                <div class="absolute top-50 left-10 right-10 h-24 overflow-hidden bg-[url('@/assets/start_page/skyer.png')] bg-repeat-x bg-center animate-clouds">
                </div>
                <div class="absolute top-80 left-10 right-10 h-24 overflow-hidden bg-[url('@/assets/start_page/strand.png')] bg-repeat-x bg-center animate-beach">
                </div>
                <div class= "absolute -bottom-52 left-10 right-10 h-24 bg-[url('@/assets/start_page/fly.png')] bg-contain bg-no-repeat bg-center z-10">
                </div>
                <div class="flame1 absolute -bottom-36 left-64 h-2 w-8 rounded-lg bg-blue-100 animate-flame z-9">
                </div>
                <div class="flame2 absolute -bottom-48 left-[267px] h-2 w-10 rounded-lg bg-blue-100 animate-flame z-9">
          </div>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
</script>

