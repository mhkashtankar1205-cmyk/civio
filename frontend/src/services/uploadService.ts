/**
 * Image Upload Service Abstraction (Cloudinary-ready)
 * 
 * In production, this service will perform a multipart form upload to Cloudinary
 * or call a backend endpoint that handles uploading to Cloudinary via SDK.
 * 
 * For the local MVP, it creates a local Object URL.
 */
export const uploadService = {
  uploadImage: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => {
        reject(new Error('File reading error'));
      };
      reader.readAsDataURL(file);
    });
  }
};

