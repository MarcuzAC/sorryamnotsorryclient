<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { publicAPI, type Article } from '@/api/client'

const router = useRouter()
const articles = ref<Article[]>([])
const loading = ref(true)

const truncate = (text: string, length: number) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

onMounted(async () => {
  try {
    const res = await publicAPI.getArticles(0, 100)
    articles.value = res.data
  } catch (error) {
    console.error('Failed to load articles')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div style="padding: 100px 20px 60px; max-width: 1200px; margin: 0 auto;">
    <h1 style="text-align: center; font-size: 36px; font-weight: 700; margin-bottom: 20px;">All Articles</h1>
    <p style="text-align: center; color: #666; margin-bottom: 60px;">Insights, stories, and information about mental health in Malawi</p>
    
    <div v-if="loading" style="text-align: center; padding: 60px;">Loading articles...</div>
    <div v-else-if="articles.length === 0" style="text-align: center; padding: 60px;">No articles found.</div>
    <div v-else style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px;">
      <div v-for="article in articles" :key="article.id" @click="router.push(`/articles/${article.id}`)" style="border-radius: 15px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.3s;">
        <div v-if="article.image_url" :style="{ height: '220px', backgroundImage: `url(${article.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }"></div>
        <div v-else style="height: 220px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 48px;">📚</div>
        <div style="padding: 20px;">
          <h3 style="font-size: 20px; margin-bottom: 10px;">{{ article.title }}</h3>
          <p style="color: #666; margin-bottom: 15px;">{{ truncate(article.subtitle || article.content, 120) }}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #999; font-size: 12px;">By {{ article.author }} • {{ new Date(article.created_at).toLocaleDateString() }}</span>
            <span style="color: #4CAF50; font-weight: 600;">Read More →</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
button:hover {
  transform: translateY(-2px);
}
</style>