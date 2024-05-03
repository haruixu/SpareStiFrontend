import {beforeEach,describe,expect,it,vi} from'vitest'
import {mount}from'@vue/test-utils'
import {createPinia,setActivePinia}from'pinia'
import SavingsPath from '@/components/SavingsPath.vue'

vi.mock('canvas-confetti',()=>({
  default:vi.fn(()=>({
    reset:vi.fn(),
    addFettis:vi.fn(),
    render:vi.fn(),
    clear:vi.fn()
  }))
}))
const mocks=vi.hoisted(()=>({
  get:vi.fn(),
  post:vi.fn()
}))

vi.mock('axios',async(importActual)=>{
  const actual=await importActual<typeof import('axios')>()

  return{
    default:{
      ...actual.default,
      create:vi.fn(()=>({
        ...actual.default.create(),
        get:mocks.get,
        post:mocks.post
      }))
    }
  }
})

describe('SavingsPathComponent',()=>{
  let wrapper:any
  const pinia=createPinia()

  beforeEach(()=>{

    setActivePinia(pinia);
    wrapper = mount(SavingsPath, {
      global: {
        plugins: [pinia]
      },
      props: {
        challenges: [
          {
            id: 1,
            title: 'Testchallenge',
            perPurchase: 20,
            saved: 100,
            target: 1000,
            description: 'Testdescription',
            due: '2022-01-01T00:00:00Z',
            createdOn: '2021-01-01T00:00:00Z',
            type: 'Challengetype',
            completion: 10
          }
        ],
        goal: {
          id: 1,
          title: 'Testgoal',
          saved: 100,
          target: 1000,
          description: 'Testdescription',
          due: '2022-01-01T00:00:00Z',
          createdOn: '2021-01-01T00:00:00Z',
          completion: 10
        }
      }
    });
    global.HTMLElement; // Mock HTMLElement globaly
    window.HTMLElement.prototype.scrollIntoView=function(){}
    console.log("Before each test: checking initial props");
    console.log(wrapper.props());
    console.log("After mounting: checking loaded props");
    console.log(wrapper.props());
  })

  describe('InitialRender',()=>{
    it('shouldrenderchallengeandgoaldetailscorrectly',async()=>{
      await wrapper.vm.$nextTick()
      const challengeText=wrapper.text()
      expect(challengeText).toContain('Testchallenge')
      expect(challengeText).toContain('Din Sparesti  Ufullførte utfordringer↓ ️ Testchallenge100kr / 1000kr  + +Legg til SpareutfordringTestgoalEndre mål100kr / 1000kr')
      expect(challengeText).toContain('Testgoal')
      expect(challengeText).toContain('Din Sparesti  Ufullførte utfordringer↓ ️ Testchallenge100kr / 1000kr  + +Legg til SpareutfordringTestgoalEndre mål100kr / 1000kr')
    })

    it('shoulddisplaythecorrectnumberofchallengeelements',()=>{
      const challengeElements=wrapper.findAll('[data-cy="challenge-title"]')
      expect(challengeElements.length).toBe(1)
    })
  })

  describe('UserInteractions',()=>{
    it('shouldupdatechallengeprogresswhenincrementbuttonisclicked',async()=>{
      await wrapper.vm.$nextTick()
      const incrementButton=wrapper.find('[data-cy="increment-challenge1"]')
      expect(incrementButton.exists()).toBe(true)
      await incrementButton.trigger('click')
      expect(wrapper.vm.challenges[0].saved).toBe(120)
    })
  })

  describe('StateManagement',()=>{
    it('shouldreacttochangesinchallengecompletionstatus',async()=>{
//Initiallyincomplete
      let progressBar=wrapper.find('.bg-green-600')
      expect(progressBar.element.style.width).toBe('10%')

//Updatechallengetobealmostcomplete
      await wrapper.setProps({
        challenges:[
          {
            ...wrapper.props().challenges[0],
            saved:900,
            completion:90
          }
        ]
      })
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      progressBar=wrapper.find('.bg-green-600')
      expect(progressBar.element.style.width).toBe('10%')
    })
  })
})