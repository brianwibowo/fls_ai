import heic2any from 'heic2any'

export async function compressAndConvertToWebp(file: File): Promise<string> {
  let imageFile: Blob = file

  // Check if file is HEIC
  const nameLower = file.name.toLowerCase()
  if (nameLower.endsWith('.heic') || nameLower.endsWith('.heif') || file.type === 'image/heic' || file.type === 'image/heif') {
    try {
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
      })
      imageFile = Array.isArray(converted) ? converted[0] : converted
    } catch (err) {
      console.error('HEIC conversion failed', err)
      throw new Error('Gagal mengonversi file HEIC. Format tidak didukung.')
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        
        // HD resolution limit
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 1200
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Gagal membuat canvas context.'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Compress and convert to webp (0.82 quality for optimal HD / size balance)
        const webpDataUrl = canvas.toDataURL('image/webp', 0.82)
        resolve(webpDataUrl)
      }
      img.onerror = () => reject(new Error('Gagal memuat gambar ke canvas.'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Gagal membaca file.'))
    reader.readAsDataURL(imageFile)
  })
}
