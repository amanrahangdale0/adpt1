// API Configuration and Validation Utility

export type APIConfig = {
  baseURL: string;
  hasAPIKey: boolean;
  isBackendAvailable: boolean;
};

/**
 * Check if API key is available in backend
 */
export async function checkAPIKeyStatus(): Promise<boolean> {
  try {
    const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const response = await fetch(`${baseURL}/api/ai/status`, {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      return data.hasApiKey === true;
    }
    return false;
  } catch (error) {
    console.warn("Backend not available:", error);
    return false;
  }
}

/**
 * Get API configuration
 */
export function getAPIConfig(): APIConfig {
  // Backend API URL (can be configured via env)
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return {
    baseURL,
    hasAPIKey: false, // Will be checked dynamically
    isBackendAvailable: false, // Will be checked dynamically
  };
}

/**
 * Make AI API call with proper error handling
 */
export async function callAIAPI(
  messages: Array<{ role: string; content: string }>,
  apiKey?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const config = getAPIConfig();

    // Try backend API first
    const response = await fetch(`${config.baseURL}/api/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        apiKey, // Optional: user's own API key
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `API request failed with status ${response.status}`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("AI API call failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
}

/**
 * Show user-friendly API error message
 */
export function getAPIErrorMessage(error: string): string {
  if (error.includes("API key") || error.includes("401")) {
    return "⚠️ AI features require an API key. Please add your OpenAI API key in the backend .env file.";
  }

  if (error.includes("Network") || error.includes("fetch")) {
    return "⚠️ Cannot connect to backend server. Make sure it's running.";
  }

  return `⚠️ AI request failed: ${error}`;
}
