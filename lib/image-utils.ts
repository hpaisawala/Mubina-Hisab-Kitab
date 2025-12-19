import imageCompression from "browser-image-compression"
import { v4 as uuidv4 } from "uuid"

export async function compressAndRenameImage(file: File): Promise<{ blob: Blob; fileName: string }> {
  const options = {
    maxSizeMB: 0.3, // 300KB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }

  const compressedBlob = await imageCompression(file, options)
  const fileName = `${uuidv4()}.jpg`

  return { blob: compressedBlob, fileName }
}
