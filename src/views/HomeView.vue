<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { publicAPI, type Article, type Report } from '@/api/client'

// Import logo and background images
import logo from '@/assets/images/logo.png'
import heroBg1 from '@/assets/images/hero1.jpg'
import heroBg2 from '@/assets/images/hero2.jpg'
import heroBg3 from '@/assets/images/hero3.jpg'
import heroBg4 from '@/assets/images/hero4.jpg'
import heroBg5 from '@/assets/images/hero5.jpg'

const router = useRouter()
const articles = ref<Article[]>([])
const reports = ref<Report[]>([])
const articlesLoading = ref(true)
const reportsLoading = ref(true)
const currentSlide = ref(0)

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

// Cleanup
onMounted(() => {
  return () => {
    if (slideInterval) clearInterval(slideInterval)
  }
})
</script>

<template>
  <div>
    <!-- Navigation -->
    <nav style="position: fixed; top: 0; left: 0; right: 0; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 1000;">
      <div style="max-width: 1200px; margin: 0 auto; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 12px; cursor: pointer;" @click="scrollTo('home')">
          <img :src="logo" alt="Logo" style="height: 45px; width: auto;" />
          <div>
            <h1 style="font-size: 16px; font-weight: 700; margin: 0; color: #1e3a8a;">Sorry I'm Not Sorry</h1>
            <p style="font-size: 10px; color: #666; margin: 0;">We Are All Sick</p>
          </div>
        </div>
        <div style="display: flex; gap: 30px; align-items: center;">
          <a @click="scrollTo('home')" style="cursor: pointer; color: #1e3a8a; font-weight: 500;">Home</a>
          <a @click="scrollTo('articles')" style="cursor: pointer; color: #1e3a8a; font-weight: 500;">Articles</a>
          <a @click="scrollTo('reports')" style="cursor: pointer; color: #1e3a8a; font-weight: 500;">Reports</a>
          <a @click="scrollTo('contact')" style="cursor: pointer; color: #1e3a8a; font-weight: 500;">Contact</a>
          <button @click="$router.push('/reports')" style="background: #2563eb; color: white; border: none; padding: 8px 20px; border-radius: 25px; font-weight: 600; cursor: pointer;">Download Reports</button>
        </div>
      </div>
    </nav>

    <!-- Hero Section with Slider -->
    <section id="home" style="position: relative; height: 100vh; overflow: hidden;">
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; transition: transform 0.8s ease-in-out; transform: translateX(-{{ currentSlide * 100 }}%);">
        <div v-for="(slide, index) in heroSlides" :key="index" :style="{ flex: '0 0 100%', height: '100%', backgroundImage: `url(${slide})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }">
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5);"></div>
        </div>
      </div>
      
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; text-align: center; color: white; z-index: 2;">
        <div style="max-width: 800px; padding: 20px;">
          <h1 style="font-size: 48px; font-weight: 700; margin-bottom: 20px;">Mainstreaming Mental Health as a Development Priority in Malawi</h1>
          <p style="font-size: 20px; margin-bottom: 30px; opacity: 0.9;">Together, we can turn silence into solidarity and make mental health everyone's business.</p>
          <div style="display: flex; gap: 20px; justify-content: center;">
            <button @click="scrollTo('articles')" style="background: #2563eb; color: white; border: none; padding: 12px 30px; border-radius: 50px; font-size: 16px; font-weight: 600; cursor: pointer;">Read Articles</button>
            <button @click="$router.push('/reports')" style="background: transparent; border: 2px solid white; color: white; padding: 12px 30px; border-radius: 50px; font-size: 16px; font-weight: 600; cursor: pointer;">Download Reports</button>
            <button @click="chatOpen = true" style="background: #f59e0b; border: none; color: white; padding: 12px 30px; border-radius: 50px; font-size: 16px; font-weight: 600; cursor: pointer;">Get Help</button>
          </div>
        </div>
      </div>
      
      <!-- Slide indicators -->
      <div style="position: absolute; bottom: 30px; left: 0; right: 0; display: flex; justify-content: center; gap: 12px; z-index: 2;">
        <button v-for="(_, index) in heroSlides" :key="index" @click="currentSlide = index" :style="{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', backgroundColor: currentSlide === index ? '#2563eb' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.3s' }"></button>
      </div>
    </section>

    <!-- Articles Section -->
    <section id="articles" style="padding: 80px 20px; background: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: 36px; font-weight: 700; margin-bottom: 20px; color: #1e3a8a;">Latest Articles</h2>
        <p style="text-align: center; color: #666; margin-bottom: 60px;">Insights, stories, and information about mental health in Malawi</p>
        
        <div v-if="articlesLoading" style="text-align: center; padding: 40px;">Loading articles...</div>
        <div v-else-if="articles.length === 0" style="text-align: center; padding: 40px;">No articles yet.</div>
        <div v-else style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px;">
          <div v-for="article in articles" :key="article.id" @click="router.push(`/articles/${article.id}`)" style="border-radius: 15px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.3s; background: white;">
            <div v-if="article.image_url" :style="{ height: '220px', backgroundImage: `url(${article.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }"></div>
            <div v-else style="height: 220px; background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%); display: flex; align-items: center; justify-content: center;">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div style="padding: 20px;">
              <h3 style="font-size: 20px; margin-bottom: 10px; color: #1e3a8a;">{{ article.title }}</h3>
              <p style="color: #666; margin-bottom: 15px;">{{ truncate(article.subtitle || article.content, 100) }}</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #999; font-size: 12px;">By {{ article.author }} • {{ new Date(article.created_at).toLocaleDateString() }}</span>
                <span style="color: #2563eb; font-weight: 600;">Read More →</span>
              </div>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 40px;">
          <button @click="router.push('/articles')" style="background: #2563eb; color: white; border: none; padding: 12px 30px; border-radius: 50px; font-size: 16px; font-weight: 600; cursor: pointer;">View All Articles</button>
        </div>
      </div>
    </section>

    <!-- Reports Section -->
    <section id="reports" style="padding: 80px 20px; background: #f0f9ff;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: 36px; font-weight: 700; margin-bottom: 20px; color: #1e3a8a;">Download Reports</h2>
        <p style="text-align: center; color: #666; margin-bottom: 60px;">Access our latest research, annual reports, and publications</p>
        
        <div v-if="reportsLoading" style="text-align: center; padding: 40px;">Loading reports...</div>
        <div v-else-if="reports.length === 0" style="text-align: center; padding: 40px;">No reports available.</div>
        <div v-else style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
          <div v-for="report in reports.slice(0, 3)" :key="report.id" style="background: white; border-radius: 15px; padding: 30px; text-align: center; box-shadow: 0 5px 20px rgba(0,0,0,0.05);">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 15px;">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <h3 style="font-size: 20px; margin-bottom: 10px; color: #1e3a8a;">{{ report.title }}</h3>
            <p style="color: #666; margin-bottom: 20px;">{{ report.description || 'Download our latest report on mental health initiatives' }}</p>
            <button @click="downloadReport(report.id, report.file_url)" style="background: #2563eb; color: white; border: none; padding: 10px 25px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">Download PDF</button>
          </div>
        </div>
        <div style="text-align: center; margin-top: 40px;">
          <button @click="router.push('/reports')" style="background: #2563eb; color: white; border: none; padding: 12px 30px; border-radius: 50px; font-size: 16px; font-weight: 600; cursor: pointer;">View All Reports</button>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" style="padding: 80px 20px; background: white;">
      <div style="max-width: 800px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: 36px; font-weight: 700; margin-bottom: 20px; color: #1e3a8a;">Contact Us</h2>
        <p style="text-align: center; color: #666; margin-bottom: 60px;">Have questions? Reach out to us.</p>
        
        <form @submit.prevent="submitContact" style="display: flex; flex-direction: column; gap: 20px;">
          <input v-model="contactForm.name" type="text" placeholder="Your Name" required style="padding: 15px; border: 1px solid #ddd; border-radius: 10px; font-size: 16px; font-family: 'Poppins', sans-serif;" />
          <input v-model="contactForm.email" type="email" placeholder="Your Email" required style="padding: 15px; border: 1px solid #ddd; border-radius: 10px; font-size: 16px; font-family: 'Poppins', sans-serif;" />
          <textarea v-model="contactForm.message" placeholder="Your Message" rows="5" required style="padding: 15px; border: 1px solid #ddd; border-radius: 10px; font-size: 16px; font-family: 'Poppins', sans-serif; resize: vertical;"></textarea>
          <button type="submit" :disabled="contactSubmitting" style="background: #2563eb; color: white; border: none; padding: 15px; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer;">{{ contactSubmitting ? 'Sending...' : 'Send Message' }}</button>
        </form>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 40px; border-top: 1px solid #eee;">
          <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>+265 998 896 206</span>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>info@sorryimnotsorry.org</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer style="background: #1e3a8a; color: white; text-align: center; padding: 40px;">
      <p>© 2025 Sorry I'm Not Sorry: We Are All Sick. All rights reserved.</p>
      <p style="margin-top: 10px; opacity: 0.8;">A registered Malawian non-profit organisation committed to promoting mental wellbeing.</p>
    </footer>

    <!-- Chat Widget -->
    <div style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
      <button @click="chatOpen = !chatOpen" style="width: 60px; height: 60px; border-radius: 50%; background: #2563eb; color: white; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
      
      <div v-if="chatOpen" style="position: fixed; bottom: 100px; right: 20px; width: 350px; height: 500px; background: white; border-radius: 15px; box-shadow: 0 5px 25px rgba(0,0,0,0.2); display: flex; flex-direction: column; overflow: hidden;">
        <div style="background: #1e3a8a; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span><strong>Venting Room</strong><br /><small style="font-size: 10px;">We're here to listen</small></span>
          </div>
          <button @click="chatOpen = false" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">✕</button>
        </div>
        
        <div style="flex: 1; padding: 15px; overflow-y: auto; background: #f0f9ff; display: flex; flex-direction: column; gap: 10px;">
          <div v-for="(msg, idx) in chatMessages" :key="idx" :style="{ alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start' }">
            <div :style="{ backgroundColor: msg.type === 'user' ? '#2563eb' : 'white', color: msg.type === 'user' ? 'white' : '#333', padding: '10px 15px', borderRadius: '10px', maxWidth: '250px', wordWrap: 'break-word' }">
              {{ msg.text }}
            </div>
          </div>
          <div v-if="isTyping" style="text-align: left;">
            <div style="background: white; padding: 10px 15px; border-radius: 10px; display: inline-block; color: #666;">Advocate is typing...</div>
          </div>
        </div>
        
        <div style="padding: 15px; background: white; display: flex; gap: 10px; border-top: 1px solid #ddd;">
          <input v-model="chatInput" @keypress="handleChatKeyPress" type="text" placeholder="Type your message..." style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 20px; font-family: 'Poppins', sans-serif;" />
          <button @click="sendChatMessage" style="background: #2563eb; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
</style>