<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { publicAPI, type Report } from '@/api/client'

const reports = ref<Report[]>([])
const loading = ref(true)

const downloadReport = async (id: number, url: string) => {
  try {
    await publicAPI.downloadReport(id)
    window.open(url, '_blank')
  } catch (error) {
    alert('Download failed. Please try again.')
  }
}

onMounted(async () => {
  try {
    const res = await publicAPI.getReports()
    reports.value = res.data
  } catch (error) {
    console.error('Failed to load reports')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div style="padding: 100px 20px 60px; max-width: 1200px; margin: 0 auto;">
    <h1 style="text-align: center; font-size: 36px; font-weight: 700; margin-bottom: 20px;">Download Reports</h1>
    <p style="text-align: center; color: #666; margin-bottom: 60px;">Access our latest research, annual reports, and publications</p>
    
    <div v-if="loading" style="text-align: center; padding: 60px;">Loading reports...</div>
    <div v-else-if="reports.length === 0" style="text-align: center; padding: 60px;">No reports available.</div>
    <div v-else style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px;">
      <div v-for="report in reports" :key="report.id" style="background: white; border-radius: 15px; padding: 30px; text-align: center; box-shadow: 0 5px 20px rgba(0,0,0,0.08);">
        <div style="font-size: 48px; margin-bottom: 15px;">📄</div>
        <h3 style="font-size: 20px; margin-bottom: 10px;">{{ report.title }}</h3>
        <p style="color: #666; margin-bottom: 20px;">{{ report.description || 'Download our latest report on mental health initiatives' }}</p>
        <div style="color: #999; font-size: 12px; margin-bottom: 20px;">
          📅 {{ new Date(report.created_at).toLocaleDateString() }} • 📥 {{ report.download_count }} downloads
        </div>
        <button @click="downloadReport(report.id, report.file_url)" style="background: #4CAF50; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;">Download PDF</button>
      </div>
    </div>
  </div>
</template>