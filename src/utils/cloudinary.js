/**
 * Optimizes a Cloudinary image URL by injecting auto-format and auto-quality parameters.
 * If the URL is not a valid Cloudinary URL, it returns the original URL.
 * 
 * @param {string} url - The original image URL
 * @param {object} options - Additional transformation options (e.g. width, height)
 * @returns {string} The optimized Cloudinary URL
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') return url;
  
  // Check if it's a Cloudinary URL
  if (!url.includes('res.cloudinary.com')) return url;

  // Don't double-inject if it already has transformations
  if (url.includes('/upload/f_auto') || url.includes('/upload/q_auto')) return url;

  let transformations = ['f_auto', 'q_auto'];
  
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);

  const transformString = transformations.join(',');

  // Inject transformations after '/upload/'
  return url.replace('/upload/', `/upload/${transformString}/`);
};
