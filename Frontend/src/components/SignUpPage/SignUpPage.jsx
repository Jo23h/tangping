import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { signUp } from "../../services/authService"
import "./SignUpPage.css"

function SignUpPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError("") 
        try {
            await signUp(name, email, password)
            navigate("/dashboard") 
        } catch (error) {
            setError(error.message || "Signup failed. Email may already be in use")
        }
    }

    return (
        <div className="page-container">
            <div className="page-box">
                <h1 className="page-title">Create Account</h1>
                <p className="page-subtitle">Join Tangping to start managing your tasks</p>

                <form onSubmit={handleSubmit} className="signup-form">
                    <input
                        type="text"
                        placeholder="Name"
                        className="form-input"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
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
                        Sign Up
                    </button>
                </form>

                {error && <p className="error-message">{error}</p>}

                <p className="signup-link">
                    Already have an account? <Link to="/signin">Sign In</Link>
                </p>
            </div>
        </div>
    )
}

export default SignUpPage