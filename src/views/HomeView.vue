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

// Our Work Includes slideshow images
import communityImg from '@/assets/images/community.jpg'
import crisisImg from '@/assets/images/crisis.jpg'
import youthProgrammesImg from '@/assets/images/youth-programmes.jpg'
import therapyImg from '@/assets/images/therapy.jpg'
import advocacyIconImg from '@/assets/images/advocacy-icon.jpg'
import psychosocialImg from '@/assets/images/psychosocial.jpg'
import mobilisationImg from '@/assets/images/mobilisation.jpg'
import digitalImg from '@/assets/images/digital.jpg'

// Report PDF
import freeTherapyPdf from '@/assets/reports/Free_therapy.pdf'

// Slideshow data for Our Work Includes
const workSlides = ref([
  {
    id: 1,
    image: communityImg,
    title: "Community Safe Spaces",
    description: "Creating safe, judgment-free environments where individuals can access mental health support, share experiences, and find community connection in their neighborhoods."
  },
  {
    id: 2,
    image: crisisImg,
    title: "Crisis Response Systems",
    description: "24/7 emergency mental health support with trained crisis responders, helplines, and rapid referral networks for individuals in psychological distress."
  },
  {
    id: 3,
    image: youthProgrammesImg,
    title: "Youth Mental Health Programmes",
    description: "School-based mental health education, peer support clubs, and youth leadership training reaching thousands of young people across Malawi."
  },
  {
    id: 4,
    image: therapyImg,
    title: "Therapy Initiatives",
    description: "Accessible counselling services, group therapy sessions, and professional mental health support for individuals and families in need."
  },
  {
    id: 5,
    image: advocacyIconImg,
    title: "Advocacy Campaigns",
    description: "National campaigns to reduce stigma, influence mental health policy, and promote mental health as a development priority in Malawi."
  },
  {
    id: 6,
    image: psychosocialImg,
    title: "Psychosocial Support",
    description: "Holistic support addressing emotional, social, and psychological wellbeing through community-based interventions and trained peer supporters."
  },
  {
    id: 7,
    image: mobilisationImg,
    title: "Community Mobilisation",
    description: "Engaging community leaders, faith groups, and local organizations to build sustainable mental health support networks from the ground up."
  },
  {
    id: 8,
    image: digitalImg,
    title: "Digital Mental Health Initiatives",
    description: "Online counselling platforms, mental health apps, and digital resources making support accessible to remote and underserved communities."
  }
])

const currentWorkSlide = ref(0)
let workSlideInterval: ReturnType<typeof setInterval>

const nextWorkSlide = () => {
  currentWorkSlide.value = (currentWorkSlide.value + 1) % workSlides.value.length
}

const prevWorkSlide = () => {
  currentWorkSlide.value = (currentWorkSlide.value - 1 + workSlides.value.length) % workSlides.value.length
}

const goToWorkSlide = (index: number) => {
  currentWorkSlide.value = index
}

// Report preview modal
const showReportModal = ref(false)
const reportPdfUrl = freeTherapyPdf

const openReportPreview = () => {
  showReportModal.value = true
}

const closeReportPreview = () => {
  showReportModal.value = false
}

const downloadReport = () => {
  const link = document.createElement('a')
  link.href = freeTherapyPdf
  link.download = 'Free_Therapy_Report.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const router = useRouter()
const articles = ref<Article[]>([])
const reports = ref<Report[]>([])
const articlesLoading = ref(true)
const reportsLoading = ref(true)
const currentSlide = ref(0)
const mobileMenuOpen = ref(false)
const activeTab = ref('articles')

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

// Alert functions for buttons
const handleVolunteer = () => {
  alert('Please email info@sorryimnotsorry.org to volunteer')
}

const handlePartner = () => {
  alert('Please email partnerships@sorryimnotsorry.org')
}

const handleDonate = () => {
  alert('Thank you for your support! Donation page coming soon.')
}

const truncate = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) element.scrollIntoView({ behavior: 'smooth' })
  mobileMenuOpen.value = false
}

const downloadReportFromAPI = async (id: number, url: string) => {
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
  
  // Auto-slide for work section
  workSlideInterval = setInterval(() => {
    nextWorkSlide()
  }, 6000)
  
  try {
    const res = await publicAPI.getArticles(0, 6)
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
  if (workSlideInterval) clearInterval(workSlideInterval)
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
          <a @click="scrollTo('publications')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; font-size: 14px;">Publications</a>
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
        <a @click="scrollTo('publications')" style="cursor: pointer; color: #1e3a8a; font-weight: 500; padding: 8px 0;">Publications</a>
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
            <button @click="scrollTo('publications')" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 50px; font-size: clamp(12px, 4vw, 16px); font-weight: 600; cursor: pointer;">Read Publications</button>
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
        
        <!-- Main Description -->
        <div style="max-width: 1000px; margin: 0 auto 50px auto; text-align: center;">
          <p style="font-size: 18px; color: #4b5563; line-height: 1.8; margin-bottom: 30px;">
            We are a <strong>youth-led mental health organisation</strong> based in Malawi, committed to making mental health support more accessible, community-driven, and stigma-free.
          </p>
          <p style="font-size: 16px; color: #6b7280; line-height: 1.8; margin-bottom: 30px;">
            Founded in 2023 and legally registered in 2025, the organisation was born out of a growing need for safe spaces, honest conversations, and practical mental health support within communities where many people continue to struggle in silence.
          </p>
          <p style="font-size: 16px; color: #6b7280; line-height: 1.8;">
            We believe mental health is not only a health issue, but a <strong>development issue</strong> that affects education, livelihoods, relationships, productivity, families, and communities. Our work focuses on connecting people to care, empowering communities with knowledge and tools, and building systems that make support more accessible across Malawi.
          </p>
        </div>

        <!-- Our Work Includes - BIG IMAGE SLIDESHOW -->
        <div style="margin-bottom: 50px;">
          <h3 style="text-align: center; font-size: 32px; font-weight: 700; color: #1e3a8a; margin-bottom: 15px;">Our Work Includes</h3>
          <p style="text-align: center; color: #4b5563; font-size: 18px; margin-bottom: 50px;">Explore the different ways we're making mental health support accessible across Malawi</p>
          
          <!-- Slideshow -->
          <div style="position: relative; max-width: 1200px; margin: 0 auto;">
            <!-- Main Slide -->
            <div style="background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
              <div style="position: relative; height: 500px; overflow: hidden;">
                <img :src="workSlides[currentWorkSlide].image" :alt="workSlides[currentWorkSlide].title" style="width: 100%; height: 100%; object-fit: cover;" />
                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.85), transparent); padding: 50px 40px 40px;">
                  <h4 style="font-size: 32px; font-weight: 700; color: white; margin-bottom: 12px;">{{ workSlides[currentWorkSlide].title }}</h4>
                  <p style="font-size: 18px; color: rgba(255,255,255,0.95); line-height: 1.6; max-width: 70%;">{{ workSlides[currentWorkSlide].description }}</p>
                </div>
              </div>
            </div>
            
            <!-- Navigation Arrows -->
            <button @click="prevWorkSlide" style="position: absolute; top: 50%; left: 20px; transform: translateY(-50%); width: 48px; height: 48px; background: white; border: none; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #1e3a8a; transition: all 0.3s;">
              ←
            </button>
            <button @click="nextWorkSlide" style="position: absolute; top: 50%; right: 20px; transform: translateY(-50%); width: 48px; height: 48px; background: white; border: none; border-radius: 50%; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #1e3a8a; transition: all 0.3s;">
              →
            </button>
            
            <!-- Dots Indicator -->
            <div style="display: flex; justify-content: center; gap: 12px; margin-top: 30px;">
              <button 
                v-for="(slide, index) in workSlides" 
                :key="index"
                @click="goToWorkSlide(index)"
                :style="{
                  width: currentWorkSlide === index ? '40px' : '10px',
                  height: '10px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: currentWorkSlide === index ? '#2563eb' : '#cbd5e1',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }">
              </button>
            </div>
            
            <!-- Thumbnail Navigation -->
            <div style="display: flex; justify-content: center; gap: 12px; margin-top: 30px; flex-wrap: wrap;">
              <button 
                v-for="(slide, index) in workSlides" 
                :key="index"
                @click="goToWorkSlide(index)"
                :style="{
                  width: '70px',
                  height: '70px',
                  borderRadius: '12px',
                  border: currentWorkSlide === index ? '3px solid #2563eb' : '2px solid #e2e8f0',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  padding: '0',
                  background: 'transparent'
                }">
                <img :src="slide.image" :alt="slide.title" style="width: 100%; height: 100%; object-fit: cover;" />
              </button>
            </div>
          </div>
        </div>

        <!-- Free Therapy Report Section -->
        <div style="margin: 60px 0 50px; background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); border-radius: 24px; padding: 50px; text-align: center;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
            <div style="width: 80px; height: 80px; background: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <h3 style="font-size: 32px; font-weight: 700; color: #1e3a8a; margin: 0;">Free Therapy Initiative Report</h3>
          </div>
          <p style="font-size: 18px; color: #4b5563; margin-bottom: 30px; max-width: 700px; margin-left: auto; margin-right: auto;">
            Learn about our impact, success stories, and how free therapy is transforming mental health care in Malawi.
          </p>
          <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
            <button @click="openReportPreview" style="background: #2563eb; color: white; border: none; padding: 14px 32px; border-radius: 50px; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 10px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Preview Report
            </button>
            <button @click="downloadReport" style="background: #10b981; color: white; border: none; padding: 14px 32px; border-radius: 50px; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 10px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>

        <!-- Achievements / Impact -->
        <div style="margin-bottom: 50px;">
          <h3 style="text-align: center; font-size: 24px; font-weight: 700; color: #1e3a8a; margin-bottom: 30px;">Since Our Founding</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px;">
            <div style="text-align: center; padding: 25px; background: #f0f9ff; border-radius: 16px;">
              <div style="width: 60px; height: 60px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p style="font-size: 16px; color: #4b5563;">Built a growing network of trained mental health advocates</p>
            </div>
            <div style="text-align: center; padding: 25px; background: #f0f9ff; border-radius: 16px;">
              <div style="width: 60px; height: 60px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <p style="font-size: 16px; color: #4b5563;">Supported psychological emergencies and crisis referrals</p>
            </div>
            <div style="text-align: center; padding: 25px; background: #f0f9ff; border-radius: 16px;">
              <div style="width: 60px; height: 60px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                  <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <p style="font-size: 16px; color: #4b5563;">Led national awareness and therapy campaigns</p>
            </div>
            <div style="text-align: center; padding: 25px; background: #f0f9ff; border-radius: 16px;">
              <div style="width: 60px; height: 60px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <p style="font-size: 16px; color: #4b5563;">Engaged thousands through community and digital initiatives</p>
            </div>
          </div>
        </div>

        <!-- Core Values -->
        <div style="margin-bottom: 50px;">
          <h3 style="text-align: center; font-size: 24px; font-weight: 700; color: #1e3a8a; margin-bottom: 30px;">Our Work Is Grounded In</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 15px; justify-content: center;">
            <span style="padding: 10px 24px; background: #e0e7ff; color: #1e3a8a; border-radius: 40px; font-weight: 500;">Compassion</span>
            <span style="padding: 10px 24px; background: #e0e7ff; color: #1e3a8a; border-radius: 40px; font-weight: 500;">Human dignity</span>
            <span style="padding: 10px 24px; background: #e0e7ff; color: #1e3a8a; border-radius: 40px; font-weight: 500;">Inclusion</span>
            <span style="padding: 10px 24px; background: #e0e7ff; color: #1e3a8a; border-radius: 40px; font-weight: 500;">Community empowerment</span>
            <span style="padding: 10px 24px; background: #e0e7ff; color: #1e3a8a; border-radius: 40px; font-weight: 500;">Safeguarding and ethical care</span>
            <span style="padding: 10px 24px; background: #e0e7ff; color: #1e3a8a; border-radius: 40px; font-weight: 500;">Evidence-based approaches</span>
            <span style="padding: 10px 24px; background: #e0e7ff; color: #1e3a8a; border-radius: 40px; font-weight: 500;">Culturally responsive care</span>
          </div>
        </div>

        <!-- Closing Statement -->
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%); border-radius: 20px; padding: 50px 40px; text-align: center; color: white;">
          <p style="font-size: 22px; font-weight: 600; line-height: 1.6; margin-bottom: 0;">
            At our core, we are building more than programmes.<br>
            We are building a movement where people feel seen, heard, supported,<br>
            and reminded that <strong style="color: #fcd34d;">healing should never be a privilege</strong>.
          </p>
        </div>
      </div>
    </section>

    <!-- Report Preview Modal -->
    <div v-if="showReportModal" @click="closeReportPreview" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div @click.stop style="background: white; border-radius: 20px; width: 90%; max-width: 1000px; height: 80vh; display: flex; flex-direction: column; overflow: hidden;">
        <div style="padding: 20px; background: #1e3a8a; color: white; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; font-size: 20px;">Free Therapy Initiative Report</h3>
          <button @click="closeReportPreview" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <div style="flex: 1; overflow: auto;">
          <iframe :src="reportPdfUrl" style="width: 100%; height: 100%; border: none;"></iframe>
        </div>
        <div style="padding: 15px; background: #f0f9ff; display: flex; justify-content: center; gap: 15px;">
          <button @click="downloadReport" style="background: #10b981; color: white; border: none; padding: 10px 24px; border-radius: 40px; cursor: pointer; font-weight: 600;">Download PDF</button>
          <button @click="closeReportPreview" style="background: #6b7280; color: white; border: none; padding: 10px 24px; border-radius: 40px; cursor: pointer; font-weight: 600;">Close</button>
        </div>
      </div>
    </div>

    <!-- Rest of your sections (What We Do, Publications, Get Involved, Contact, Footer, Chat) -->
    <!-- What We Do Section -->
    <section id="whatwedo" style="padding: 80px 20px; background: white;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: clamp(32px, 6vw, 42px); font-weight: 700; margin-bottom: 20px; color: #1e3a8a;">What We Do</h2>
        <p style="text-align: center; color: #666; margin-bottom: 60px; font-size: 18px;">Our programs and initiatives across Malawi</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; margin-bottom: 80px;">
          <div><img :src="ventingImg" alt="Venting Rooms" style="width: 100%; border-radius: 20px; box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1);" /></div>
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
            <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">Safe, confidential spaces where individuals can share their struggles without fear of judgment.</p>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.7;">Available 24/7 across multiple districts, our venting rooms have become a lifeline for hundreds of Malawians.</p>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; margin-bottom: 80px;">
          <div style="order: 2;"><img :src="friendshipImg" alt="Friendship Benches" style="width: 100%; border-radius: 20px; box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1);" /></div>
          <div style="order: 1;">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div style="width: 50px; height: 50px; background: #e0e7ff; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                  <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z" />
                  <path d="M12 6v6l4 2" />
                  <path d="M16 21.5a4 4 0 0 0-4-4h-2a4 4 0 0 0-4 4" />
                </svg>
              </div>
              <h3 style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin: 0;">Friendship Benches</h3>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">Community-based psychosocial counselling delivered by trained grandmothers and community health workers.</p>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.7;">We've established benches in 15 districts where anyone can receive culturally appropriate mental health support.</p>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; margin-bottom: 80px;">
          <div><img :src="youthImg" alt="Youth & School Clubs" style="width: 100%; border-radius: 20px; box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1);" /></div>
          <div>
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div style="width: 50px; height: 50px; background: #e0e7ff; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                  <path d="M22 10v6M2 10v6" />
                  <path d="M12 17v5M8 21h8" />
                  <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                </svg>
              </div>
              <h3 style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin: 0;">Youth & School Clubs</h3>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">Building mental health literacy through peer-support clubs, teacher training, and awareness campaigns.</p>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.7;">45+ school clubs reaching over 10,000 students with mental health education and coping skills.</p>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; margin-bottom: 80px;">
          <div style="order: 2;"><img :src="maternalImg" alt="Maternal Circles" style="width: 100%; border-radius: 20px; box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1);" /></div>
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
            <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">Empowering adolescent mothers and survivors of gender-based violence through specialized support groups.</p>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.7;">Our maternal circles provide a safe sisterhood for counselling, parenting support, and referrals.</p>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center; margin-bottom: 80px;">
          <div><img :src="skillsImg" alt="Skills for Wellness" style="width: 100%; border-radius: 20px; box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1);" /></div>
          <div>
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div style="width: 50px; height: 50px; background: #e0e7ff; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h3 style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin: 0;">Skills for Wellness</h3>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">Linking mental health recovery to livelihoods through vocational training and entrepreneurship.</p>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.7;">500+ youth and women trained in income-generating activities with start-up kits and mentorship.</p>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center;">
          <div style="order: 2;"><img :src="advocacyImg" alt="Advocacy Hub" style="width: 100%; border-radius: 20px; box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1);" /></div>
          <div style="order: 1;">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
              <div style="width: 50px; height: 50px; background: #e0e7ff; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin: 0;">Advocacy & Policy Hub</h3>
            </div>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin-bottom: 15px;">Influencing policy and national mental health financing through evidence-based advocacy.</p>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.7;">Contributed to the Mental Health Act (2025) and trained 150+ advocates nationwide.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Publications Section -->
    <section id="publications" style="padding: 80px 20px; background: #f0f9ff;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: clamp(32px, 6vw, 42px); font-weight: 700; margin-bottom: 20px; color: #1e3a8a;">Publications</h2>
        <p style="text-align: center; color: #666; margin-bottom: 50px; font-size: 18px;">Explore our latest articles, research reports, and publications</p>
        
        <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 40px;">
          <button @click="activeTab = 'articles'" :style="{ background: activeTab === 'articles' ? '#2563eb' : 'white', color: activeTab === 'articles' ? 'white' : '#1e3a8a', border: activeTab === 'articles' ? 'none' : '2px solid #2563eb', padding: '10px 30px', borderRadius: '40px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }">Articles</button>
          <button @click="activeTab = 'reports'" :style="{ background: activeTab === 'reports' ? '#2563eb' : 'white', color: activeTab === 'reports' ? 'white' : '#1e3a8a', border: activeTab === 'reports' ? 'none' : '2px solid #2563eb', padding: '10px 30px', borderRadius: '40px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }">Reports</button>
        </div>
        
        <div v-if="activeTab === 'articles'">
          <div v-if="articlesLoading" style="text-align: center; padding: 60px;">Loading articles...</div>
          <div v-else-if="articles.length === 0" style="text-align: center; padding: 60px;">No articles yet.</div>
          <div v-else style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
            <div v-for="article in articles" :key="article.id" @click="router.push(`/articles/${article.id}`)" style="background: white; border-radius: 20px; overflow: hidden; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
              <div v-if="article.image_url" :style="{ height: '200px', backgroundImage: `url(${article.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }"></div>
              <div v-else style="height: 200px; background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%); display: flex; align-items: center; justify-content: center;">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div style="padding: 25px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                  <span style="background: #e0e7ff; color: #1e3a8a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">Article</span>
                  <span style="color: #999; font-size: 12px;">{{ new Date(article.created_at).toLocaleDateString() }}</span>
                </div>
                <h3 style="font-size: 20px; margin-bottom: 12px; color: #1e3a8a;">{{ article.title }}</h3>
                <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">{{ truncate(article.subtitle || article.content, 100) }}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                  <span style="color: #999; font-size: 13px;">By {{ article.author }}</span>
                  <span style="color: #2563eb; font-weight: 600;">Read More →</span>
                </div>
              </div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 50px;">
            <button @click="router.push('/articles')" style="background: #2563eb; color: white; border: none; padding: 12px 32px; border-radius: 40px; font-size: 16px; font-weight: 600; cursor: pointer;">View All Articles</button>
          </div>
        </div>
        
        <div v-if="activeTab === 'reports'">
          <div v-if="reportsLoading" style="text-align: center; padding: 60px;">Loading reports...</div>
          <div v-else-if="reports.length === 0" style="text-align: center; padding: 60px;">No reports available.</div>
          <div v-else style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
            <div v-for="report in reports.slice(0, 6)" :key="report.id" style="background: white; padding: 40px 30px; border-radius: 20px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
              <div style="width: 70px; height: 70px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <h3 style="font-size: 22px; margin-bottom: 15px; color: #1e3a8a;">{{ report.title }}</h3>
              <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">{{ report.description || 'Download our latest report on mental health initiatives in Malawi' }}</p>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding: 10px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #999; font-size: 13px;">{{ new Date(report.created_at).toLocaleDateString() }}</span>
                <span style="color: #999; font-size: 13px;">{{ report.download_count }} downloads</span>
              </div>
              <button @click="downloadReportFromAPI(report.id, report.file_url)" style="width: 100%; background: #2563eb; color: white; border: none; padding: 12px; border-radius: 40px; font-size: 14px; font-weight: 600; cursor: pointer;">Download PDF</button>
            </div>
          </div>
          <div style="text-align: center; margin-top: 50px;">
            <button @click="router.push('/reports')" style="background: #2563eb; color: white; border: none; padding: 12px 32px; border-radius: 40px; font-size: 16px; font-weight: 600; cursor: pointer;">View All Reports</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Get Involved Section -->
    <section id="getinvolved" style="padding: 80px 20px; background: #f0f9ff;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: clamp(32px, 6vw, 42px); font-weight: 700; margin-bottom: 20px; color: #1e3a8a;">Get Involved</h2>
        <p style="text-align: center; color: #4b5563; font-size: 18px; max-width: 800px; margin: 0 auto 50px auto; line-height: 1.6;">Mental health change takes all of us. Whether you want to volunteer, partner, support a campaign, or help create safer conversations in your community, there is space for you in this movement.</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px;">
          <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
            <div style="width: 60px; height: 60px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 style="font-size: 24px; font-weight: 700; color: #1e3a8a; margin-bottom: 15px;">Volunteer With Us</h3>
            <p style="color: #4b5563; margin-bottom: 20px;">Join our growing network of mental health advocates across Malawi.</p>
            <button @click="handleVolunteer" style="width: 100%; background: #2563eb; color: white; border: none; padding: 12px; border-radius: 40px; font-size: 16px; font-weight: 600; cursor: pointer;">Join Now →</button>
          </div>
          
          <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
            <div style="width: 60px; height: 60px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 style="font-size: 24px; font-weight: 700; color: #1e3a8a; margin-bottom: 15px;">Partner With Us</h3>
            <p style="color: #4b5563; margin-bottom: 20px;">We collaborate with NGOs, schools, government, and private sector organisations.</p>
            <button @click="handlePartner" style="width: 100%; background: #2563eb; color: white; border: none; padding: 12px; border-radius: 40px; font-size: 16px; font-weight: 600; cursor: pointer;">Partner Today →</button>
          </div>
          
          <div style="background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
            <div style="width: 60px; height: 60px; background: #e0e7ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8">
                <path d="M20 12V8h-4M12 4h4v4M4 12v4h4M12 20h-4v-4" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h3 style="font-size: 24px; font-weight: 700; color: #1e3a8a; margin-bottom: 15px;">Support Our Work</h3>
            <p style="color: #4b5563; margin-bottom: 20px;">Help us sustain free therapy, safe spaces, and awareness campaigns.</p>
            <button @click="handleDonate" style="width: 100%; background: #2563eb; color: white; border: none; padding: 12px; border-radius: 40px; font-size: 16px; font-weight: 600; cursor: pointer;">Donate Now →</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" style="padding: 80px 20px; background: #f0f9ff;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h2 style="text-align: center; font-size: clamp(32px, 6vw, 42px); font-weight: 700; margin-bottom: 20px; color: #1e3a8a;">Contact Us</h2>
        <p style="text-align: center; color: #666; margin-bottom: 50px; font-size: 18px;">Have questions? Reach out to us.</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 50px;">
          <div style="background: white; padding: 40px; border-radius: 20px;">
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
              <a :href="SOCIAL_LINKS.facebook" target="_blank" style="width: 45px; height: 45px; background: #1877f2; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none;">f</a>
              <a :href="SOCIAL_LINKS.whatsapp" target="_blank" style="width: 45px; height: 45px; background: #25D366; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none;">w</a>
              <a :href="SOCIAL_LINKS.linkedin" target="_blank" style="width: 45px; height: 45px; background: #0077B5; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none;">in</a>
            </div>
          </div>
          
          <form @submit.prevent="submitContact" style="display: flex; flex-direction: column; gap: 20px;">
            <input v-model="contactForm.name" type="text" placeholder="Your Name" required style="padding: 15px; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 16px;" />
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
              <a @click="scrollTo('publications')" style="color: white; opacity: 0.8; cursor: pointer;">Publications</a>
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
  
  #publications > div > div:last-child {
    grid-template-columns: 1fr !important;
  }
  
  #getinvolved > div > div:last-child {
    grid-template-columns: 1fr !important;
  }
  
  #contact > div > div {
    grid-template-columns: 1fr !important;
  }
  
  button[style*="position: absolute"] {
    width: 35px !important;
    height: 35px !important;
    font-size: 18px !important;
  }
  
  [style*="height: 500px"] {
    height: 300px !important;
  }
  
  [style*="font-size: 32px"] {
    font-size: 24px !important;
  }
  
  [style*="font-size: 18px"][style*="color: rgba(255,255,255"] {
    font-size: 14px !important;
    max-width: 100% !important;
  }
  
  [style*="padding: 50px 40px 40px"] {
    padding: 30px 20px 20px !important;
  }
  
  [style*="width: 70px"] {
    width: 50px !important;
    height: 50px !important;
  }
}
</style>