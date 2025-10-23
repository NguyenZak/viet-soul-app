import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;

// Upload functions
export const uploadAudio = async (file, trackId) => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'video', // Cloudinary treats audio as video
          folder: 'vietsoul/tracks',
          public_id: `${trackId}_audio`,
          format: 'mp3'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw error;
  }
};

export const uploadCover = async (file, trackId) => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'vietsoul/covers',
          public_id: `${trackId}_cover`
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading cover:', error);
    throw error;
  }
};

export const uploadLyrics = async (file, trackId) => {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'vietsoul/lyrics',
          public_id: `${trackId}_lyrics`
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });
    
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading lyrics:', error);
    throw error;
  }
};

export const uploadTrackFiles = async (files, trackId) => {
  try {
    const { audio, cover, lyrics } = files;
    
    const uploadPromises = [];
    
    if (audio) {
      uploadPromises.push(
        uploadAudio(audio, trackId).then(url => ({ audioUrl: url }))
      );
    }
    
    if (cover) {
      uploadPromises.push(
        uploadCover(cover, trackId).then(url => ({ coverUrl: url }))
      );
    }
    
    if (lyrics) {
      uploadPromises.push(
        uploadLyrics(lyrics, trackId).then(url => ({ lyricsUrl: url }))
      );
    }
    
    const results = await Promise.all(uploadPromises);
    
    return results.reduce((acc, result) => ({ ...acc, ...result }), {});
  } catch (error) {
    console.error('Error uploading track files:', error);
    throw error;
  }
};
