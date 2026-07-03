import heic2any from 'heic2any'

// Maximum base64 payload size target: ~1.5MB (safely under backend 5MB limit after JSON overhead)
const MAX_PAYLOAD_BYTES = 1.5 * 1024 * 1024

export async function compressAndConvertToWebp(file: File): Promise<string> {
  let imageFile: Blob = file

  // Convert HEIC/HEIF to JPEG first
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

  // Load image into a canvas
  const imageBitmap = await createImageBitmapFromBlob(imageFile)

  // Step 1: Scale down to max 1200px on longest side
  const MAX_DIM = 1200
  let { width, height } = imageBitmap
  if (width > height) {
    if (width > MAX_DIM) {
      height = Math.round(height * (MAX_DIM / width))
      width = MAX_DIM
    }
  } else {
    if (height > MAX_DIM) {
      width = Math.round(width * (MAX_DIM / height))
      height = MAX_DIM
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Gagal membuat canvas context.')
  ctx.drawImage(imageBitmap, 0, 0, width, height)

  // Step 2: Adaptive quality loop — keep lowering quality until under size limit
  let quality = 0.85
  const MIN_QUALITY = 0.3
  const QUALITY_STEP = 0.08
  let dataUrl = canvas.toDataURL('image/webp', quality)

  while (dataUrl.length > MAX_PAYLOAD_BYTES && quality > MIN_QUALITY) {
    quality -= QUALITY_STEP
    dataUrl = canvas.toDataURL('image/webp', quality)
  }

  // Step 3: If still too large after min quality, scale dimensions down further
  if (dataUrl.length > MAX_PAYLOAD_BYTES) {
    const scaleFactor = 0.6
    canvas.width = Math.round(width * scaleFactor)
    canvas.height = Math.round(height * scaleFactor)
    ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height)
    dataUrl = canvas.toDataURL('image/webp', MIN_QUALITY)
  }

  const finalSizeKB = Math.round(dataUrl.length / 1024)
  const finalQualityPct = Math.round(quality * 100)
  console.log(`[Image Compression] Final: ${finalSizeKB}KB, quality=${finalQualityPct}%, ${canvas.width}x${canvas.height}`)

  return dataUrl
}

function createImageBitmapFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Gagal memuat gambar.'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Gagal membaca file.'))
    reader.readAsDataURL(blob)
  })
}
