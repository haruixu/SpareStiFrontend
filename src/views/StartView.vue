<template>
  <div class="background-container">
      <div>
          <img src="@/assets/start_page/sti.png" alt="Background" class="w-full">

          <div class="flex flex-col items-center pt-32">
              <img src="@/assets/start_page/Spare.png" alt="Spare" class="w-1/6 h-auto" />
              <img src="@/assets/SPARESTI.png" alt="SPARESTI" class="w-5/12 h-auto mt-2" />
              <p class="mt-2 text-2xl font-bold">GJØR SPARING TIL EN LEK!</p>
          </div>
          
          <div class="absolute top-1/4 lg:right-20 md:right-5 right-0 -translate-y-1/2 flex flex-col items-end space-y-6 lg:pr-28 md:pr-10 pr-2">
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

          <div class="absolute bottom-0 left-0 ml-2 w-60 pl-10">
              <h2>Kom igang med målene dine! 🚀</h2>
              <p>Sett deg et sparemål og utfordre deg selv til å spare mer.</p>
          </div>
          
          <div class="absolute bottom-0 right-0 mr-4 pr-10">
              <h2>Sparetips 💡 Visste du at...</h2>
              <p>...du kan spare penger på å lage matpakke til jobb?</p>
              <p>...du kan spare penger på å bruke kollektivtransport?</p>
              <p>...du kan spare penger på å kjøpe brukt?</p>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
</script>
