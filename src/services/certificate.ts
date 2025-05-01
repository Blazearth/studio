/**
 * Represents a certificate.
 */
export interface Certificate {
  /**
   * The name or title associated with the certificate (e.g., course name).
   */
  name: string;
  /**
   * The URL where the certificate can be viewed or downloaded (potentially a generated PDF).
   */
  url: string;
}

/**
 * Asynchronously retrieves or generates a certificate for a given user and course.
 *
 * @param name The name of the user to appear on the certificate.
 * @param courseTitle The title of the course completed.
 * @returns A promise that resolves to a Certificate object containing the certificate name/title and URL.
 */
export async function getCertificate(name: string, courseTitle: string = 'Intro to Stock Market'): Promise<Certificate> {
  // TODO: Implement this by calling an API endpoint that generates a PDF certificate
  // or retrieves a previously generated one. The API might take user name, course title, date, etc.

  // For now, return mock data including the course title.
  // The URL could point to a placeholder or a service that generates on-the-fly (if implemented).
  console.log(`Generating mock certificate for ${name} for course ${courseTitle}`);

  return {
    name: courseTitle, // Use course title for the 'name' field of the certificate data
    // The URL might include parameters for generation, e.g., /api/certificate?name=JohnDoe&course=Intro
    url: `/mock-certificate/${encodeURIComponent(name)}/${encodeURIComponent(courseTitle)}.pdf`, // Example mock URL structure
  };
}
