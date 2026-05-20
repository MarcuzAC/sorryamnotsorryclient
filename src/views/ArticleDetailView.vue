<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { publicAPI, type Article } from '@/api/client'

const route = useRoute()
const router = useRouter()
const article = ref<Article | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await publicAPI.getArticle(Number(route.params.id))
    article.value = res.data
  } catch (error) {
    console.error('Failed to load article')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div style="padding: 100px 20px 60px; max-width: 900px; margin: 0 auto;">
    <button @click="router.back()" style="background: none; border: none; color: #4CAF50; cursor: pointer; margin-bottom: 30px; font-size: 16px;">← Back to Articles</button>
    
    <div v-if="loading" style="text-align: center; padding: 60px;">Loading article...</div>
    <div v-else-if="article">
      <img v-if="article.image_url" :src="article.image_url" alt="Article image" style="width: 100%; border-radius: 15px; margin-bottom: 30px;" />
      <h1 style="font-size: 36px; font-weight: 700; margin-bottom: 20px;">{{ article.title }}</h1>
      <p v-if="article.subtitle" style="font-size: 18px; color: #666; margin-bottom: 20px;">{{ article.subtitle }}</p>
      <div style="display: flex; gap: 20px; color: #999; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
        <span>By {{ article.author }}</span>
        <span>{{ new Date(article.created_at).toLocaleDateString() }}</span>
        <span>👁️ {{ article.views || 0 }} views</span>
      </div>
      <div style="line-height: 1.8; font-size: 18px; color: #333;">
        {{ article.content }}
      </div>
    </div>
    <div v-else style="text-align: center; padding: 60px;">
      <h2>Article not found</h2>
      <button @click="router.push('/articles')" style="margin-top: 20px; background: #4CAF50; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">Back to Articles</button>
    </div>
  </div>
</template>