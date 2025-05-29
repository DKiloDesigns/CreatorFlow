'use server'

export async function createPortalSession() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/billing/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return await response.json()
  } catch (error) {
    console.error('Error creating portal session:', error)
    return { url: null }
  }
} 