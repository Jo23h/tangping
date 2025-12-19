import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { signIn, guestSignIn } from "../../services/authService"
import "./SignInPage.css"

function SignInPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("") // Clear previous errors
        try {
            await signIn(email, password)
            navigate("/dashboard") // Navigate to dashboard after successful login
        } catch (error) {
            setError(error.message || "Invalid credentials")
            console.error(error)
        }
    }

    const handleGuestSignIn = async () => {
        setError("") // Clear previous errors
        try {
            await guestSignIn()
            navigate("/dashboard") // Navigate to dashboard as guest
        } catch (error) {
            setError(error.message || "Guest sign in failed")
            console.error(error)
        }
    }

    return (
        <div className="page-container">
            <div className="page-box">
                <h1 className="page-title">Welcome Back</h1>
                <p className="page-subtitle">Sign in to your Tangping account</p>
                <form onSubmit={handleSubmit} className="signin-form">
                    <input
                        type="email"
                        placeholder="Email"
                        className="form-input"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="form-input"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary">
                        Sign In
                    </button>
                </form>

                {error && <p className="error-message">{error}</p>}

                <button onClick={handleGuestSignIn} className="btn-guest">
                    Sign in as Guest
                </button>

                <p className="signin-link">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    )
}

export default SignInPage