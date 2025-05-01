/**
 * Represents a YouTube video.
 */
export interface YouTubeVideo {
  /**
   * The title of the video.
   */
  title: string;
  /**
   * The URL of the video.
   */
  url: string; // Although we use ID for embed, keeping URL might be useful later
  /**
   * The YouTube Video ID.
   */
  videoId: string;
}

/**
 * Asynchronously retrieves YouTube video details for a given video ID.
 *
 * @param videoId The ID of the video to retrieve.
 * @returns A promise that resolves to a YouTubeVideo object.
 */
export async function getYouTubeVideo(videoId: string): Promise<YouTubeVideo> {
  // TODO: Implement this by calling the YouTube Data API or a backend endpoint.
  // For now, return mock data based on the known ID.

  if (videoId === 'YSgk5_WXDfE') { // Example ID used in the course
    return {
      title: 'Stock Market For Beginners | How To Invest (2024)', // Example title
      url: `https://www.youtube.com/watch?v=${videoId}`,
      videoId: videoId,
    };
  }

  // Default mock data for any other ID
  return {
    title: 'Intro to Stock Market (Default)',
    url: `https://www.youtube.com/watch?v=${videoId}`, // Default fallback URL
    videoId: videoId,
  };
}
