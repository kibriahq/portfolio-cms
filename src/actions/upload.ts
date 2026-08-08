"use server";

import cloudinary from "@/lib/cloudinary";

export interface UploadImageResult {
  secure_url: string;
  public_id: string;
}

// const file = formData.get("image") as File;

export async function uploadImage(
  file: File,
  folder = "uploads",
): Promise<UploadImageResult> {
  if (!file) {
    throw new Error("File is required");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<UploadImageResult>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `portfolio/${folder}`,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Upload failed: empty response from Cloudinary"));
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      )
      .end(buffer);
  });

  return result;
}
