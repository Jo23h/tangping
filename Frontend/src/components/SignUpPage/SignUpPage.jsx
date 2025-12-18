import { useState } from "react"
import { signUp } from "../../services/authService"
import { Link } from "react-router-dom"
import "./SignUpPage.css"

function SignUpPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            await signUp(name, email, password)
            window.location.href = "/signin"
        } catch (error) {
            setError("Signup Failed. Email is in use")
            console.error(error)
        }
    }

    return (
        <div className="page-container">
            <div className="page-box">
                <h1 className="page-title">Create Account</h1>
                <p className="page-subtitle">Join OSPS to start splitting expenses</p>

                <form onSubmit={handleSubmit} className="signup-form">
                    <input
                        type="text"
                        placeholder="Name"
                        className="form-input"
                        value={name}
                        onChange={(event) => setName(event.target.value)}

                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="form-input"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="form-input"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <button type="submit" className="btn-primary"
                    >Sign Up
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