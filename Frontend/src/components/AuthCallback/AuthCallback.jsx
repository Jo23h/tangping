import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      // Store the token
      localStorage.setItem('token', token)

      // Decode the token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))

        // Fetch full user details to get profile picture
        fetch('http://localhost:3000/users/' + payload.userId, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(user => {
            localStorage.setItem('user', JSON.stringify({
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              profilePicture: user.profilePicture
            }))

            navigate('/dashboard')
          })
          .catch(err => {
            console.error('Error fetching user details:', err)
            navigate('/dashboard')
          })
      } catch (error) {
        console.error('Error decoding token:', error)
        navigate('/signin')
      }
    } else {
      navigate('/signin')
    }
  }, [searchParams, navigate])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Signing you in...</p>
    </div>
  )
}

export default AuthCallback
