<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { publicAPI, type Article, type Report } from '@/api/client'

// Import logo and background images
import logo from '@/assets/images/logo.png'
import heroBg1 from '@/assets/images/hero1.jpg'
import heroBg2 from '@/assets/images/hero2.jpg'
import heroBg3 from '@/assets/images/hero3.jpg'
import heroBg4 from '@/assets/images/hero4.jpg'
import heroBg5 from '@/assets/images/hero5.jpg'

// What We Do images
import ventingImg from '@/assets/images/venting.jpg'
import friendshipImg from '@/assets/images/friendship.jpg'
import youthImg from '@/assets/images/youth.jpg'
import maternalImg from '@/assets/images/maternal.jpg'
import skillsImg from '@/assets/images/skills.jpg'
import advocacyImg from '@/assets/images/advocacy.jpg'

const router = useRouter()
const articles = ref<Article[]>([])
const reports = ref<Report[]>([])
const articlesLoading = ref(true)
const reportsLoading = ref(true)
const currentSlide = ref(0)
const mobileMenuOpen = ref(false)

// Social Links
const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/sorry-i-m-not-sorry/",
  facebook: "https://web.facebook.com/profile.php?id=61584142525363",
  whatsapp: "https://wa.me/265998896206"
}

// Hero slides
const heroSlides = [heroBg1, heroBg2, heroBg3, heroBg4, heroBg5]

// Contact form
const contactForm = ref({ name: '', email: '', message: '' })
const contactSubmitting = ref(false)

// Chat
const chatOpen = ref(false)
const chatMessages = ref<{ type: string; text: string }[]>([])
const chatInput = ref('')
const isTyping = ref(false)

const truncate = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) element.scrollIntoView({ behavior: 'smooth' })
  mobileMenuOpen.value = false
}

const downloadReport = async (id: number, url: string) => {
  try {
    await publicAPI.downloadReport(id)
    window.open(url, '_blank')
  } catch (error) {
    alert('Download failed. Please try again.')
  }
}

const submitContact = async () => {
  if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) {
    alert('Please fill in all fields')
    return
  }
  
  contactSubmitting.value = true
  try {
    await publicAPI.submitContact(contactForm.value)
    alert('Message sent successfully!')
    contactForm.value = { name: '', email: '', message: '' }
  } catch (error) {
    alert('Failed to send message. Please try again.')
  } finally {
    contactSubmitting.value = false
  }
}

const sendChatMessage = async () => {
  if (!chatInput.value.trim()) return
  
  const userMessage = chatInput.value.trim()
  chatMessages.value.push({ type: 'user', text: userMessage })
  chatInput.value = ''
  isTyping.value = true
  
  try {
    await publicAPI.saveVentingMessage({ message: userMessage })
  } catch (e) {
    console.log('Failed to save message')
  }
  
  setTimeout(() => {
    let response = "Thank you for sharing. I hear you. Would you like to:\n\n1. Talk to a counselor\n2. Get mental health resources\n3. Speak to a human\n\nType the number of your choice."
    
    const lowerMsg = userMessage.toLowerCase()
    if (lowerMsg.includes('1') || lowerMsg.includes('counselor')) {
      response = "I'll connect you with a trained counselor. Please share your name and preferred time for a call."
    } else if (lowerMsg.includes('2') || lowerMsg.includes('resource')) {
      response = "Here are some resources:\n\n• Breathing exercises\n• Grounding techniques\n• Self-care tips\n\nYou can also call our helpline: +265 998 896 206"
    } else if (lowerMsg.includes('3') || lowerMsg.includes('human')) {
      response = "A human advocate will respond shortly. Please leave your phone number."
    } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      response = "Hello! Welcome to the Venting Room. How are you feeling today?"
    }
    
    chatMessages.value.push({ type: 'bot', text: response })
    isTyping.value = false
  }, 1000)
}

const handleChatKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter') sendChatMessage()
}

// Auto-slide
let slideInterval: ReturnType<typeof setInterval>
onMounted(async () => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % heroSlides.length
  }, 5000)
  
  try {
    const res = await publicAPI.getArticles(0, 3)
    articles.value = res.data
  } catch (error) {
    console.error('Failed to load articles')
  } finally {
    articlesLoading.value = false
  }
  
  try {
    const res = await publicAPI.getReports()
    reports.value = res.data
  } catch (error) {
    console.error('Failed to load reports')
  } finally {
    reportsLoading.value = false
  }
  
  chatMessages.value.push({ type: 'bot', text: "Welcome to the Venting Room. I'm here to listen and support you. How are you feeling today?" })
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})
</script>

<template>
  <div>
    <!-- Navigation -->
    <nav style="position: fixed; top: 0; left: 0; right: 0; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 1000;">
      <div style="max-width: 1200px; margin: 0 auto; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center;">
        <!-- Logo with Text - Far Left -->
        <div style="display: flex; align-items: center; gap: 12px; cursor: pointer;" @click="scrollTo('home')">
          <img :src="logo" alt="Logo" style="height: 45px; width: auto;" />
          <div>
            <h1 style="font-size: 16px; font-weight: 700; margin: 0; color: #1e3a8a;">Sorry I'm Not Sorry</h1>
            <p style="font-size: 10px; color: #666; margin: 0;">We Are All Sick</p>
          </div>
        </div>
        
        <!-- Center Menu -->
        <div class="desktop-menu" style="display: flex; gap: 30px; align-items: center;">
          <a @click="scrollTo('home')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; font-size: 14px;">Home</a>
          <a @click="scrollTo('about')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; font-size: 14px;">About</a>
          <a @click="scrollTo('whatwedo')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; font-size: 14px;">What We Do</a>
          <a @click="scrollTo('articles')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; font-size: 14px;">Articles</a>
          <a @click="scrollTo('reports')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; font-size: 14px;">Reports</a>
          <a @click="scrollTo('getinvolved')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; font-size: 14px;">Get Involved</a>
          <a @click="scrollTo('contact')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; font-size: 14px;">Contact</a>
        </div>
        
        <!-- Download Reports Button - Far Right -->
        <button @click="$router.push('/reports')" class="desktop-download-btn" style="background: #2563eb; color: white; border: none; padding: 8px 20px; border-radius: 25px; font-weight: 600; font-size: 13px; cursor: pointer;">Download Reports</button>
        
        <!-- Mobile Menu Button -->
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="mobile-menu-btn" style="display: none; background: none; border: none; cursor: pointer; padding: 8px;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" style="position: fixed; top: 69px; left: 0; right: 0; background: white; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); display: flex; flex-direction: column; gap: 15px; z-index: 999;">
        <a @click="scrollTo('home')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; padding: 8px 0;">Home</a>
        <a @click="scrollTo('about')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; padding: 8px 0;">About</a>
        <a @click="scrollTo('whatwedo')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; padding: 8px 0;">What We Do</a>
        <a @click="scrollTo('articles')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; padding: 8px 0;">Articles</a>
        <a @click="scrollTo('reports')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; padding: 8px 0;">Reports</a>
        <a @click="scrollTo('getinvolved')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; padding: 8px 0;">Get Involved</a>
        <a @click="scrollTo('contact')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; padding: 8px 0;">Contact</a>
        <button @click="$router.push('/reports')" style="background: #2563eb; color: white; border: none; padding: 10px; border-radius: 25px; font-weight: 600;">Download Reports</button>
      </div>
    </nav>

    <!-- Hero Section with Slider -->
    <section id="home" style="position: relative; height: 100vh; overflow: hidden; margin-top: 0;">
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; transition: transform 0.8s ease-in-out; transform: translateX(-{{ currentSlide * 100 }}%);">
        <div v-for="(slide, index) in heroSlides" :key="index" :style="{ flex: '0 0 100%', height: '100%', backgroundImage: `url(${slide})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }">
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5);"></div>
        </div>
      </div>
      
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; text-align: center; color: white; z-index: 2; padding: 20px;">
        <div style="max-width: 800px; padding: 20px;">
          <h1 style="font-size: clamp(28px, 8vw, 48px); font-weight: 700; margin-bottom: 16px;">Mainstreaming Mental Health as a Development Priority in Malawi</h1>
          <p style="font-size: clamp(14px, 4vw, 20px); margin-bottom: 24px; opacity: 0.9;">Together, we can turn silence into solidarity and make mental health everyone's business.</p>
          <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;">
            <button @click="scrollTo('articles')" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 50px; font-size: clamp(12px, 4vw, 16px); font-weight: 600; cursor: pointer;">Read Articles</button>
            <button @click="$router.push('/reports')" style="background: transparent; border: 2px solid white; color: white; padding: 10px 20px; border-radius: 50px; font-size: clamp(12px, 4vw, 16px); font-weight: 600; cursor: pointer;">Download Reports</button>
            <button @click="chatOpen = true" style="background: #f59e0b; border: none; color: white; padding: 10px 20px; border-radius: 50px; font-size: clamp(12px, 4vw, 16px); font-weight: 600; cursor: pointer;">Get Help</button>
          </div>
        </div>
      </div>
      
      <!-- Slide indicators -->
      <div style="position: absolute; bottom: 20px; left: 0; right: 0; display: flex; justify-content: center; gap: 8px; z-index: 2;">
        <button v-for="(_, index) in heroSlides" :key="index" @click="currentSlide = index" :style="{ width: '8px', height: '8px', borderRadius: '50%', border: 'none', backgroundColor: currentSlide === index ? '#2563eb' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s' }"></button>
      </div>
    </section>

    <!-- About Us Section -->
    <section id="about" style="padding: 80px 20px; background: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: clamp(32px, 6vw, 42px); font-weight: 700; margin-bottom: 20px; color: #1e3a8a;">About Us</h2>
        <div style="max-width: 900px; margin: 0 auto; text-align: center;">
          <p style="font-size: 18px; color: #4b5563; line-height: 1.8; margin-bottom: 30px;">
            <strong>Sorry I'm Not Sorry: We Are All Sick</strong> is a Malawian mental health organisation dedicated to mainstreaming mental health as a development issue across education, health, livelihoods, gender, and governance.
          </p>
          <p style="font-size: 16px; color: #6b7280; line-height: 1.8;">
            Founded in 2023 by <strong>Joseph Daniel Sukali</strong>, the organisation brings together more than 150 trained advocates across 15 districts, working tirelessly to break the silence surrounding mental health in Malawi.
          </p>
        </div>
      </div>
    </section>

    <!-- What We Do Section - Restyled -->
    <section id="whatwedo" style="padding: 80px 20px; background: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: clamp(32px, 6vw, 42px); font-weight: 700; margin-bottom: 20px; color: #1e3a8a;">What We Do</h2>
        <p style="text-align: center; color: #666; margin-bottom: 60px; font-size: 18px; max-width: 700px; margin-left: auto; margin-right: auto;">Our programs and initiatives across Malawi</p>
        
        <!-- Venting Rooms -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; margin-bottom: 80px;">
          <div>
            <img :src="ventingImg" alt="Venting Rooms" style="width: 100%; border-radius: 20px; box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1);" />
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div style="width: 50px; height: 50px; background: #e0e7ff; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M8 10h.01M12 10h.01M16 10h.01" stroke-width="2" />
                </svg>
              </div>
              <h3 style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin: 0;">Venting Rooms & Helplines</h3>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">Safe, confidential spaces where individuals can share their struggles without fear of judgment. Our trained peer supporters listen with empathy and provide immediate emotional support.</p>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.7;">Available 24/7 across multiple districts, our venting rooms have become a lifeline for hundreds of Malawians seeking someone to talk to during difficult moments.</p>
          </div>
        </div>
        
        <!-- Friendship Benches -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; margin-bottom: 80px;">
          <div style="order: 2;">
            <img :src="friendshipImg" alt="Friendship Benches" style="width: 100%; border-radius: 20px; box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1);" />
          </div>
          <div style="order: 1;">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div style="width: 50px; height: 50px; background: #e0e7ff; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                  <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z" />
                  <path d="M12 6v6l4 2" />
                  <path d="M16 21.5a4 4 0 0 0-4-4h-2a4 4 0 0 0-4 4" />
                  <path d="M9 9a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />
                </svg>
              </div>
              <h3 style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin: 0;">Friendship Benches</h3>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">Community-based psychosocial counselling delivered by trained grandmothers and community health workers in accessible public spaces.</p>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.7;">Based on the proven Friendship Bench model, we've established benches in 15 districts where anyone can sit, talk, and receive culturally appropriate mental health support.</p>
          </div>
        </div>
        
        <!-- Youth & School Clubs -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; margin-bottom: 80px;">
          <div>
            <img :src="youthImg" alt="Youth & School Clubs" style="width: 100%; border-radius: 20px; box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1);" />
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div style="width: 50px; height: 50px; background: #e0e7ff; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                  <path d="M22 10v6M2 10v6" />
                  <path d="M12 17v5M8 21h8" />
                  <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                  <path d="M5 3.2A9 9 0 0 1 19 3.2" />
                </svg>
              </div>
              <h3 style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin: 0;">Youth & School Clubs</h3>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">Building mental health literacy in primary and secondary schools through peer-support clubs, teacher training, and awareness campaigns.</p>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.7;">We've established 45+ school clubs reaching over 10,000 students with mental health education, coping skills, and referral pathways.</p>
          </div>
        </div>
        
        <!-- Maternal Circles -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; margin-bottom: 80px;">
          <div style="order: 2;">
            <img :src="maternalImg" alt="Maternal Circles" style="width: 100%; border-radius: 20px; box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1);" />
          </div>
          <div style="order: 1;">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div style="width: 50px; height: 50px; background: #e0e7ff; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                  <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" />
                  <circle cx="12" cy="9" r="3" />
                </svg>
              </div>
              <h3 style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin: 0;">Maternal Mental Health Circles</h3>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">Empowering adolescent mothers and survivors of gender-based violence through specialized support groups and mental health services.</p>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.7;">Our maternal circles provide a safe sisterhood where young mothers receive counselling, parenting support, and referrals to essential services.</p>
          </div>
        </div>
        
        <!-- Skills for Wellness -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; margin-bottom: 80px;">
          <div>
            <img :src="skillsImg" alt="Skills for Wellness" style="width: 100%; border-radius: 20px; box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1);" />
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div style="width: 50px; height: 50px; background: #e0e7ff; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin: 0;">Skills for Wellness</h3>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">Linking mental health recovery to livelihoods through vocational training, entrepreneurship support, and economic empowerment initiatives.</p>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.7;">We've trained over 500 youth and women in income-generating activities, providing start-up kits and ongoing mentorship for sustainable recovery.</p>
          </div>
        </div>
        
        <!-- Advocacy Hub -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center;">
          <div style="order: 2;">
            <img :src="advocacyImg" alt="Advocacy Hub" style="width: 100%; border-radius: 20px; box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1);" />
          </div>
          <div style="order: 1;">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div style="width: 50px; height: 50px; background: #e0e7ff; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin: 0;">Advocacy & Policy Hub</h3>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">Influencing policy, national mental health financing, and systemic change through evidence-based advocacy and stakeholder engagement.</p>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.7;">We've contributed to the Mental Health Act (2025), trained 150+ advocates, and continue pushing for increased government investment in mental health services.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Articles Section - Redesigned -->
    <section id="articles" style="padding: 80px 20px; background: #f0f9ff;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 50px;">
          <h2 style="font-size: clamp(32px, 6vw, 42px); font-weight: 700; margin-bottom: 15px; color: #1e3a8a;">Latest Articles</h2>
          <p style="color: #666; font-size: 18px;">Insights, stories, and information about mental health in Malawi</p>
        </div>
        
        <div v-if="articlesLoading" style="text-align: center; padding: 60px;">Loading articles...</div>
        <div v-else-if="articles.length === 0" style="text-align: center; padding: 60px;">No articles yet.</div>
        <div v-else style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px;">
          <div v-for="article in articles" :key="article.id" @click="router.push(`/articles/${article.id}`)" style="border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; background: white;">
            <div v-if="article.image_url" :style="{ height: '220px', backgroundImage: `url(${article.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }"></div>
            <div v-else style="height: 220px; background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%); display: flex; align-items: center; justify-content: center;">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div style="padding: 24px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span style="background: #e0e7ff; color: #1e3a8a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">Article</span>
                <span style="color: #999; font-size: 12px;">{{ new Date(article.created_at).toLocaleDateString() }}</span>
              </div>
              <h3 style="font-size: 20px; margin-bottom: 12px; color: #1e3a8a; line-height: 1.4;">{{ article.title }}</h3>
              <p style="color: #666; margin-bottom: 16px; line-height: 1.6;">{{ truncate(article.subtitle || article.content, 100) }}</p>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                <span style="color: #999; font-size: 13px;">By {{ article.author }}</span>
                <span style="color: #2563eb; font-weight: 600; display: flex; align-items: center; gap: 5px;">Read More <span>→</span></span>
              </div>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 50px;">
          <button @click="router.push('/articles')" style="background: #2563eb; color: white; border: none; padding: 12px 32px; border-radius: 40px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.3s;">View All Articles</button>
        </div>
      </div>
    </section>

    <!-- Reports Section - Redesigned -->
    <section id="reports" style="padding: 80px 20px; background: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 50px;">
          <h2 style="font-size: clamp(32px, 6vw, 42px); font-weight: 700; margin-bottom: 15px; color: #1e3a8a;">Download Reports</h2>
          <p style="color: #666; font-size: 18px;">Access our latest research, annual reports, and publications</p>
        </div>
        
        <div v-if="reportsLoading" style="text-align: center; padding: 60px;">Loading reports...</div>
        <div v-else-if="reports.length === 0" style="text-align: center; padding: 60px;">No reports available.</div>
        <div v-else style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px;">
          <div v-for="report in reports.slice(0, 3)" :key="report.id" style="background: #f0f9ff; border-radius: 16px; padding: 30px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.08); transition: transform 0.3s;">
            <div style="width: 70px; height: 70px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 style="font-size: 22px; margin-bottom: 12px; color: #1e3a8a;">{{ report.title }}</h3>
            <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">{{ report.description || 'Download our latest report on mental health initiatives in Malawi' }}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding: 10px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
              <span style="color: #999; font-size: 13px;">📅 {{ new Date(report.created_at).toLocaleDateString() }}</span>
              <span style="color: #999; font-size: 13px;">📥 {{ report.download_count }} downloads</span>
            </div>
            <button @click="downloadReport(report.id, report.file_url)" style="width: 100%; background: #2563eb; color: white; border: none; padding: 12px; border-radius: 40px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.3s;">Download PDF</button>
          </div>
        </div>
        <div style="text-align: center; margin-top: 50px;">
          <button @click="router.push('/reports')" style="background: #2563eb; color: white; border: none; padding: 12px 32px; border-radius: 40px; font-size: 16px; font-weight: 600; cursor: pointer;">View All Reports</button>
        </div>
      </div>
    </section>

    <!-- Get Involved Section -->
    <section id="getinvolved" style="padding: 80px 20px; background: #f0f9ff;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: clamp(32px, 6vw, 42px); font-weight: 700; margin-bottom: 20px; color: #1e3a8a;">Get Involved</h2>
        <p style="text-align: center; color: #666; margin-bottom: 50px; font-size: 18px;">Join us in making mental health a priority in Malawi</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
          <div style="background: white; padding: 40px 30px; border-radius: 20px; text-align: center; transition: transform 0.3s;">
            <div style="width: 60px; height: 60px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 style="font-size: 22px; margin-bottom: 15px; color: #1e3a8a;">Become a Volunteer</h3>
            <p style="color: #666; margin-bottom: 25px; line-height: 1.6;">Join our network of trained mental health advocates across Malawi.</p>
            <button @click="alert('Please email info@sorryimnotsorry.org to volunteer')" style="background: #2563eb; color: white; border: none; padding: 10px 25px; border-radius: 30px; cursor: pointer;">Join Now</button>
          </div>
          
          <div style="background: white; padding: 40px 30px; border-radius: 20px; text-align: center; transition: transform 0.3s;">
            <div style="width: 60px; height: 60px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 style="font-size: 22px; margin-bottom: 15px; color: #1e3a8a;">Partner With Us</h3>
            <p style="color: #666; margin-bottom: 25px; line-height: 1.6;">Collaborate with us to expand mental health services across sectors.</p>
            <button @click="alert('Please email partnerships@sorryimnotsorry.org')" style="background: #2563eb; color: white; border: none; padding: 10px 25px; border-radius: 30px; cursor: pointer;">Partner Today</button>
          </div>
          
          <div style="background: white; padding: 40px 30px; border-radius: 20px; text-align: center; transition: transform 0.3s;">
            <div style="width: 60px; height: 60px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                <path d="M20 12V8h-4M12 4h4v4M4 12v4h4M12 20h-4v-4" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h3 style="font-size: 22px; margin-bottom: 15px; color: #1e3a8a;">Make a Donation</h3>
            <p style="color: #666; margin-bottom: 25px; line-height: 1.6;">Support our programs and help us reach more communities.</p>
            <button @click="alert('Thank you for your support! Donation page coming soon.')" style="background: #2563eb; color: white; border: none; padding: 10px 25px; border-radius: 30px; cursor: pointer;">Donate</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" style="padding: 80px 20px; background: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: clamp(32px, 6vw, 42px); font-weight: 700; margin-bottom: 20px; color: #1e3a8a;">Contact Us</h2>
        <p style="text-align: center; color: #666; margin-bottom: 50px; font-size: 18px;">Have questions? Reach out to us.</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px;">
          <div style="background: #f0f9ff; padding: 40px; border-radius: 20px;">
            <h3 style="font-size: 24px; margin-bottom: 25px; color: #1e3a8a;">Get in Touch</h3>
            <div style="margin-bottom: 25px; display: flex; align-items: center; gap: 15px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+265 998 896 206</span>
            </div>
            <div style="margin-bottom: 25px; display: flex; align-items: center; gap: 15px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>info@sorryimnotsorry.org</span>
            </div>
            <div style="margin-bottom: 25px; display: flex; align-items: center; gap: 15px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Lilongwe, Malawi</span>
            </div>
            
            <h3 style="font-size: 20px; margin: 30px 0 20px; color: #1e3a8a;">Follow Us</h3>
            <div style="display: flex; gap: 15px;">
              <a :href="SOCIAL_LINKS.facebook" target="_blank" style="width: 45px; height: 45px; background: #1877f2; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: transform 0.3s;">
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a :href="SOCIAL_LINKS.whatsapp" target="_blank" style="width: 45px; height: 45px; background: #25D366; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: transform 0.3s;">
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.6-.11 1.18-.13.53-1.02.98-1.66 1.02-.35.02-.74-.05-1.22-.19-.5-.15-1.03-.37-1.55-.67-1.13-.66-2.1-1.59-2.77-2.6-.58-.87-.91-1.78-.93-2.64-.01-.47.08-.93.27-1.34.19-.41.44-.74.73-1.02.3-.29.46-.41.6-.41.13 0 .26.01.37.11.1.1.27.33.34.45.06.12.12.25.18.38.05.13.1.27.14.4.04.13.07.26.09.39.02.13-.01.25-.07.36-.06.11-.13.21-.21.3-.08.09-.16.18-.23.27-.08.09-.14.16-.19.21-.05.06-.08.11-.05.18.03.07.09.16.16.27.3.49.74.92 1.26 1.22.2.11.35.19.44.24.07.04.12.07.15.1.03.03.05.06.06.09.01.03 0 .06-.03.09-.03.03-.09.09-.15.14-.06.05-.1.08-.14.11-.04.03-.08.06-.01.12.07.07.3.39.64.67.34.28.6.4.74.44.07.02.12.03.16.02.04 0 .09-.03.15-.08.06-.05.26-.28.34-.41.08-.13.16-.13.27-.08z"/><path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.5 3.53 1.38 5L2.5 21.5l4.52-.95A9.91 9.91 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
              </a>
              <a :href="SOCIAL_LINKS.linkedin" target="_blank" style="width: 45px; height: 45px; background: #0077B5; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; transition: transform 0.3s;">
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
          
          <form @submit.prevent="submitContact" style="display: flex; flex-direction: column; gap: 20px;">
            <input v-model="contactForm.name" type="text" placeholder="Your Name" required style="padding: 15px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 16px; transition: border 0.3s;" />
            <input v-model="contactForm.email" type="email" placeholder="Your Email" required style="padding: 15px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 16px;" />
            <textarea v-model="contactForm.message" placeholder="Your Message" rows="5" required style="padding: 15px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 16px; resize: vertical;"></textarea>
            <button type="submit" :disabled="contactSubmitting" style="background: #2563eb; color: white; border: none; padding: 15px; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer;">{{ contactSubmitting ? 'Sending...' : 'Send Message' }}</button>
          </form>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer style="background: #1e3a8a; color: white; padding: 60px 20px 40px;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; margin-bottom: 40px;">
          <div>
            <h3 style="font-size: 20px; margin-bottom: 15px;">Sorry I'm Not Sorry</h3>
            <p style="opacity: 0.8; line-height: 1.6;">We Are All Sick</p>
            <p style="opacity: 0.8; margin-top: 15px;">A registered Malawian non-profit organisation committed to promoting mental wellbeing.</p>
          </div>
          <div>
            <h3 style="font-size: 18px; margin-bottom: 15px;">Quick Links</h3>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <a @click="scrollTo('about')" style="color: white; opacity: 0.8; cursor: pointer;">About Us</a>
              <a @click="scrollTo('whatwedo')" style="color: white; opacity: 0.8; cursor: pointer;">What We Do</a>
              <a @click="scrollTo('articles')" style="color: white; opacity: 0.8; cursor: pointer;">Articles</a>
              <a @click="scrollTo('reports')" style="color: white; opacity: 0.8; cursor: pointer;">Reports</a>
              <a @click="scrollTo('getinvolved')" style="color: white; opacity: 0.8; cursor: pointer;">Get Involved</a>
              <a @click="scrollTo('contact')" style="color: white; opacity: 0.8; cursor: pointer;">Contact</a>
            </div>
          </div>
          <div>
            <h3 style="font-size: 18px; margin-bottom: 15px;">Contact Info</h3>
            <p style="opacity: 0.8;">+265 998 896 206</p>
            <p style="opacity: 0.8;">info@sorryimnotsorry.org</p>
            <p style="opacity: 0.8;">Lilongwe, Malawi</p>
          </div>
          <div>
            <h3 style="font-size: 18px; margin-bottom: 15px;">Follow Us</h3>
            <div style="display: flex; gap: 15px;">
              <a :href="SOCIAL_LINKS.facebook" target="_blank" style="color: white; opacity: 0.8; text-decoration: none;">Facebook</a>
              <a :href="SOCIAL_LINKS.whatsapp" target="_blank" style="color: white; opacity: 0.8; text-decoration: none;">WhatsApp</a>
              <a :href="SOCIAL_LINKS.linkedin" target="_blank" style="color: white; opacity: 0.8; text-decoration: none;">LinkedIn</a>
            </div>
          </div>
        </div>
        <div style="text-align: center; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1);">
          <p style="opacity: 0.6;">© 2025 Sorry I'm Not Sorry: We Are All Sick. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- Chat Widget -->
    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
      <button @click="chatOpen = !chatOpen" style="width: 55px; height: 55px; border-radius: 50%; background: #2563eb; color: white; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
      
      <div v-if="chatOpen" style="position: fixed; bottom: 90px; right: 20px; width: calc(100vw - 40px); max-width: 350px; height: 500px; background: white; border-radius: 15px; box-shadow: 0 5px 25px rgba(0,0,0,0.2); display: flex; flex-direction: column; overflow: hidden;">
        <div style="background: #1e3a8a; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span><strong>Venting Room</strong><br /><small style="font-size: 9px;">We're here to listen</small></span>
          </div>
          <button @click="chatOpen = false" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">✕</button>
        </div>
        
        <div style="flex: 1; padding: 15px; overflow-y: auto; background: #f0f9ff; display: flex; flex-direction: column; gap: 8px;">
          <div v-for="(msg, idx) in chatMessages" :key="idx" :style="{ alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start' }">
            <div :style="{ backgroundColor: msg.type === 'user' ? '#2563eb' : 'white', color: msg.type === 'user' ? 'white' : '#333', padding: '8px 12px', borderRadius: '10px', maxWidth: '220px', wordWrap: 'break-word', fontSize: '13px' }">
              {{ msg.text }}
            </div>
          </div>
          <div v-if="isTyping" style="text-align: left;">
            <div style="background: white; padding: 8px 12px; border-radius: 10px; display: inline-block; color: #666; font-size: 12px;">Advocate is typing...</div>
          </div>
        </div>
        
        <div style="padding: 12px; background: white; display: flex; gap: 8px; border-top: 1px solid #ddd;">
          <input v-model="chatInput" @keypress="handleChatKeyPress" type="text" placeholder="Type your message..." style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 20px; font-size: 13px; font-family: 'Poppins', sans-serif;" />
          <button @click="sendChatMessage" style="background: #2563eb; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
  transition: opacity 0.3s;
}

a:hover {
  opacity: 0.7;
}

button {
  transition: transform 0.2s, opacity 0.2s;
}

button:hover {
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .desktop-menu {
    display: none !important;
  }
  
  .desktop-download-btn {
    display: none !important;
  }
  
  .mobile-menu-btn {
    display: flex !important;
  }
  
  #whatwedo > div > div {
    grid-template-columns: 1fr !important;
  }
  
  #whatwedo > div > div > div {
    order: 0 !important;
  }
  
  #contact > div > div {
    grid-template-columns: 1fr !important;
  }
}

/* Tablet Styles */
@media (min-width: 769px) and (max-width: 1024px) {
  .desktop-menu {
    gap: 20px !important;
  }
  
  .desktop-menu a {
    font-size: 13px !important;
  }
}
</style>