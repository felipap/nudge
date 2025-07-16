import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

// import { CAPTURE_RESIZE_FACTOR } from '../../../../lib/config'
// Sync with nudge/src/lib/config.ts
const CAPTURE_RESIZE_FACTOR = 0.4

const INPUT_DIR = path.join(__dirname, 'images')
const OUTPUT_DIR = path.join(__dirname, 'resized')

async function resizeImage(
  inputPath: string,
  outputPath: string
): Promise<void> {
  try {
    // Get original image metadata
    const metadata = await sharp(inputPath).metadata()

    if (!metadata.width || !metadata.height) {
      throw new Error('Could not determine image dimensions')
    }

    // Calculate new dimensions (40% of original)
    const newWidth = Math.round(metadata.width * CAPTURE_RESIZE_FACTOR)
    const newHeight = Math.round(metadata.height * CAPTURE_RESIZE_FACTOR)

    await sharp(inputPath)
      .resize(newWidth, newHeight, {
        fit: 'fill', // Maintain aspect ratio
        withoutEnlargement: true, // Don't enlarge if image is already small
      })
      .png()
      .toFile(outputPath)

    console.log(
      `✅ Resized ${path.basename(inputPath)} from ${metadata.width}x${
        metadata.height
      } to ${newWidth}x${newHeight}`
    )
  } catch (error) {
    console.error(
      `❌ Error resizing ${path.basename(inputPath)}:`,
      (error as Error).message
    )
  }
}

async function resizeAllImages(): Promise<void> {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const imageFiles = fs
    .readdirSync(INPUT_DIR)
    .filter((file) => file.endsWith('.png'))
    .filter((file) => !file.includes('resized')) // Skip already resized images

  console.log(`Found ${imageFiles.length} PNG images to resize...`)

  for (const imageFile of imageFiles) {
    const inputPath = path.join(INPUT_DIR, imageFile)
    const outputPath = path.join(OUTPUT_DIR, imageFile)

    await resizeImage(inputPath, outputPath)
  }

  console.log('\n🎉 All images resized successfully!')
  console.log(`Resized images saved in: ${OUTPUT_DIR}`)
}

resizeAllImages().catch(console.error)
