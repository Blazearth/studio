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

// Store mock data in a map for easier lookup
const mockVideoData: Record<string, { title: string }> = {
  'YSgk5_WXDfE': { title: 'Stock Market For Beginners | How To Invest (2024)' },
  'sdMfLkg3MgQ': { title: 'Options Trading for Beginners (The ULTIMATE In-Depth Guide)' },
  'eynxyoKgpng': { title: 'Technical Analysis for Beginners Part 1' },
  'DvpaF3g_798': { title: 'Fundamental Analysis Of Stocks For Beginners' },
};

/**
 * Asynchronously retrieves YouTube video details for a given video ID.
 *
 * @param videoId The ID of the video to retrieve.
 * @returns A promise that resolves to a YouTubeVideo object.
 */
export async function getYouTubeVideo(videoId: string): Promise<YouTubeVideo> {
  // TODO: Implement this by calling the YouTube Data API or a backend endpoint.
  // For now, return mock data based on the known ID.

  const videoInfo = mockVideoData[videoId];

  if (videoInfo) {
    return {
      title: videoInfo.title,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      videoId: videoId,
    };
  }

  // Default mock data for any other ID
  console.warn(`No mock title found for video ID: ${videoId}. Using default.`);
  return {
    title: 'Course Video (Default Title)',
    url: `https://www.youtube.com/watch?v=${videoId}`, // Default fallback URL
    videoId: videoId,
  };
}
