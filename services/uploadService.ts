// ─────────────────────────────────────────────
// Upload Service — currently mocked
// Replace with Firebase Storage upload when ready
// ─────────────────────────────────────────────

export interface UploadResult {
  url: string;
  path: string;
  name: string;
}

// MOCK — replace with: uploadBytes(ref(storage, path), file)
export async function uploadPhoto(
  file: File,
  orderId: string
): Promise<UploadResult> {
  await new Promise((r) => setTimeout(r, 500)); // simulate upload
  const url = URL.createObjectURL(file);
  return {
    url,
    path: `orders/${orderId}/${file.name}`,
    name: file.name,
  };
}

// MOCK — replace with: listAll(ref(storage, `orders/${orderId}`))
export async function getOrderPhotos(orderId: string): Promise<UploadResult[]> {
  console.log("getOrderPhotos:", orderId);
  return [];
}
