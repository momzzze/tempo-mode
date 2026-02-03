// Free Pexels API for random nature/world images
// const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY_HERE';

// interface PexelsPhoto {
//   id: number;
//   url: string;
//   src: {
//     original: string;
//     large2x: string;
//     large: string;
//   };
// }

const FALLBACK_IMAGES = [
  'https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg',
  // 'https://images.pexels.com/photos/355770/pexels-photo-355770.jpeg',
  // 'https://images.pexels.com/photos/1470405/pexels-photo-1470405.jpeg',
  // 'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg',
  // 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
  // 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg',
];

export async function fetchRandomWorldImage(): Promise<string> {
  // For demo purposes, use fallback images (Pexels requires API key)
  // To use real API, sign up at https://www.pexels.com/api/

  const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
  return FALLBACK_IMAGES[randomIndex];

  /* Uncomment to use real Pexels API:
  try {
    const queries = ['nature', 'landscape', 'mountains', 'ocean', 'sunset', 'forest', 'beach'];
    const query = queries[Math.floor(Math.random() * queries.length)];
    
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=15&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );
    
    if (!res.ok) throw new Error('Pexels API error');
    
    const data = await res.json();
    const photos: PexelsPhoto[] = data.photos || [];
    
    if (photos.length === 0) {
      return FALLBACK_IMAGES[0];
    }
    
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    return randomPhoto.src.large2x;
  } catch {
    return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  }
  */
}
