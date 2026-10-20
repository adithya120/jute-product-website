import api from './api';

/**
 * Upload up to 5 images for a specific product and variant
 * @param {string|number} productId - Product ID
 * @param {string|number} variantId - Variant ID
 * @param {FileList|File[]|File} files - Image file(s) to upload
 * @param {Object} options - { primaryIndex: number, alt_text: string, alt_texts: string[] }
 */
export const uploadProductImages = async (productId, variantId, files, options = {}) => {
  const formData = new FormData();

  const fileArray = Array.isArray(files)
    ? files
    : files instanceof FileList
    ? Array.from(files)
    : [files];

  fileArray.slice(0, 5).forEach((file) => {
    formData.append('images', file);
  });

  if (options.primaryIndex !== undefined) {
    formData.append('primaryIndex', String(options.primaryIndex));
  }

  if (options.alt_texts && Array.isArray(options.alt_texts)) {
    options.alt_texts.forEach((text) => formData.append('alt_texts', text));
  } else if (options.alt_text) {
    formData.append('alt_text', options.alt_text);
  }

  return await api.post(`/products/${productId}/variants/${variantId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default {
  uploadProductImages,
};
