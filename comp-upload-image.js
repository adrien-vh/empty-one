import { ref, onMounted, watch } from 'vue'

export default {
  template: /*html*/`
    <div class="comp-upload-image"
      :class="{ 'drag-over': isDragOver }"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
      @click="openFileDialog"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg"
        style="display: none"
        @change="onFileSelected"
      />

      <div v-if="uploading" class="upload-status">
        <span class="spinner"></span>
        <p>Envoi en cours…</p>
      </div>

      <div v-else class="upload-prompt">
        <svg class="upload-icon" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4L14 16H21V28H27V16H34L24 4Z" fill="currentColor"/>
          <rect x="8" y="34" width="32" height="4" rx="2" fill="currentColor"/>
          <rect x="8" y="42" width="32" height="2" rx="1" fill="currentColor" opacity="0.4"/>
        </svg>
        <p class="upload-text">Glissez-déposez une image ici</p>
        <p class="upload-subtext">ou cliquez pour parcourir</p>
        <span class="upload-hint">JPG uniquement</span>
      </div>
    </div>
  `,
  props: {},
  setup() {
    const fileInput = ref(null)
    const isDragOver = ref(false)
    const uploading = ref(false)

    const processFile = async (file) => {
      if (!file || !file.type.startsWith('image/')) return
      if (file.type !== 'image/jpeg') {
        alert("Seuls les fichiers JPG sont acceptés !")
        return
      }
      uploading.value = true
      try {
        const response = await api.uploadImage(file)
        battleMapConf.value.backgroundUrl = response.url
      } finally {
        uploading.value = false
      }
    }

    const onDragEnter = () => { isDragOver.value = true }
    const onDragOver = () => { isDragOver.value = true }
    const onDragLeave = () => { isDragOver.value = false }

    const onDrop = async (e) => {
      isDragOver.value = false
      const file = e.dataTransfer.files[0]
      await processFile(file)
    }

    const openFileDialog = () => {
      fileInput.value?.click()
    }

    const onFileSelected = async (e) => {
      const file = e.target.files[0]
      await processFile(file)
      e.target.value = ''
    }

    return {
      fileInput,
      isDragOver,
      uploading,
      onDragEnter,
      onDragOver,
      onDragLeave,
      onDrop,
      openFileDialog,
      onFileSelected,
    }
  },
}
