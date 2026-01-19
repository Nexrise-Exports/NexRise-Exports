'use client'

// API configuration and service functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    admin: {
      id: string;
      email: string;
      role: string;
    };
  };
}

interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

export const api = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    let data: any;
    try {
      data = await response.json();
    } catch (error) {
      // If response is not valid JSON, create a default error
      throw new Error('Failed to parse server response');
    }

    if (!response.ok) {
      // Create error with message from backend
      const error = new Error(data.message || data.error || 'Login failed');
      // Attach response data for debugging
      (error as any).response = response;
      (error as any).data = data;
      throw error;
    }

    return data;
  },

  async getProfile(token: string) {
    const response = await fetch(`${API_BASE_URL}/admin/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  async logout(token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header only if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/admin/logout`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();

    // Logout should always succeed, even if token is invalid/expired
    // This allows client-side cleanup to proceed
    if (!response.ok) {
      // Log the error but don't throw - allow logout to proceed
      console.warn('Backend logout warning:', data.message || 'Logout request failed, but proceeding with client-side logout');
      // Return success response anyway to allow client-side cleanup
      return {
        success: true,
        message: 'Logout successful',
      };
    }

    return data;
  },

  // Create Admin API (Superadmin only)
  async createAdmin(token: string, adminData: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/auth/create-admin`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to create admin');
      (error as any).response = response;
      (error as any).data = data;
      throw error;
    }

    return data;
  },

  // Get All Admins API (Superadmin only)
  async getAllAdmins(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/admins`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch admins');
    }

    return data;
  },

  // Delete Admin API (Superadmin only)
  async deleteAdmin(token: string, id: string) {
    const response = await fetch(`${API_BASE_URL}/auth/admins/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete admin');
    }

    return data;
  },

  // Gemini API - Generate Product Details
  async generateProductDetails(token: string, productTitle: string) {
    const response = await fetch(`${API_BASE_URL}/gemini/generate-product-details`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productTitle }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to generate product details');
      (error as any).response = response;
      (error as any).data = data;
      throw error;
    }

    return data;
  },

  // Product API functions
  async createProduct(token: string, productData: any) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Failed to create product');
      (error as any).response = response;
      (error as any).data = data;
      throw error;
    }

    return data;
  },

  async getAllProducts(token: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);

    const response = await fetch(`${API_BASE_URL}/products?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch products');
    }

    return data;
  },

  async updateProduct(token: string, id: string, productData: any) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update product');
    }

    return data;
  },

  async deleteProduct(token: string, id: string) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete product');
    }

    return data;
  },

  // Enquiry API functions
  async getAllEnquiries(token: string, params?: {
    type?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/enquiries?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch enquiries');
    }

    return data;
  },

  async getEnquiryById(token: string, id: string) {
    const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch enquiry');
    }

    return data;
  },

  async updateEnquiry(token: string, id: string, updateData: { status?: string }) {
    const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update enquiry');
    }

    return data;
  },

  async deleteEnquiry(token: string, id: string) {
    const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete enquiry');
    }

    return data;
  },

  // Documentation API functions
  async createDocumentation(token: string, documentationData: { title: string; image: string; status?: string }) {
    const response = await fetch(`${API_BASE_URL}/documentation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentationData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create documentation');
    }

    return data;
  },

  async getAllDocumentation(token: string, params?: { status?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/documentation?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch documentation');
    }

    return data;
  },

  async updateDocumentation(token: string, id: string, documentationData: { title?: string; image?: string; status?: string }) {
    const response = await fetch(`${API_BASE_URL}/documentation/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentationData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update documentation');
    }

    return data;
  },

  async deleteDocumentation(token: string, id: string) {
    const response = await fetch(`${API_BASE_URL}/documentation/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete documentation');
    }

    return data;
  },

  // Category API functions
  async getAllCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch categories');
    }

    return data;
  },

  async createCategory(token: string, categoryData: { name: string; subcategories?: string[] }) {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create category');
    }

    return data;
  },

  async deleteCategory(token: string, id: string) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete category');
    }

    return data;
  },
  // Testimonial API functions
  async getAllTestimonials() {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch testimonials");
    }
    return data;
  },

  async createTestimonial(token: string, testimonialData: { name: string; location: string; rating: number; content: string }) {
    const response = await fetch(`${API_BASE_URL}/testimonials`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testimonialData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create testimonial");
    }
    return data;
  },

  async deleteTestimonial(token: string, id: string) {
    const response = await fetch(`${API_BASE_URL}/testimonials/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete testimonial");
    }
    return data;
  },

  // Flag API functions
  async getAllFlags() {
    const response = await fetch(`${API_BASE_URL}/flags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch flags");
    }
    return data;
  },

  async createFlag(token: string, flagData: { name: string; imageUrl: string }) {
    const response = await fetch(`${API_BASE_URL}/flags`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flagData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create flag");
    }
    return data;
  },

  async deleteFlag(token: string, id: string) {
    const response = await fetch(`${API_BASE_URL}/flags/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete flag");
    }
    return data;
  },
};

export type { LoginRequest, LoginResponse, ApiError };
